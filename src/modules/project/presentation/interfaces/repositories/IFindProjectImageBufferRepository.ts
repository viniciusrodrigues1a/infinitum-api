export interface IFindProjectImageBufferRepository {
  findProjectImageBuffer(projectId: string): Promise<Buffer | undefined>;
}
