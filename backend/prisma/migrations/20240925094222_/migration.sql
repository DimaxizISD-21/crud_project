-- CreateTable
CREATE TABLE "Network" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "calling" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "particularity" TEXT NOT NULL,
    "frequency" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);
