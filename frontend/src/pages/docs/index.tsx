import PageLayout from "@/components/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/configs/envConfig";
import { useTheme } from "@/context/theme-provider";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import atomOneLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";

SyntaxHighlighter.registerLanguage("javascript", js);

const Docs = () => {
  const { theme } = useTheme();
  const public_baseurl = env.API_BASE_URL;
  const codeTheme = theme === "light" ? atomOneLight : atomOneDark;
  const backgroundColor = theme === "dark" ? "#161616" : "#fafafa";

  return (
    <PageLayout title="Docs" subtitle="Cloud Upload API Documentation">
      <div className="mx-auto px-1">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">TypeScript/JavaScript SDK</h2>
          <p className="text-sm text-muted-foreground mb-6">
            TypeScript library for uploading files to Cloud Upload API. Works in
            Node.js, Next.js, and browsers. Remember to create your API key on
            your{" "}
            <Link
              to={PROTECTED_ROUTES.APIKEYS}
              className="text-primary underline"
            >
              API Keys page
            </Link>
            .
          </p>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 Upload Limits
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>File size limit:</strong> 200KB per file</li>
              <li>• <strong>Storage limit:</strong> 100MB total per user</li>
              <li>• <strong>Concurrent uploads:</strong> Up to 10 files per request</li>
            </ul>
          </div>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language=""
                  style={codeTheme}
                  customStyle={{
                    background: backgroundColor,
                  }}
                >
                  {"npm install @balendra/cloud-upload-client"}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                Upload files with just a few lines of code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language="javascript"
                  style={codeTheme}
                  customStyle={{
                    background: backgroundColor,
                    padding: "1rem",
                  }}
                >
                  {`import { CloudUploadClient } from "@balendra/cloud-upload-client";

const client = new CloudUploadClient({
  apiKey: process.env.CLOUDUPLOAD_API_KEY, // Your API key
});

// Upload files
const result = await client.uploadFiles(files);
console.log(result.files);`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Node.js Usage</CardTitle>
              <CardDescription>
                Upload from file paths or buffers in Node.js applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language="javascript"
                  style={codeTheme}
                  customStyle={{
                    margin: 0,
                    background: backgroundColor,
                    padding: "1rem",
                  }}
                >
                  {`import { CloudUploadClient } from "@balendra/cloud-upload-client";
import fs from "fs";

const client = new CloudUploadClient({
  apiKey: process.env.CLOUDUPLOAD_API_KEY,
});

// Upload from file path
await client.uploadFiles("/path/to/file.jpg");

// Multiple files
await client.uploadFiles(["/path/to/file1.jpg", "/path/to/file2.pdf"]);

// Upload buffer
const buffer = fs.readFileSync("image.jpg");
buffer.name = "image.jpg";
buffer.type = "image/jpeg";
await client.uploadFiles(buffer);`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Browser/React Usage</CardTitle>
              <CardDescription>
                Upload File objects from file inputs in the browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language="javascript"
                  style={codeTheme}
                  customStyle={{
                    margin: 0,
                    background: backgroundColor,
                    padding: "1rem",
                  }}
                >
                  {`import { CloudUploadClient } from "@balendra/cloud-upload-client";

const client = new CloudUploadClient({
  apiKey: "your-api-key",
  forceBrowser: true,
});

// From file input
const fileInput = document.querySelector('input[type="file"]');
await client.uploadFiles(fileInput.files[0]);

// Multiple files
await client.uploadFiles(Array.from(fileInput.files));

// In React component
function FileUpload() {
  const handleUpload = async (event) => {
    const files = event.target.files;
    const result = await client.uploadFiles(files[0]);
    console.log('Uploaded:', result.files);
  };

  return <input type="file" onChange={handleUpload} />;
}`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Next.js Server Actions</CardTitle>
              <CardDescription>
                Use with Next.js App Router server actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language="javascript"
                  style={codeTheme}
                  customStyle={{
                    margin: 0,
                    background: backgroundColor,
                    padding: "1rem",
                  }}
                >
                  {`// app/upload/page.tsx
import { CloudUploadClient } from "@balendra/cloud-upload-client";

async function uploadAction(formData: FormData) {
  "use server";

  const client = new CloudUploadClient({
    apiKey: process.env.CLOUDUPLOAD_API_KEY!,
    forceBrowser: true,
  });

  const file = formData.get("file") as File;
  const result = await client.uploadFiles(file);

  return result;
}`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
              <CardDescription>
                Handle different types of upload errors gracefully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language="javascript"
                  style={codeTheme}
                  customStyle={{
                    margin: 0,
                    background: backgroundColor,
                    padding: "1rem",
                  }}
                >
                  {`import { ValidationError, UploadError } from "@balendra/cloud-upload-client/errors";

try {
  const result = await client.uploadFiles(files);
  console.log('Success:', result.files);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Invalid file type:", error.message);
  } else if (error instanceof UploadError) {
    console.log("Upload failed:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📦 Package Information
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              For detailed information on all methods, types, and advanced
              usage, visit the{" "}
              <a
                href="https://www.npmjs.com/package/@balendra/cloud-upload-client"
                className="underline font-medium text-primary hover:text-red-700 dark:hover:text-red-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                @balendra/cloud-upload-client package on npm
              </a>
              .
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Supports: Node.js 16+, Modern browsers, Next.js 13+, TypeScript
              4.5+
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-6">Direct API Usage</h2>
          <Card>
            <CardHeader>
              <CardTitle>REST API</CardTitle>
              <CardDescription>
                Interact with the Cloud Upload API directly using standard HTTP
                requests if you prefer not to use the SDK.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  language="javascript"
                  style={codeTheme}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: backgroundColor,
                  }}
                >
                  {`async function uploadFileDirectly(apiKey, file) {
  const formData = new FormData();
  formData.append('files', file);
  
  try {
    const response = await fetch('${public_baseurl}/api/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Example Usage
// uploadFileDirectly('your-api-key', fileObject);`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Docs;
