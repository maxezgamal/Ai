
export interface PostData {
  title: string;
  caption: string;
  hashtags: string[];
}

export interface ImageData {
  image_prompt: string;
}

export interface GeneratedContent {
  post: PostData;
  image: ImageData;
}
