import { DocumentNode } from 'graphql';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';

type TemplateRequest = (
    query: string,
    endPoint: string,
    variables: object,
    operationName: string,
) => [JSON, Dispatch<SetStateAction<any>> ]

export const useTemplateQuery : TemplateRequest = (query, endPoint, variables, operationName): [JSON, Dispatch<SetStateAction<any>>]=> {
    const [data, setData] = useState(undefined)
    const queryData = async (query : string, endPoint : string, variables : object, operationName: string) => {
        const response = await (await fetch(
            endPoint,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "X-Hasura-Role": "user",
                },
                body: JSON.stringify({
                    query: query,
                    variables: { ...variables },
                    operationName: operationName
                })
            }
        )).json();
        // return response
        setData(response)
    }
    useEffect(() =>{
        queryData(query, endPoint, variables, operationName)
    })
    
    return [ data! as JSON, setData]
}

export const staticQuery = async(query : string | DocumentNode, endPoint : string, header: HeadersInit, variables : object, operationName: string) =>{
    const response = await (await fetch(
        endPoint,
        {
            method: "POST",
            headers: header,
            body: JSON.stringify({
                query: query,
                variables: variables,
                operationName: operationName
            })
        }
    )).json();
    return response
}