import prisma from "../lib/prisma";

export interface CreatePageDto {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface UpdatePageDto {
  title?: string;
  slug?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

class PageService {
  /**
   * Admin - Get all pages
   */
  async getAll() {
    return prisma.page.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Admin - Get page by ID
   */
  async getById(id: string) {
    return prisma.page.findUnique({
      where: { id },
    });
  }

  /**
   * Public - Get page by slug
   */
  async getBySlug(slug: string) {
    return prisma.page.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });
  }

  /**
   * Public - Get all published pages
   */
  async getPublishedPages() {
    return prisma.page.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        updatedAt: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  }

  /**
   * Admin - Create page
   */
  async create(data: CreatePageDto) {
    const existingPage = await prisma.page.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingPage) {
      throw new Error("Page slug already exists");
    }

    return prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished ?? true,
      },
    });
  }

  /**
   * Admin - Update page
   */
  async update(id: string, data: UpdatePageDto) {
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    if (data.slug && data.slug !== page.slug) {
      const slugExists = await prisma.page.findUnique({
        where: {
          slug: data.slug,
        },
      });

      if (slugExists) {
        throw new Error("Page slug already exists");
      }
    }

    return prisma.page.update({
      where: { id },
      data,
    });
  }

  /**
   * Admin - Delete page
   */
  async delete(id: string) {
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    return prisma.page.delete({
      where: { id },
    });
  }

  /**
   * Admin - Toggle Publish Status
   */
  async togglePublish(id: string) {
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    return prisma.page.update({
      where: { id },
      data: {
        isPublished: !page.isPublished,
      },
    });
  }
}

export const pageService = new PageService();