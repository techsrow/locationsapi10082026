import prisma from "../lib/prisma";

export const galleryService = {
  async getAll() {
    return prisma.gallery.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });
  },

  async getById(id: string) {
    return prisma.gallery.findUnique({
      where: { id },
    });
  },

  async create(data: {
    imageUrl: string;
    displayOrder?: number;
    imageType?: string;
    isActive?: boolean;
  }) {
    return prisma.gallery.create({
      data: {
        imageUrl: data.imageUrl,
        displayOrder: data.displayOrder || 0,
        imageType: data.imageType || "wide",
        isActive: data.isActive ?? true,
      },
    });
  },

  async update(
    id: string,
    data: {
      imageUrl?: string;
      displayOrder?: number;
      imageType?: string;
      isActive?: boolean;
    }
  ) {
    return prisma.gallery.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.gallery.delete({
      where: { id },
    });
  },

  async getPublicGallery() {
    return prisma.gallery.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  },



  async reorder(
  items: {
    id: string;
    displayOrder: number;
  }[]
) {
  await Promise.all(
    items.map((item) =>
      prisma.gallery.update({
        where: {
          id: item.id,
        },
        data: {
          displayOrder:
            item.displayOrder,
        },
      })
    )
  );

  return true;
},
};

