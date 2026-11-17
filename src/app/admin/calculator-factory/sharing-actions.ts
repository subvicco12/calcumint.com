'use server';
import {loadFactoryNineWorkspace,loadFactoryNineTemplate,storeFactoryNineShare} from '@/lib/business/factory-nine-sharing-server';
export async function factorySharingWorkspace(input:Parameters<typeof loadFactoryNineWorkspace>[0]){return loadFactoryNineWorkspace(input);}
export async function factorySharingTemplate(input:Parameters<typeof loadFactoryNineTemplate>[0]){return loadFactoryNineTemplate(input);}
export async function factoryShareSnapshot(expectedOwnerId:string,payload:unknown){return {recordId:await storeFactoryNineShare(expectedOwnerId,payload)};}
export async function factorySharingOrganizations(expectedOwnerId:string){const {listFactoryNineOrganizations}=await import('@/lib/business/factory-nine-sharing-server');return listFactoryNineOrganizations(expectedOwnerId);}
export async function factorySharingProjects(input:{expectedOwnerId:string;organizationId:string}){const {listFactoryNineProjects}=await import('@/lib/business/factory-nine-sharing-server');return listFactoryNineProjects(input);}
