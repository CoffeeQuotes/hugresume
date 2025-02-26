import { Input } from "@/components/ui/input";
import InputError from '@/components/input-error';
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem, type SharedData, type Resume, type personalExperience } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Folder } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Personal Information",
    href: "/resume/section/personal-information",
  },
];
interface personalExperiences {
  data: personalExperience[]
}
export default function PersonalInformation({ resume }: { resume?: Resume }) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, post, put, errors, processing, recentlySuccessful } = useForm({
    user_id: auth.user.id,
    resume_id: resume?.id ?? '',
    first_name: '',
    last_name: '',
    title_before: '',
    title_after: '',
    date_of_birth: '',
    nationality: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    website: '',
    summary: '',
    custom_fields: '',
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
          <h1 className="text-2xl font-semibold">Personal Experience</h1>
          {/* Link to go back to Resumes */}
          <Link
            href={`/resume`}
            className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mb-4`}
          >
            <Folder className="w-4 h-4" /> Back to Resumes
          </Link>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="first_name">
                First name
              </label>
              <Input
                type="text"
                name="first_name"
                id="first_name"
                className="mt-1 block w-full"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                required
              />
              <InputError message={errors.first_name} />
            </div>
            <div>
              <label htmlFor="last_name">
                Last name
              </label>
              <Input
                type="text"
                name="last_name"
                id="last_name"
                className="mt-1 block w-full"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                required
              />
              <InputError message={errors.last_name} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="title_before">
                Title before
              </label>
              <Input
                type="text"
                name="title_before"
                id="title_before"
                className="mt-1 block w-full"
                value={data.title_before}
                onChange={(e) => setData('title_before', e.target.value)}
                required
              />
              <InputError message={errors.title_before} />
            </div>
            <div>
              <label htmlFor="title_after">
                Title After
              </label>
              <Input
                type="text"
                name="title_after"
                id="title_after"
                className="mt-1 block w-full"
                value={data.title_after}
                onChange={(e) => setData('title_after', e.target.value)}
                required
              />
              <InputError message={errors.title_after} />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="last_name">
                 name
            </label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              className="mt-1 block w-full"
              value={data.last_name}
              onChange={(e) => setData('last_name', e.target.value)}
              required
            />
            <InputError message={errors.last_name} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="summary">
              summary
            </label>
            <Textarea
              name="summary"
              id="summary"
              className="mt-1 block w-full"
              value={data.summary}
              onChange={(e) => setData('summary', e.target.value)}
            />
            <InputError message={errors.summary} />
          </div>

          <div className="flex items-center gap-4">
            <Button
              disabled={processing}
            >
              {resume ? 'Update' : 'Create'}
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