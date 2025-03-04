import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPost = mutation({
  args: {
    title: v.string(),
    language: v.string(),
    description: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const postId = await ctx.db.insert("posts", {
      userId: identity.subject,
      userName: user.name,
      title: args.title,
      language: args.language,
      code: args.code,
      decription: args.description,
    });

    return postId;
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Snippet not found");

    if (post.userId !== identity.subject) {
      throw new Error("Not authorized to delete this snippet");
    }

    const comments = await ctx.db
      .query("postComments")
      .withIndex("by_post_id")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const stars = await ctx.db
      .query("poststars")
      .withIndex("by_post_id")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    for (const star of stars) {
      await ctx.db.delete(star._id);
    }

    await ctx.db.delete(args.postId);
  },
});

export const poststars = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("poststars")
      .withIndex("by_user_id_and_post_id")
      .filter(
        (q) =>
          q.eq(q.field("userId"), identity.subject) && q.eq(q.field("postId"), args.postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("poststars", {
        userId: identity.subject,
        postId: args.postId,
      });
    }
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("postComments", {
      postId: args.postId,
      userId: identity.subject,
      userName: user.name,
      content: args.content,
    });
  },
});

export const deleteComment = mutation({
  args: { postId: v.id("postComments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.postId);
    if (!comment) throw new Error("Comment not found");

    // Check if the user is the comment author
    if (comment.userId !== identity.subject) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.postId);
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return posts;
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    return post;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("postComments")
      .withIndex("by_post_id")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();

    return comments;
  },
});

export const isPostStarred = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const star = await ctx.db
      .query("poststars")
      .withIndex("by_user_id_and_post_id")
      .filter(
        (q) =>
          q.eq(q.field("userId"), identity.subject) && q.eq(q.field("postId"), args.postId)
      )
      .first();

    return !!star;
  },
});

export const getPostStarCount = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const stars = await ctx.db
      .query("poststars")
      .withIndex("by_post_id")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    return stars.length;
  },
});

export const getStarredPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const stars = await ctx.db
      .query("poststars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const posts = await Promise.all(stars.map((star) => ctx.db.get(star.postId)));

    return posts.filter((post) => post !== null);
  },
});
