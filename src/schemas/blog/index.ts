import { array, number, object, string, z } from "zod";

const Blog = object({
  id: number(),
  title: string(),
  description: string(),
  image: string(),
  created_at: string(),
  timeToRead: number(),
});

const BlogList = array(Blog);

const BlogsRes = object({
  blogs: BlogList,
  total: number(),
  page: number(),
});

type BlogType = z.infer<typeof Blog>;
type BlogListType = z.infer<typeof BlogList>;
type BlogsResType = z.infer<typeof BlogsRes>;

export { Blog, BlogList, BlogsRes };
export type { BlogType, BlogListType, BlogsResType };
