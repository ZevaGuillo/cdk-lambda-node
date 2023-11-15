import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DYNAMODB
    const greetingsTable = new dynamodb.Table(this, "GreetingsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING }
    })

    //LAMBDA 
    const saveHelloFunction = this.addFunction(this, "handler", {
      entry: "lib/lambda/handler.ts",
      environment: {
        GREETINGS_TABLE: greetingsTable.tableName,
      }
    })

    const fetchFunction = this.addFunction(this, "handlerFetch", {
      entry: "lib/lambda/handlerFetch.ts",
    });

    // permisos para lambda
    greetingsTable.grantReadWriteData(saveHelloFunction);

    // const helloAPI = new apigw.RestApi(this, "helloApi");

    // helloAPI.root
    //   .resourceForPath("hello")
    //   .addMethod("POST", new apigw.LambdaIntegration(saveHelloFunction))

    // const api = new apigw.LambdaRestApi(this, "myapi", {
    //   handler: fetchFunction,
    // })
  
    // const user = api.root.addResource('users');
    // user.addMethod('GET');
    // user.addMethod('POST');

    const fetchAPI = new apigw.RestApi(this, "fetchAPI");

    fetchAPI.root
      .resourceForPath("user")
      .addMethod("GET", new apigw.LambdaIntegration(fetchFunction))
    
    
  }

  addFunction(
    scope: Construct,
    id: string,
    props: NodejsFunctionProps
  ) {
    return new NodejsFunction(scope, id, {
      ...props,
      runtime: lambda.Runtime.NODEJS_18_X,
      bundling: {
        externalModules: ["@aws-sdk/*"]
      }
    });
  }

}
