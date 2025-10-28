# NexusChat

A visually stunning, minimalist AI chat application powered by Cloudflare Agents, offering a seamless and intuitive conversational experience.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/nexuschat)

NexusChat is a sophisticated, visually stunning, and minimalist AI chat application, designed to be a feature-complete alternative to platforms like ChatGPT. Built on the robust and scalable Cloudflare Workers and Agents platform, it offers a seamless, real-time conversational experience. The application features a clean, two-panel layout with a collapsible sidebar for session history and a spacious main view for the active conversation. It supports full Markdown and code syntax highlighting, tool usage visualization, and seamless model switching. The entire user experience is designed with the 'less is more' philosophy, focusing on clarity, usability, and aesthetic elegance, making interactions with the AI both productive and delightful.

## Key Features

- **Real-time Conversational UI**: Messages stream in real-time for a fluid and engaging user experience.
- **Minimalist & Responsive Design**: A clean, two-panel layout that is fully responsive and looks beautiful on any device.
- **Session Management**: Collapsible sidebar to easily create, switch between, rename, and delete chat sessions.
- **Markdown & Code Highlighting**: Full support for Markdown rendering and syntax highlighting for code blocks.
- **Powered by Cloudflare**: Built on Cloudflare Workers and Agents (Durable Objects) for scalability, performance, and stateful backend logic.
- **Model Switching**: Seamlessly switch between different AI models during a conversation.
- **Tool Usage Visualization**: Clear indicators when the AI uses tools to answer your queries.

## Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Backend**: Hono on Cloudflare Workers
- **Stateful Logic**: Cloudflare Agents (Durable Objects)
- **AI Integration**: OpenAI SDK via Cloudflare AI Gateway

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- Git.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/nexus-chat.git
    cd nexus-chat
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.dev.vars` file in the root of the project for local development. You will need to populate it with your Cloudflare AI Gateway credentials.

    ```ini
    # .dev.vars

    # Your Cloudflare AI Gateway URL
    # Format: https://gateway.ai.cloudflare.com/v1/ACCOUNT_ID/GATEWAY_NAME/openai
    CF_AI_BASE_URL="your-gateway-url"

    # An API Key for your AI Gateway
    CF_AI_API_KEY="your-gateway-api-key"
    ```

    You can find your Account ID and create a Gateway and API Key in the Cloudflare Dashboard under **Workers & Pages -> AI Gateway**.

## Development

To start the local development server, which includes both the Vite frontend and the Wrangler backend worker, run:

```sh
bun dev
```

This will start the application, typically available at `http://localhost:3000`. The frontend supports Hot Module Replacement (HMR) for a fast development workflow.

### Project Structure

-   `src/`: Contains all the frontend React application code.
    -   `pages/`: Main page components.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utility functions and services, including `chat.ts`.
-   `worker/`: Contains the backend Cloudflare Worker code.
    -   `index.ts`: The entry point for the worker.
    -   `userRoutes.ts`: Hono API routes.
    -   `agent.ts`: The core `ChatAgent` Durable Object class.
    -   `app-controller.ts`: The `AppController` Durable Object for session management.

## Deployment

This project is designed for easy deployment to Cloudflare's global network.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/nexuschat)

### Manual Deployment Steps

1.  **Login to Wrangler:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```sh
    bunx wrangler login
    ```

2.  **Build the application:**
    This command bundles both the frontend and worker for production.
    ```sh
    bun run build
    ```

3.  **Deploy to Cloudflare:**
    This command publishes your application to Cloudflare Workers.
    ```sh
    bun run deploy
    ```

4.  **Configure Production Secrets:**
    For your deployed application, you must set the `CF_AI_BASE_URL` and `CF_AI_API_KEY` secrets in your Cloudflare dashboard.

    Go to **Workers & Pages**, select your deployed worker, and navigate to **Settings -> Variables**. Add the required secrets here. **Do not** commit secrets to your repository.

## Important Note on AI Usage

Please be aware that this project utilizes AI models through Cloudflare's AI Gateway. There may be limits on the number of requests that can be made to the AI servers across all users of this application within a given time period. If you experience issues, it may be due to these rate limits.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.