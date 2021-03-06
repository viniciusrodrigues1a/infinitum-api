import { knexRepositoryFactoryImpl } from "@main/factories/repositories";
import { NextFunction, Request, Response } from "express";

export class AddProjectIdToRequestObjectMiddleware {
  async handleRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const findProperty = findPropertyInRequestObject(request);

    let projectId = findProperty("projectId");

    const issueGroupId =
      findProperty("issueGroupId") || findProperty("moveToIssueGroupId");
    if (issueGroupId) {
      projectId = await knexRepositoryFactoryImpl
        .makeFindProjectIdByIssueGroupIdRepository()
        .findProjectIdByIssueGroupId(issueGroupId);
    }

    const issueId = findProperty("issueId");
    if (issueId) {
      projectId = await knexRepositoryFactoryImpl
        .makeFindProjectIdByIssueIdRepository()
        .findProjectIdByIssueId(issueId);
    }

    const invitationToken = findProperty("invitationToken");
    if (invitationToken) {
      projectId = await knexRepositoryFactoryImpl
        .makeFindOneProjectIdByInvitationTokenRepository()
        .findOneProjectIdByToken(invitationToken);
    }

    if (projectId) request.projectId = projectId;

    next();
  }
}

function findPropertyInRequestObject(
  request: Request
): (property: string) => string | undefined {
  return (property: string): string | undefined => {
    if (request.body[property]) return request.body[property];
    if (request.query[property]) return request.query[property] as string;
    if (request.params[property]) return request.params[property];

    return undefined;
  };
}
