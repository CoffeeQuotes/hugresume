import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import type { Resume, BreadcrumbItem } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { Calendar, FileText, Plus, Eye } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Resumes",
    href: "/resume",
  },
]

interface Resumes {
  resumes: Resume[]
}

export default function ResumeHome({ resumes }: Resumes) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Resume" />
      <div className="flex justify-between items-center m-6">
        <h1 className="text-2xl font-semibold">Resumes</h1>
        <Link 
                href="/resume/create" 
                className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mb-4`}
            >
                <Plus className="w-4 h-4" /> Create Resume
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 m-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {resume.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resume.description && <p className="text-sm text-muted-foreground mb-2">{resume.description}</p>}
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {resume.created_at}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                <span>Updated: {resume.updated_at}</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Template:</strong> {resume.template}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full flex items-center gap-2 cursor-pointer">
                <Eye className="w-4 h-4" /> View Resume
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  )
}

