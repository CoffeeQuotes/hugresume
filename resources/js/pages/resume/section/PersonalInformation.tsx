import { Input } from "@/components/ui/input";
import InputError from '@/components/input-error';
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem, type SharedData, type Resume, type PersonalInformation } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Folder } from "lucide-react";
import * as React from "react"
import { format, setDate } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Personal Information",
    href: "/resume/section/personal-information",
  },
];

// Define a type for custom fields
type CustomFields = {
  [key: string]: string; // Or string | number | boolean if you expect other types
};


export default function PersonalInformation({ resume, personalInformation }: { resume?: Resume; personalInformation?: PersonalInformation }) {
  const { auth } = usePage<SharedData>().props;

  // Initialize custom_fields as an empty object of type CustomFields
  const [customFields, setCustomFields] = React.useState<CustomFields>({});

  // When the component mounts or the personalInformation changes, initialize customFields
  React.useEffect(() => {
    if (personalInformation && personalInformation.custom_fields) {
      try {
        const parsedCustomFields = JSON.parse(personalInformation.custom_fields);
        setCustomFields(parsedCustomFields);
      } catch (error) {
        console.error("Error parsing custom fields:", error);
        // Handle the error appropriately, maybe set customFields to an empty object
        setCustomFields({});
      }
    } else {
      setCustomFields({}); // Initialize to empty if no personalInformation or custom_fields
    }
  }, [personalInformation]);

  const { data, setData, post, put, clearErrors, errors, processing, recentlySuccessful } = useForm({  // Added clearErrors here
    user_id: auth.user.id,
    resume_id: resume?.id ?? '',
    first_name: personalInformation?.first_name ?? '',
    last_name: personalInformation?.last_name ?? '',
    title_before: personalInformation?.title_before ?? '',
    title_after: personalInformation?.title_after ?? '',
    date_of_birth: personalInformation?.date_of_birth ?? '',
    nationality: personalInformation?.nationality ?? '',
    phone: personalInformation?.phone ?? '',
    email: personalInformation?.email ?? '',
    address: personalInformation?.address ?? '',
    city: personalInformation?.city ?? '',
    state: personalInformation?.state ?? '',
    zip: personalInformation?.zip ?? '',
    country: personalInformation?.country ?? '',
    website: personalInformation?.website ?? '',
    summary: personalInformation?.summary ?? '',
    custom_fields: JSON.stringify(customFields), // Important: Stringify the customFields when sending
  });

  // Function to handle changes in custom fields
  const handleCustomFieldChange = (field: string, value: string) => {
    setCustomFields((prevCustomFields) => ({
      ...prevCustomFields,
      [field]: value,
    }));

    // Update the form data with the stringified custom fields
    setData('custom_fields', JSON.stringify({
      ...customFields,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors before submitting
    clearErrors();  // Add this line to clear errors

    if (processing) {
      return;
    } // prevent multiple submissions



    //Prepare data for submission, either creating new personal information
    // or updating existing data.

    const submitData = {
        ...data,
        custom_fields: JSON.stringify(customFields), //Ensure custom fields are stringified
    };


    if (personalInformation) {
      // Update existing personal information
      put(route('personal-information.update', { id: personalInformation?.id }), { // Adjust the route name
        ...submitData,
        preserveScroll: true,
        onSuccess: () => {
          console.log('Personal information updated successfully');
        },
        onError: (error) => {
          console.error('Error updating personal information:', error);
          
        }
      });
    } else {
      // Create new personal information
      post(route('personal-information.store',{resume: resume?.id}), { // Adjust the route name
        ...submitData,
        preserveScroll: true,
        onError: (error) => {
          console.error('Error creating new personal information:', error);
          // display error message to the user
        }
      });
    }
  };

  // Example of how to add custom fields dynamically (you might fetch this from config or database)
  const availableCustomFields = ["LinkedIn", "GitHub", "Other Field"];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Resume" />
      {/* Need some margin around the whole content */}
      <div className="m-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-center m-6">
          <h1 className="text-2xl font-semibold">Personal Information</h1>
          {/* Link to go back to Resumes */}
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
          <div className="grid md:grid-cols-2 gap-2">
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
              />
              <InputError message={errors.title_after} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <div className="mt-1">
                <label htmlFor="date_of_birth">
                  Date of birth
                </label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.date_of_birth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {data.date_of_birth
                      ? format(new Date(data.date_of_birth), "PPP")
                      : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
                    onSelect={(date) => {
                      if (date && date > new Date()) {
                        alert("Date of birth cannot be in the future!");
                      } else {
                        // Important: Format the date to ISO string YYYY-MM-DD
                        const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                        setData('date_of_birth', formattedDate); // Update Inertia form data.
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
              <InputError message={errors.date_of_birth} />
            </div>
            {/* nationality */}
            <div>
              <label htmlFor="nationality">
                Nationality
              </label>
              <Input
                type="text"
                name="nationality"
                id="nationality"
                className="mt-1 block w-full"
                value={data.nationality}
                onChange={(e) => setData('nationality', e.target.value)}
                required
              />
              <InputError message={errors.nationality} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <label htmlFor="phone">
                Phone
              </label>
              <Input
                type="text"
                name="phone"
                id="phone"
                className="mt-1 block w-full"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                required
              />
              <InputError message={errors.phone} />
            </div>
            <div>
              <label htmlFor="email">
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              <InputError message={errors.email} />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="summary">
              Summary
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
          <div className="grid md:grid-cols-2 gap-2">
            <div className="">
              <label htmlFor="address">
                Address (Street/Apt)
              </label>
              <Textarea
                name="address"
                id="address"
                className="mt-1 block w-full"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
              />
              <InputError message={errors.address} />
            </div>
            <div className="">
              <label htmlFor="city">
                City
              </label>
              <Input
                type="city"
                name="city"
                id="city"
                className="mt-1 block w-full"
                value={data.city}
                onChange={(e) => setData('city', e.target.value)}
                required
              />
              <InputError message={errors.city} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            <div>
              <label htmlFor="state">
                State
              </label>
              <Input
                type="state"
                name="state"
                id="state"
                className="mt-1 block w-full"
                value={data.state}
                onChange={(e) => setData('state', e.target.value)}
                required
              />
              <InputError message={errors.state} />
            </div>
            <div>
              <label htmlFor="zip">
                Zip
              </label>
              <Input
                type="zip"
                name="zip"
                id="zip"
                className="mt-1 block w-full"
                value={data.zip}
                onChange={(e) => setData('zip', e.target.value)}
                required
              />
              <InputError message={errors.zip} />
            </div>
            <div>
              <label htmlFor="country">
                Country
              </label>
              <Input
                type="country"
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
          <div className="grid gap-2">
              <div>
              <label htmlFor="website">
                Website
              </label>
              <Input
                type="website"
                name="website"
                id="website"
                className="mt-1 block w-full"
                value={data.website}
                onChange={(e) => setData('website', e.target.value)}
              />
              <InputError message={errors.website} />
              </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
              {/* Custom fields */}
              {availableCustomFields.map((field) => (
                <div key={field}>
                  <label htmlFor={`custom_${field}`}>{field}</label>
                  <Input
                    type="text"
                    id={`custom_${field}`}
                    className="mt-1 block w-full"
                    value={customFields[field] || ""}
                    onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={processing}
            >
              {personalInformation ? 'Update' : 'Create'}
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