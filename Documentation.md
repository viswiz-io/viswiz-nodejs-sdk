# VisWiz.io Node.js SDK Documentation

Welcome to the [VisWiz.io](http://www.viswiz.io/) Node.js SDK documentation.

The SDK allows you to query and create new projects, builds or images within the VisWiz service.

<a name="VisWiz"></a>

## VisWiz
**Kind**: global class  

* [VisWiz](#VisWiz)
    * [new VisWiz(apiKey, [options])](#new_VisWiz_new)
    * [.getAccount()](#VisWiz+getAccount) ⇒ <code>Promise</code>
    * [.getWebhooks()](#VisWiz+getWebhooks) ⇒ <code>Promise</code>
    * [.createWebhook(body)](#VisWiz+createWebhook) ⇒ <code>Promise</code>
    * [.getProjects()](#VisWiz+getProjects) ⇒ <code>Promise</code>
    * [.createProject(body)](#VisWiz+createProject) ⇒ <code>Promise</code>
    * [.getBuilds(projectID)](#VisWiz+getBuilds) ⇒ <code>Promise</code>
    * [.createBuild(params)](#VisWiz+createBuild) ⇒ <code>Promise</code>
    * [.finishBuild(buildID)](#VisWiz+finishBuild) ⇒ <code>Promise</code>
    * [.getBuildResults(buildID)](#VisWiz+getBuildResults) ⇒ <code>Promise</code>
    * [.getImages(buildID)](#VisWiz+getImages) ⇒ <code>Promise</code>
    * [.createImage(buildID, name, filePath)](#VisWiz+createImage) ⇒ <code>Promise</code>

<a name="new_VisWiz_new"></a>

### new VisWiz(apiKey, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | The API Key value for a VisWiz.io account |
| [options] | <code>object</code> |  |  |
| [options.server] | <code>string</code> | <code>&quot;api.viswiz.io&quot;</code> | The server URL prefix for all requests |

**Example**  
```js
const client = new VisWiz('your-unique-api-key-here');
```
<a name="VisWiz+getAccount"></a>

### client.getAccount() ⇒ <code>Promise</code>
Get the current account information

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>object</code> - The current account object  
**Example**  
```js
const account = await client.getAccount();
```
<a name="VisWiz+getWebhooks"></a>

### client.getWebhooks() ⇒ <code>Promise</code>
Get the list of webhooks configured for the account.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>array&lt;object&gt;</code> - The list of webhooks objects  
**Example**  
```js
const webhooks = await client.getWebhooks();
```
<a name="VisWiz+createWebhook"></a>

### client.createWebhook(body) ⇒ <code>Promise</code>
When a build comparison is finished a POST HTTP request will be triggered towards all
webhooks configured for the account.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>object</code> - The new webhook object  

| Param | Type |
| --- | --- |
| body | <code>object</code> | 

**Example**  
```js
const webhook = await client.createWebhooks({
  url: 'http://amazing.com/webhook-handler'
});
```
<a name="VisWiz+getProjects"></a>

### client.getProjects() ⇒ <code>Promise</code>
Get a list of all the projects for the account.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>array&lt;object&gt;</code> - The list of projects objects  
**Example**  
```js
const projects = await client.getProjects();
```
<a name="VisWiz+createProject"></a>

### client.createProject(body) ⇒ <code>Promise</code>
Create a new project for the account.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>object</code> - The new project object  

| Param | Type |
| --- | --- |
| body | <code>object</code> | 

**Example**  
```js
const project = await client.createProject({
  name: 'My Amazing Project',
  url: 'http://github.com/amaze/project'
});
```
<a name="VisWiz+getBuilds"></a>

### client.getBuilds(projectID) ⇒ <code>Promise</code>
Get a list of all the builds for a project.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>array&lt;object&gt;</code> - The list of builds objects  

| Param | Type | Description |
| --- | --- | --- |
| projectID | <code>integer</code> | The requested project ID |

**Example**  
```js
const builds = await client.getBuilds(123);
```
<a name="VisWiz+createBuild"></a>

### client.createBuild(params) ⇒ <code>Promise</code>
Create a new build for a project.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>object</code> - The new build object  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The request params |
| params.projectID | <code>integer</code> | The requested project ID |

**Example**  
```js
const build = await client.createBuild({
  name: 'New amazing changes',
  revision: '62388d1e81be184d4f255ca2354efef1e80fbfb8'
});
```
<a name="VisWiz+finishBuild"></a>

### client.finishBuild(buildID) ⇒ <code>Promise</code>
Finish a build when all images have been created. This triggers the actual build comparison to execute.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  

| Param | Type | Description |
| --- | --- | --- |
| buildID | <code>integer</code> | The requested build ID |

**Example**  
```js
await client.finishBuild(4567);
```
<a name="VisWiz+getBuildResults"></a>

### client.getBuildResults(buildID) ⇒ <code>Promise</code>
Get the results for a build which has been compared to another build.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>object</code> - The build results object  

| Param | Type | Description |
| --- | --- | --- |
| buildID | <code>integer</code> | The requested build ID |

**Example**  
```js
const buildResults = await client.getBuildResults(4567);
```
<a name="VisWiz+getImages"></a>

### client.getImages(buildID) ⇒ <code>Promise</code>
Get a list of all images for a build.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>array&lt;object&gt;</code> - The list of images objects  

| Param | Type | Description |
| --- | --- | --- |
| buildID | <code>integer</code> | The requested build ID |

**Example**  
```js
const images = await client.getImages(4567);
```
<a name="VisWiz+createImage"></a>

### client.createImage(buildID, name, filePath) ⇒ <code>Promise</code>
Upload a new image for a build. This endpoint accepts only one PNG image per request.

**Kind**: instance method of [<code>VisWiz</code>](#VisWiz)  
**Fulfil**: <code>object</code> - The new image object  

| Param | Type | Description |
| --- | --- | --- |
| buildID | <code>integer</code> | The requested build ID |
| name | <code>string</code> | The image name |
| filePath | <code>string</code> | The image file path |

**Example**  
```js
const image = await client.createImage(4567, 'image-name', '/path/to/image.png');
```
---

Documentation generated on **Mon, 04 Dec 2017 17:29:56 GMT**
