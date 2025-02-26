import { buttonVariants } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type Resume, type BreadcrumbItem, type SectionTemplate } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Folder,
    FileText,
    Briefcase,
    Calendar,
    User,
    GraduationCap,
    Cog,
    Code,
    Award,
    Earth,
    Lightbulb,
    Users,
    Trophy,
    Handshake,
    BookOpen,
    Medal,
    UsersRound,
    Share } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Add Section",
        href: "/resume/sections",
    },
];

// Map icon names to Lucide React components
const iconMap: Record<string, React.ElementType> = {
    Folder,
    FileText,
    Briefcase,
    Calendar,
    User,
    GraduationCap,
    Cog,
    Code,
    Award,
    Earth,
    Lightbulb,
    Users,
    Trophy,
    Handshake,
    BookOpen,
    Medal,
    UsersRound,
    Share
};

export default function Sections({ sectionTemplates, resume }: { sectionTemplates: SectionTemplate[], resume?: Resume }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Section" />
            <div className="m-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center m-6">
                    <h1 className="text-2xl font-semibold">Add new Section</h1>
                    {/* Link to go back to Resumes */}
                    <Link
                        href={`/resume`}
                        className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mb-4`}
                    >
                        <Folder className="w-4 h-4" /> Back to Resumes
                    </Link>
                </div>
                <div className="m-6">
                    <h1 className="text-2xl font-semibold mb-4">Select a section template</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sectionTemplates.map((sectionTemplate) => {
                            const IconComponent = iconMap[sectionTemplate.icon] || Folder; // Default to Folder if not found
                            return (
                                <Link
                                    key={sectionTemplate.id}
                                    href={`/resume/${resume?.id}/${sectionTemplate.name}/create`}
                                    className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mb-4`}
                                >
                                    <IconComponent className="w-4 h-4" /> {sectionTemplate.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
