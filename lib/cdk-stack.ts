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

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    // DYNAMODB
    const greetingsTable = new dynamodb.Table(this, "GreetingsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING }
    })

    //LAMBDA 
    const saveHelloFunction = this.addFunction(this,"handler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: "lib/lambda/handler.ts",
      environment: {
        GREETINGS_TABLE: greetingsTable.tableName,
      }
    })

    // permisos para lambda
    greetingsTable.grantReadWriteData(saveHelloFunction);

    const helloAPI = new apigw.RestApi(this, "helloApi");

    helloAPI.root
      .resourceForPath("hello")
      .addMethod("POST", new apigw.LambdaIntegration(saveHelloFunction))

  }

  addFunction(
    scope: Construct,
    id: string,
    props: NodejsFunctionProps
  ) {
    return new NodejsFunction(scope, id, { ...props, bundling: { externalModules: ["@aws-sdk/*"] } });
  }

}
