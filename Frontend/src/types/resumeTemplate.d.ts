export interface ResumeTemplate {
  id: number;
  name: string;
  image: string;
  downloadUrl: string;
  description: string;
  category: string;
  featured?: boolean;
}
export interface Feature{
    icon: JSX.Element;
    title: string;
}