-- CreateTable
CREATE TABLE "TownMap2308" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "steamName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "SNS" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "position" DOUBLE PRECISION[],
    "UUID" TEXT NOT NULL,
    "like" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TownMap2308_pkey" PRIMARY KEY ("id")
);
