import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Resume {
    id: number;
    user_id: number;
    title: string;
    description: string;
    template: string;
    created_at: string;
    updated_at: string;
}

export interface template {
    id: number;
    name: string;
}

export interface section {
    id:number; 	
    resume_id: number; 	
    name: string; 	
    content: string; 	
    form_template: string; 	
    order: number; 	
    created_at: string; 	
    updated_at: string; 	

}

export interface SectionTemplate {
    id: number;
    name: string;
    icon: string;
}

export interface personalExperience {
    user_id: number,
    resume_id: number,
    first_name:string, 	
    last_name:string, 	
    title_before:string, 	
    title_after:string, 	
    date_of_birth:string, 	
    nationality:string, 	
    phone:string, 	
    email:string, 	
    address:string,
    city:string, 	
    state:string, 	
    zip:string, 	
    country:string, 	
    website:string, 	
    summary:string, 	
    custom_fields:JSON,
}