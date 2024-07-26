interface CommentInterface {
  comment: string;
  email: string;
  imageUrl: string;
  name: string;
  rate: number;
}

export interface PostInterface {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  author: string;
  link: string;
  review: CommentInterface[];
}
