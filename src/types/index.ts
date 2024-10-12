export type SlideLayout = 'default' | 'image-left' | 'image-right' | 'image-background';

export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imagePrompt: string;
  layout: SlideLayout;
}

export interface Module {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}
