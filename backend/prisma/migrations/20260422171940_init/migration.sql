-- CreateTable
CREATE TABLE "ProjectSnapshot" (
    "id" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "fundingGoalWei" TEXT NOT NULL,
    "amountRaisedWei" TEXT NOT NULL,
    "totalContributors" INTEGER NOT NULL,
    "creationTime" BIGINT NOT NULL,
    "durationSeconds" BIGINT NOT NULL,
    "category" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionSnapshot" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "contributor" TEXT NOT NULL,
    "amountWei" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncState" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncState_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContributionSnapshot_projectId_contributor_key" ON "ContributionSnapshot"("projectId", "contributor");
