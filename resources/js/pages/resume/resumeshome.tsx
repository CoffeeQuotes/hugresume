import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import type { Resume, BreadcrumbItem, PageProps } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Calendar, FileText, Plus, Eye, Search, X } from "lucide-react";
import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Resumes",
    href: "/resume",
  },
];

interface Resumes extends PageProps {
  resumes: {
    data: Resume[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  filters: {
    title?: string;
    template?: string;
    date_filter?: string;
  };
  templates: string[];
}

export default function ResumeHome({ resumes, filters, templates }: Resumes) {
  const [titleFilter, setTitleFilter] = useState(filters.title || "");
  
  // Apply filters with debounce for title search
  const applyFilters = debounce((newFilters: typeof filters) => {
    router.get('/resume', newFilters, {
      preserveState: true,
      replace: true,
    });
  }, 300);
  
  // Handle title filter changes
  const handleTitleChange = (value: string) => {
    setTitleFilter(value);
    applyFilters({ ...filters, title: value });
  };
  
  // Handle template filter changes
  const handleTemplateChange = (value: string) => {
    // If "all" is selected, remove the template filter
    if (value === "all") {
      const { template, ...restFilters } = filters;
      applyFilters(restFilters);
    } else {
      applyFilters({ ...filters, template: value });
    }
  };
  
  // Handle date filter changes
  const handleDateFilterChange = (value: string) => {
    applyFilters({ ...filters, date_filter: value });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setTitleFilter("");
    router.get('/resume', {}, {
      preserveState: true,
      replace: true,
    });
  };
  
  // Get current template value for the select
  const getCurrentTemplateValue = () => {
    return filters.template || "all";
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Resume" />
      <div className="flex justify-between items-center m-6">
        <h1 className="text-2xl font-semibold">Resumes</h1>
        <Link
          href="/resume/create"
          className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" /> Create Resume
        </Link>
      </div>
      
      {/* Filters */}
      <div className="mx-6 p-4 bg-muted rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="w-full md:w-1/3">
            <label htmlFor="title-filter" className="text-sm font-medium mb-1 block">
              Search by Title
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="title-filter"
                placeholder="Search resumes..."
                className="pl-8"
                value={titleFilter}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="template-filter" className="text-sm font-medium mb-1 block">
              Filter by Template
            </label>
            <Select
              value={getCurrentTemplateValue()}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger id="template-filter">
                <SelectValue placeholder="All templates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All templates</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="date-filter" className="text-sm font-medium mb-1 block">
              Sort by
            </label>
            <Select
              value={filters.date_filter || "newest"}
              onValueChange={handleDateFilterChange}
            >
              <SelectTrigger id="date-filter">
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="recently_updated">Recently updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="mt-4 md:mt-0"
          >
            <X className="w-4 h-4 mr-1" /> Clear filters
          </Button>
        </div>
      </div>
      
      {/* Resume grid */}
      {resumes.data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 m-6">
          {resumes.data.map((resume) => (
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
                <Link
                  href={`/resume/${resume.id}/edit`}
                  className={`${buttonVariants({ variant: "default", size: "sm" })} flex items-center gap-2 mt-4 w-full`}
                >
                  <Eye className="w-4 h-4" /> Edit Resume
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 m-6 bg-muted rounded-lg">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No resumes found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or create a new resume</p>
          <Link
            href="/resume/create"
            className={`${buttonVariants({ variant: "default" })} mt-6 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" /> Create Resume
          </Link>
        </div>
      )}
      
      {/* Pagination */}
      {resumes.last_page > 1 && (
        <div className="m-6">
          <PaginationContent>
            {resumes.current_page > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href={`/resume?page=${resumes.current_page - 1}${filters.title ? `&title=${filters.title}` : ''}${filters.template ? `&template=${filters.template}` : ''}${filters.date_filter ? `&date_filter=${filters.date_filter}` : ''}`} 
                />
              </PaginationItem>
            )}
            
            {resumes.links.slice(1, -1).map((link, i) => (
              <PaginationItem key={i}>
                {link.url ? (
                  <PaginationLink 
                    href={`${link.url}${filters.title ? `&title=${filters.title}` : ''}${filters.template ? `&template=${filters.template}` : ''}${filters.date_filter ? `&date_filter=${filters.date_filter}` : ''}`}
                    isActive={link.active}
                  >
                    {link.label}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}
            
            {resumes.current_page < resumes.last_page && (
              <PaginationItem>
                <PaginationNext 
                  href={`/resume?page=${resumes.current_page + 1}${filters.title ? `&title=${filters.title}` : ''}${filters.template ? `&template=${filters.template}` : ''}${filters.date_filter ? `&date_filter=${filters.date_filter}` : ''}`} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </div>
      )}
    </AppLayout>
  );
}