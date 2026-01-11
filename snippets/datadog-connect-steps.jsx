export const DatadogConnectSteps = ({ region, host }) => (
  <Steps>
    <Step title="Run tero">
      <p>Open your terminal and run:</p>

      <CodeBlock language="bash">
        tero
      </CodeBlock>

      <p>This opens the Tero TUI, which guides you through setup.</p>

      <Note>
        Don't have the CLI installed? See the <a href="/quickstart">quickstart</a>.
      </Note>
    </Step>

    <Step title="Log in to Tero">
      <p>The TUI opens your browser to create an account or log in. Complete the flow in your browser, then confirm the code shown in your terminal. The TUI logs you in automatically.</p>
    </Step>

    <Step title="Select Datadog">
      <p>The TUI asks which integration you want to connect. Select Datadog.</p>
    </Step>

    <Step title="Select your region">
      <p>Pick your Datadog region. Select <strong>{region}</strong>.</p>
    </Step>

    <Step title="Create an API key">
      <p>The TUI asks for an API key. Datadog uses this to authenticate requests.</p>

      <p>
        In Datadog, go to <a href={`https://${host}/organization-settings/api-keys`} target="_blank" rel="noopener noreferrer">Organization Settings → API Keys</a>. Click <strong>New Key</strong>, name it "Tero", and paste the key into the TUI.
      </p>
    </Step>

    <Step title="Create a service account">
      <p>The TUI asks for an application key. This controls what Tero can access.</p>

      <p>We recommend creating a service account instead of using your personal account. This keeps Tero's access separate and makes it easier to manage permissions.</p>

      <p>
        In Datadog, go to <a href={`https://${host}/organization-settings/service-accounts`} target="_blank" rel="noopener noreferrer">Organization Settings → Service Accounts</a>. Click <strong>New Service Account</strong> and name it "Tero".
      </p>

      <p>
        Assign a role to the service account. <strong>Standard</strong> gives Tero full functionality — it can analyze your data and take action directly in Datadog. <strong>Read-Only</strong> works too, but you'll need to take action through <a href="/edge/overview">Edge</a> or code changes instead.
      </p>

      <p>See <a href="#roles">Roles</a> for details on what each role enables.</p>
    </Step>

    <Step title="Create an application key">
      <p>After creating the service account, click on it in the list. Under <strong>Application Keys</strong>, click <strong>New Key</strong>. Copy the key and paste it into the TUI.</p>
    </Step>

    <Step title="Done">
      <p>Tero validates your credentials and starts analyzing your environment. You'll see a progress bar — analysis usually takes a couple of minutes, even with billions of logs.</p>

      <p>Once it's done, you're ready to ask your first question.</p>
    </Step>
  </Steps>
);
