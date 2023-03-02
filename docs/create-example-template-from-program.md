All these queries use a token and sg-user in the HTTP headers
```json
{
  "Authorization":"Token 5c0f00d28a6ecc69073854652c0a6fa88cabb504",
  "sg-user":"ad12fa6c-838c-44b9-b388-1ed75eb3035b"
}
```

Link the test user to the program:
```graphql
mutation{
    result:updateUserProgram(
        programId: "UHJvZ3JhbTphNGYxMTk3ZS1lN2ZlLTQzNjUtODBmNC1mNGY1ZmQ2MzQ1MmU="
    ) {
        success
    }
}
```

Generate a meal plan:
```graphql
mutation{
  generateMealPlan{
    success
  }
}
```

Create a template from the next week
```graphql
mutation {
  createMealPlanTemplate(
    description:""
    name: "Balanced Diet"
    fromDays: {
      fromDate: "2022-01-05"
      profileId: "UHJvZmlsZVR5cGU6ZjFiZjJkYzAtNGE5Ny00ZGU3LTgyNjUtNjBlYWY4MWY0ZTY0"
      toDate: "2022-01-11"
    }
  ) {
    success
    message
  }
}
```