export interface IFindProjectImageDataURLRepository {
  findProjectImageDataURL(projectId: string): Promise<string | undefined>;
}
