import { type BreadcrumbItem, type SharedData, type Resume, type Education } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { format, setDate } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Transition } from "@headlessui/react";
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Education",
        href: "/resume/section/personal-information",
    },
];

export default function Education({ resume, education }: { resume?: Resume; education?: Education }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, put, clearErrors, errors, processing, recentlySuccessful } = useForm({
        user_id: auth.user.id,
        resume_id: resume?.id ?? '',
        institution_name: education?.institution_name ?? '',
        field_of_study: education?.field_of_study ?? '',
        degree: education?.degree ?? '',
        city: education?.city ?? '',
        country: education?.country ?? '',
        started: education?.started ?? '',
        currently_studying: education?.currently_studying ?? '',
        ended: education?.ended ?? '',
        description: education?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (processing) {
            return;
        }

        const submitData = {
            ...data,
        }

        if (education) {
            put(route('education.update', {
                id: education?.id
            }), {
                ...submitData,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Education updated successfully');
                },
                onError: (error) => {
                    console.error('Error updating education:', scroll);
                }
            });
        } else {
            post(route('education.store', { resume: resume?.id }), {
                ...submitData,
                preserveScroll: true,
                onError: (error) => {
                    console.error('Error creating a new education:', error);
                }
            });
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Education" />
            <div className="m-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center m-6">
                    <h1 className="text-2xl font-semibold">Education</h1>
                    <Link
                        href={`/resume/${resume?.id}/sections`}
                        className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mb-4`}
                    >
                        <Folder className="w-4 h-4" /> Back to section
                    </Link>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-2">
                        <div>
                            <label htmlFor="institution_name">Institution name</label>
                            <Input
                                type="text"
                                name="institution_name"
                                id="institution_name"
                                className="mt-1 block w-full"
                                value={data.institution_name}
                                onChange={(e) => setData('institution_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.institution_name} />
                        </div>
                        <div>
                            <label htmlFor="field_of_study">Field of study</label>
                            <Input
                                type="text"
                                name="field_of_study"
                                id="field_of_study"
                                className="mt-1 block w-full"
                                value={data.field_of_study}
                                onChange={(e) => setData('field_of_study', e.target.value)}
                                required
                            />
                            <InputError message={errors.field_of_study} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div>
                            <label htmlFor="degree">Degree</label>
                            <Input
                                type="text"
                                name="degree"
                                id="degree"
                                className="mt-1 block w-full"
                                value={data.degree}
                                onChange={(e) => setData('degree', e.target.value)}
                                required
                            />
                            <InputError message={errors.degree} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                        <div>
                            <label htmlFor="city">City</label>
                            <Input
                                type="text"
                                name="city"
                                id="city"
                                className="mt-1 block w-full"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                            />
                            <InputError message={errors.city} />
                        </div>
                        <div>
                            <label htmlFor="country">Country</label>
                            <Input
                                type="text"
                                name="country"
                                id="country"
                                className="mt-1 block w-full"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                required
                            />
                            <InputError message={errors.country} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                        <div>
                            <div className="mt-1">
                                <label htmlFor="started">
                                    Started
                                </label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.started && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {data.started
                                            ? format(new Date(data.started), "PPP")
                                            : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={data.started ? new Date(data.started) : undefined}
                                        onSelect={(date) => {
                                            if (date && date > new Date()) {
                                                alert("Date of birth cannot be in the future!");
                                            } else {
                                                // Important: Format the date to ISO string YYYY-MM-DD
                                                const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                                                setData('started', formattedDate); // Update Inertia form data.
                                            }
                                        }}
                                        captionLayout="dropdown"
                                        toYear={new Date().getFullYear() - 18}
                                        fromYear={1900}
                                        classNames={{
                                            day_hidden: "invisible",
                                            dropdown: "px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                                            caption_dropdowns: "flex gap-3",
                                            vhidden: "hidden",
                                            caption_label: "hidden",
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.started} />
                        </div>
                        <div>
                            <div className="mt-1">
                                <label htmlFor="ended">
                                    Ended
                                </label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.ended && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {data.ended
                                            ? format(new Date(data.ended), "PPP")
                                            : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={data.ended ? new Date(data.ended) : undefined}
                                        onSelect={(date) => {
                                            if (date && date > new Date()) {
                                                alert("Date of birth cannot be in the future!");
                                            } else {
                                                // Important: Format the date to ISO string YYYY-MM-DD
                                                const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                                                setData('ended', formattedDate); // Update Inertia form data.
                                            }
                                        }}
                                        captionLayout="dropdown"
                                        toYear={new Date().getFullYear() - 18}
                                        fromYear={1900}
                                        classNames={{
                                            day_hidden: "invisible",
                                            dropdown: "px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                                            caption_dropdowns: "flex gap-3",
                                            vhidden: "hidden",
                                            caption_label: "hidden",
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.ended} />
                        </div>
                    </div>
                    <div className="items-top flex space-x-2">
                        <Checkbox id="currently_studying" />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="currently_studying"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I currently study here
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Tick if you are currently studying here.
                            </p>
                        </div>
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
                    <div className="flex items-center gap-4">
                        <Button
                            disabled={processing}
                        >
                            {education ? 'Update' : 'Create'}
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
    )
}