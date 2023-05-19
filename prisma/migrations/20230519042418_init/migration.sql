-- CreateTable
CREATE TABLE "Memorial" (
    "id" SERIAL NOT NULL,
    "image" TEXT[],
    "UUID" TEXT NOT NULL,

    CONSTRAINT "Memorial_pkey" PRIMARY KEY ("id")
);
