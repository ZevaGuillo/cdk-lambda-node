import {DynamoDB} from "aws-sdk"; 
import { PutItemInput } from "aws-sdk/clients/dynamodb";

const TABLE_NAME = process.env.GREETINGS_TABLE


export const handler = async (event: any) => {
    console.log("save Hello");

    const name = event.queryStringParameters.name;

    const item = {
        id: name,
        name: name,
        date: Date.now()
    }

    const savedItem = async(item: {id: string, name: string, date: Number}) => {
        const params = {
            TableName: TABLE_NAME,
            Item: item 
        };
        
        console.log(params);

        const client = new DynamoDB.DocumentClient();
    
        return await client.put(params as PutItemInput).promise()
    
    }

    const newData = await savedItem(item);

    return {
        statusCode: 200,
        body: JSON.stringify(newData)
    }
}