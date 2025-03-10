import { Input } from "@/components/ui/input";
import InputError from '@/components/input-error';
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem, type SharedData, type Resume, type template } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Folder } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Create Resume",
        href: "/resume/create",
    },
];
interface templates {
    data: template[]
}
export default function ResumeCreate({ templates, resume }: { templates: templates, resume?: Resume }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, put, errors, processing, recentlySuccessful } = useForm({
        user_id: auth.user.id,
        title: resume?.title ?? '',
        description: resume?.description ?? '',
        template: resume?.template ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) {
          return;
        } // prevent multiple submissions
    
        if (Object.keys(errors).length > 0) {
            // display error messages to the user
            console.error('Error:', errors);
            return;
        }
    
        if (resume) {
            // Update existing resume
            put(route('resume.update', { id: resume?.id }), {
                preserveScroll: true,
                onError: (error) => {
                    console.error('Error updating resume:', error);
                    // display error message to the user
                }
            });
        } else {
            // Create new resume
            post(route('resume.store'), {
                preserveScroll: true,
                onError: (error) => {
                    console.error('Error creating new resume:', error);
                    // display error message to the user
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Resume" />
            {/* Need some margin around the whole content */}
            <div className="m-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center m-6">
                <h1 className="text-2xl font-semibold">Create Resume</h1>
                    {/* Link to go back to Resumes */}
                    <Link
                        href={`/resume`}
                        className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mb-4`}
                    >
                        <Folder className="w-4 h-4" /> Back to Resumes
                    </Link>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label htmlFor="title">
                            Title
                        </label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description">
                            Description
                        </label>
                        <Textarea
                            name="description"
                            id="description"
                            className="mt-1 block w-full"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="template">
                            Template
                        </label>
                        <Select
                            value={data.template}
                            onValueChange={(value) => setData('template', value)}
                        >
                            <SelectTrigger id="template" className="mt-1 w-full">
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((template) => (
                                    <SelectItem key={template.id} value={template.name.toString()}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.template} />
                    </div>
                    <div className="flex items-center gap-4">
                    <Button
                        disabled={processing}
                    > 
                    {resume? 'Update' : 'Create'}
                    </Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0">
                            <p className="text-sm text-neutral-600">
                                    {processing && 'Processing...'}
                                    {recentlySuccessful && 'Saved'}
                            </p>    
                        </Transition>
                    </div>    
                </form>
            </div>
        </AppLayout>
    );
}