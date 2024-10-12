export type SlideLayout = 'default' | 'image-left' | 'image-right' | 'image-background';

export interface MediaItem {
  id: string;
  source: string;
  alt?: string;
  type: 'image' | 'video';
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
  layout: SlideLayout;
  media?: MediaItem[];
}

export interface Module {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

export type ModuleWithoutId = Omit<Module, 'id'>;
export type SlideWithoutId = Omit<Slide, 'id'>;

export type UpdateModule = Partial<Module>;
export type UpdateSlide = Partial<Slide>;
