export const ContextGraph = () => {
  const chartRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const contextData = {
    services: [
      {
        id: "019b72ea-b9ec-7f6d-b23f-6401986d158c",
        name: "quote",
        description:
          "PHP service calculating quotes, built with Slim framework. Handles quote calculation requests as part of the opentelemetry-demo application.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-44fe-7f2d-9c2f-1e32e188c27e",
        name: "fraud-detection",
        description:
          "Java service consuming order records, likely for fraud analysis based on the service name. Tracks processing counts and includes distributed tracing.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: ["019b72ea-805a-7f2d-b293-9a672271c769"],
      },
      {
        id: "019b72ea-910e-7f6d-a475-bd9c5abbd550",
        name: "query-converter-test",
        description:
          "Integration test harness generating synthetic logs for payment processing scenarios. Runs automated test sequences with health checks and payment transactions, submitting logs to Datadog.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b7734-970f-7040-a47d-91ab78e5d68a",
        name: "test-checkout-3b49f754",
        description:
          "Checkout service in a test environment that processes carts and creates orders for customers.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b7734-9900-7040-81c9-d0d9931f2dd8",
        name: "test-checkout-7a8aa129",
        description:
          "Test instance of a checkout service processing cart transactions and creating orders. Running in integration test environment.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b7734-a9e6-7040-b60b-219207820659",
        name: "test-payment-3b49f754",
        description:
          "Test environment payment service handling card charges. Part of integration testing infrastructure based on the deployment environment and host naming.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
        name: "accounting",
        description:
          ".NET consumer processing order messages and persisting them to PostgreSQL. Logs order details including shipping and product information, with recurring duplicate key constraint errors.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: ["019b72ea-805a-7f2d-b293-9a672271c769"],
      },
      {
        id: "019b72e8-be06-7e6e-bbbd-43c6cc4f8684",
        name: "product-catalog",
        description:
          "Go service serving product lookups from a catalog of astronomy and telescope-related items. Periodically reloads the catalog containing 10 products.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
        name: "frontend-proxy",
        description:
          "Envoy proxy routing API traffic to a frontend service cluster. Handles requests for products, cart, recommendations, and feature flag data.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [
          "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
          "019b72ea-1d8a-7f2d-9716-c937a176178e",
          "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
          "019b72ea-b79e-7f6d-a629-fde38900e601",
          "019b72e8-be06-7e6e-bbbd-43c6cc4f8684",
          "019b72ea-df3a-7f6d-9cf6-c5122724100d",
        ],
      },
      {
        id: "019b72ea-930a-7f6d-b994-572b080e59c5",
        name: "load-generator",
        description:
          "Python-based Locust load generator simulating e-commerce user behavior—browsing products, viewing cart, adding items, requesting recommendations and ads, and completing checkouts.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: ["019b72ea-6c5f-7f2d-a520-0b27b7bbff2b"],
      },
      {
        id: "019b72e8-be6c-7e6e-a283-3e33d8b05f83",
        name: "payment",
        description:
          "Node.js service processing credit card charge requests and completing payment transactions. Handles multiple currencies (USD, CAD) and tracks customer loyalty levels.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-b79e-7f6d-a629-fde38900e601",
        name: "recommendation",
        description:
          "Python service generating product recommendations based on lists of product IDs. Receives ListRecommendations requests and returns suggested products.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: ["019b72e8-be06-7e6e-bbbd-43c6cc4f8684"],
      },
      {
        id: "019b7734-bd57-7040-94d1-a9922c8f1e75",
        name: "test-payment-7a8aa129",
        description:
          "Test environment payment service processing card charges. Part of integration testing infrastructure based on the deployment environment and host naming.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
        name: "checkout",
        description:
          "Go service handling the checkout flow—order placement, payment processing, and confirmation emails. Sends data to a postProcessor and publishes events to Kafka.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [
          "019b72ea-42df-7f2d-940e-0c78c9437f43",
          "019b72ea-1d8a-7f2d-9716-c937a176178e",
          "019b72e8-be6c-7e6e-a283-3e33d8b05f83",
          "019b72ea-df3a-7f6d-9cf6-c5122724100d",
          "019b72ea-805a-7f2d-b293-9a672271c769",
        ],
      },
      {
        id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
        name: "cart",
        description:
          ".NET service managing shopping cart operations—retrieving carts, adding items with product IDs and quantities, and emptying carts. Uses Valkey (Redis-compatible) for cart storage.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-805a-7f2d-b293-9a672271c769",
        name: "kafka",
        description:
          "Kafka broker running in KRaft mode, managing the __cluster_metadata partition with log segment rotation, snapshot generation, and retention cleanup.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
        name: "ad",
        description:
          "Java service serving targeted ad requests based on product categories including travel, accessories, assembly, binoculars, and books.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
      {
        id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
        name: "shipping",
        description:
          "Rust service providing shipping quotes and generating tracking IDs. Requests quotes from an external quote service and returns pricing information.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: ["019b72ea-b9ec-7f6d-b23f-6401986d158c"],
      },
      {
        id: "019b72ea-42df-7f2d-940e-0c78c9437f43",
        name: "currency",
        description:
          "C++ service performing currency conversions. Logs successful conversion operations as part of distributed traces.",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
        dependencies: [],
      },
    ],
    log_events: [
      {
        id: "019b947b-66b4-7d10-bad7-34662677fe2a",
        name: "otel_baggage_not_found",
        description: "No baggage was found in the OpenTelemetry context.",
        service_id: "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
      },
      {
        id: "019b947b-66c5-7d10-85c0-b4bbbf623aa8",
        name: "ad_request_received",
        description: "A targeted ad request was received.",
        service_id: "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
      },
      {
        id: "019b947b-66c9-7d10-bd83-786faa8b0190",
        name: "non_targeted_ad_request_received",
        description:
          "A non-targeted ad request was received and a random response is being prepared.",
        service_id: "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
      },
      {
        id: "019b947b-7a27-7d10-81eb-bfe365fc808a",
        name: "request_forwarded_success",
        description:
          "A request was successfully forwarded to the frontend service cluster.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b947b-7a2e-7d10-a0a1-6c772f92f63f",
        name: "request_redirected",
        description: "A request was redirected with a 308 status code.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b947b-a1ab-7d10-8460-fa81ec4356da",
        name: "log_segment_deleted",
        description:
          "A Kafka log segment file was deleted during retention cleanup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1b0-7d10-9aa1-63ffccf0979e",
        name: "offset_index_deleted",
        description:
          "A Kafka offset index file was deleted during retention cleanup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1b6-7d10-81a3-df1c2e3e2a60",
        name: "time_index_deleted",
        description:
          "A Kafka time index file was deleted during retention cleanup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1ba-7d10-8983-5cf6e2acb948",
        name: "snapshot_files_deleted",
        description:
          "Snapshot files for a specific offset and epoch were deleted.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1bf-7d10-a144-f1faee1d2ed3",
        name: "metadata_snapshot_marked_for_deletion",
        description:
          "A metadata snapshot was marked for deletion because it exceeded the retention period.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1c4-7d10-8295-aeeb73f6ae66",
        name: "log_segments_deleted_offset_breach",
        description:
          "Log segments were deleted due to a log start offset breach.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1c8-7d10-8338-9311d3f104c3",
        name: "log_start_offset_incremented_snapshot",
        description:
          "The log start offset was incremented due to snapshot generation.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1cd-7d10-a5ce-2be2b5551da8",
        name: "cluster_metadata_log_segments_deleted",
        description:
          "Log segments for the cluster metadata partition were deleted during retention cleanup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1d1-7d10-8000-1b11627558f1",
        name: "cluster_metadata_producer_snapshot_deleted",
        description:
          "A producer state snapshot file was deleted from the cluster metadata partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1d5-7d10-840d-01a81334e4d0",
        name: "producer_state_snapshot_written",
        description:
          "A producer state snapshot was written to disk for a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1d8-7d10-a8e4-1f64f6eeae34",
        name: "log_segment_rolled",
        description: "A new log segment was rolled for a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1dc-7d10-ae46-6670f8aef613",
        name: "kraft_snapshot_written",
        description: "A KRaft snapshot was successfully written to disk.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-a1e0-7d10-9b3b-a804fef0f011",
        name: "kraft_snapshot_creation_started",
        description:
          "A new KRaft snapshot file is being created due to replay threshold.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947b-b2e8-7d10-88be-c6b83f380364",
        name: "order_details_logged",
        description:
          "Order details were logged after processing an order message.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b947b-b2ed-7d10-861a-def3223b804c",
        name: "order_save_failed_duplicate_key",
        description:
          "Saving an order to the database failed due to a duplicate primary key constraint violation.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b947b-bfe5-7d10-9942-c215b65f288e",
        name: "user_added_product_to_cart",
        description: "A simulated user added a product to their cart.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bfea-7d10-aa50-2e9060bfc061",
        name: "user_viewed_cart",
        description: "A simulated user viewed their cart.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bfed-7d10-9b30-168b8599ab60",
        name: "user_browsed_product",
        description: "A simulated user browsed a product.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bff0-7d10-b0f1-a5a57237b375",
        name: "user_requested_ads",
        description: "A simulated user requested ads for a product category.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bff3-7d10-b841-047010d3b147",
        name: "user_requested_recommendations",
        description: "A simulated user requested product recommendations.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bff6-7d10-91d2-be9d81f00011",
        name: "multi_item_checkout_completed",
        description: "A simulated multi-item checkout was completed.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bff9-7d10-a263-c60665afe3d5",
        name: "user_accessed_index_page",
        description: "A simulated user accessed the index page.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-bffe-7d10-8dec-7b30225c3133",
        name: "user_completed_checkout",
        description: "A simulated user completed checkout.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947b-d4c5-7d10-93ca-07e4af9b3658",
        name: "place_order_invoked",
        description: "The PlaceOrder operation was invoked.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947b-f852-7d10-acbe-c649713148d9",
        name: "order_record_consumed",
        description:
          "An order record was consumed from a message queue or stream.",
        service_id: "019b72ea-44fe-7f2d-9c2f-1e32e188c27e",
      },
      {
        id: "019b947b-d4c9-7d10-bb25-1d3090e1f635",
        name: "kafka_message_written",
        description: "A message was successfully written to Kafka.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947b-d4cc-7d10-bdf7-76b177b0e88c",
        name: "order_confirmation_email_sent",
        description: "An order confirmation email was sent to a customer.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947b-d4cf-7d10-958d-439630c548a1",
        name: "postprocessor_send_started",
        description: "Data is being sent to the postProcessor.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947b-d4d2-7d10-bc7b-ed4c024bd9aa",
        name: "order_placed",
        description: "An order was successfully placed.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947b-d4d5-7d10-ae74-a7648a041273",
        name: "payment_processed",
        description: "A payment was successfully processed.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947b-d4da-7d10-84a9-b99412409c2b",
        name: "kafka_metadata_fetched",
        description:
          "The Kafka client fetched metadata for all topics from a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947c-0116-7da1-9fab-136916c5650d",
        name: "product_found",
        description: "A product lookup was successfully completed.",
        service_id: "019b72e8-be06-7e6e-bbbd-43c6cc4f8684",
      },
      {
        id: "019b947c-0120-7da1-9361-ed5202e6d9a7",
        name: "product_catalog_loaded",
        description: "The product catalog finished loading.",
        service_id: "019b72e8-be06-7e6e-bbbd-43c6cc4f8684",
      },
      {
        id: "019b947c-0124-7da1-a281-48441bcd7895",
        name: "product_catalog_reload_started",
        description: "The product catalog started reloading.",
        service_id: "019b72e8-be06-7e6e-bbbd-43c6cc4f8684",
      },
      {
        id: "019b947c-3e9a-7da1-8bae-5e34cc06816b",
        name: "list_recommendations_request_received",
        description: "A ListRecommendations request was received.",
        service_id: "019b72ea-b79e-7f6d-a629-fde38900e601",
      },
      {
        id: "019b947c-76d3-7e32-beec-a447fa275c71",
        name: "cart_get_called",
        description: "A cart retrieval operation was initiated for a user.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b947c-76da-7e32-b600-49a38d6c19cd",
        name: "cart_item_add_called",
        description: "An item was added to a user's cart.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b947c-76dd-7e32-a15f-97ced62ea0bf",
        name: "cart_emptied",
        description: "A user's cart was emptied.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b947c-87e4-7e32-b7ba-5e2f9f25c5b6",
        name: "currency_conversion_successful",
        description: "A currency conversion operation completed successfully.",
        service_id: "019b72ea-42df-7f2d-940e-0c78c9437f43",
      },
      {
        id: "019b947c-b486-7ec1-b5a6-a5d04ba18e28",
        name: "charge_request_received",
        description: "A credit card charge request was received.",
        service_id: "019b72e8-be6c-7e6e-a283-3e33d8b05f83",
      },
      {
        id: "019b947c-b491-7ec1-89b6-ab39cd3b59eb",
        name: "transaction_completed",
        description: "A payment transaction completed successfully.",
        service_id: "019b72e8-be6c-7e6e-a283-3e33d8b05f83",
      },
      {
        id: "019b947c-e0a5-7ec1-86c9-cf71ace47e43",
        name: "quote_requested",
        description:
          "The service is requesting a shipping quote from the external quote service.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b947c-e0a9-7ec1-bdba-91bfcfcbe1cc",
        name: "tracking_id_created",
        description: "A tracking ID was generated for a shipment.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b947c-e0ac-7ec1-8e91-14d0f985b59f",
        name: "quote_sent",
        description: "The service is sending a shipping quote response.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b947c-e1cb-7ec1-828f-91fa80fcbe5a",
        name: "quote_calculated",
        description: "A quote calculation was completed.",
        service_id: "019b72ea-b9ec-7f6d-b23f-6401986d158c",
      },
      {
        id: "019b9481-5e99-7760-bbad-92abae641bd1",
        name: "partition_producer_state_load_started",
        description:
          "The log loader started loading producer state for a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947c-f544-7f52-b650-268078d48fd1",
        name: "order_created",
        description: "A new order was created for a customer.",
        service_id: "019b7734-970f-7040-a47d-91ab78e5d68a",
      },
      {
        id: "019b947c-f548-7f52-9e34-2e60df8bbc0f",
        name: "cart_checkout_processing",
        description: "A cart is being processed through checkout.",
        service_id: "019b7734-970f-7040-a47d-91ab78e5d68a",
      },
      {
        id: "019b947d-1c71-7f52-a485-86d359ced5f1",
        name: "frontend_request_upstream_connection_refused",
        description:
          "A request to the frontend service cluster failed because the upstream connection was refused.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b947d-6bf0-7fe2-988f-d6c41e528e06",
        name: "order_created",
        description: "An order was created for a customer.",
        service_id: "019b7734-9900-7040-81c9-d0d9931f2dd8",
      },
      {
        id: "019b947d-6bf4-7fe2-8e9d-acea3a816871",
        name: "checkout_processing_started",
        description: "A checkout process started for a shopping cart.",
        service_id: "019b7734-9900-7040-81c9-d0d9931f2dd8",
      },
      {
        id: "019b947d-76b0-7fe2-98df-643f96e2e120",
        name: "consumer_group_member_joined_assigned_id",
        description:
          "A dynamic consumer group member with an unknown member ID joined a group and was assigned a new member ID.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-76b4-7fe2-acb0-2dcf5d02e336",
        name: "consumer_group_rebalance_preparing",
        description: "A consumer group started preparing for rebalance.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-76b8-7fe2-b64b-b4538eda2bf2",
        name: "consumer_group_generation_stabilized",
        description: "A consumer group generation stabilized with its members.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-76bb-7fe2-aaf4-9475bd422e6c",
        name: "consumer_group_assignment_received",
        description:
          "A partition assignment was received from the consumer group leader.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-76be-7fe2-bdd3-88d99be6301a",
        name: "quorum_controller_partition_leader_balance_completed",
        description:
          "The quorum controller completed a partition leader balancing operation.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-76c1-7fe2-b161-bbb52199ece6",
        name: "quorum_controller_unclean_leader_election_completed",
        description:
          "The quorum controller completed an unclean leader election operation.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-a9d8-7076-837c-3eaf86bc01dc",
        name: "user_session_started",
        description: "A simulated user session started in the load generator.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-e25a-7109-a279-4e431b4cab96",
        name: "kafka_producer_leader_state_normal",
        description:
          "A Kafka producer leader changed state to normal for a topic partition.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-a9dd-7076-bb0c-9a60eee0ae1c",
        name: "all_users_spawned",
        description:
          "All simulated users finished spawning in the load generator.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-a9e0-7076-bc20-88c4707e5268",
        name: "otel_instrumentation_complete",
        description:
          "OpenTelemetry instrumentation completed and trace context will now be included in logs.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-a9e2-7076-b21d-e19e174dcbd7",
        name: "locust_started",
        description: "The Locust load testing framework started.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-a9e5-7076-95b6-26885447c0d6",
        name: "locust_web_interface_started",
        description:
          "The Locust web interface started and is ready to accept connections.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-a9e8-7076-91eb-925303aa11ac",
        name: "locust_no_time_limit_set",
        description:
          "Locust is running without a time limit and will continue until manually interrupted.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-a9ea-7076-b2c4-91debcd94c02",
        name: "locust_user_ramp_started",
        description: "Locust began ramping up simulated users.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b947d-e248-7109-8c7c-f517b0bb0397",
        name: "kafka_api_versions_request_completed",
        description:
          "The Kafka client completed an ApiVersions request to discover broker capabilities.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e24c-7109-b618-55a764069ad5",
        name: "kafka_broker_connected",
        description: "The Kafka client established a connection to a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e251-7109-8143-7316efc04503",
        name: "kafka_producer_broker_starting_up",
        description: "A Kafka producer broker handler started up.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e255-7109-84ad-bf3e39239efd",
        name: "kafka_producer_broker_state_open",
        description:
          "A Kafka producer broker changed state to open for a topic partition.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e257-7109-a071-ee39c9c1753b",
        name: "kafka_producer_leader_state_flushing",
        description:
          "A Kafka producer leader changed state to flushing for a topic partition.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e25c-7109-82db-57f3de023c52",
        name: "kafka_broker_connected_2",
        description: "A Kafka client connected to a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e266-7109-aed9-3b08464cc43c",
        name: "kafka_metadata_empty_brokers_received",
        description:
          "The Kafka client received an empty broker list from the metadata response.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e269-7109-ab35-1fbb7fe22aba",
        name: "kafka_broker_connection_closed",
        description: "A connection to a Kafka broker was closed.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e26b-7109-9cc4-8b390b225a58",
        name: "kafka_metadata_no_broker_available",
        description:
          "The Kafka client has no available broker to send a metadata request to.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e26e-7109-8f4a-7440ca03ec2c",
        name: "kafka_dead_seed_brokers_resurrecting",
        description: "The Kafka client is resurrecting dead seed brokers.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9481-5e96-7760-a141-5a9a69bfcf07",
        name: "metadata_loader_broker_registration_tracker_initialized",
        description:
          "The metadata loader initialized a broker registration tracker with a snapshot.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b947d-e270-7109-a62e-9c4e24a49f8c",
        name: "kafka_metadata_retrying",
        description:
          "The Kafka metadata client is retrying a request after a delay.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e272-7109-8b69-2771d1beb984",
        name: "kafka_client_id_default_warning",
        description:
          "A warning that the Kafka ClientID is using the default value.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e277-7109-964d-78e253fa864e",
        name: "kafka_metadata_fetch_eof_error",
        description:
          "The Kafka client encountered an EOF error while fetching metadata from a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e279-7109-914b-1339dee5903d",
        name: "kafka_broker_deregistered",
        description: "The Kafka client deregistered a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e27b-7109-96b6-2d523890249b",
        name: "kafka_metadata_fetch_broken_pipe_error",
        description:
          "The Kafka client encountered a broken pipe error while fetching metadata from a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e27e-7109-a08d-f42367e468d2",
        name: "kafka_broker_registered",
        description: "The Kafka client registered a new broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e281-7109-b087-8830439bb370",
        name: "kafka_producer_broker_closing_not_connected",
        description:
          "A Kafka producer broker changed state to closing due to not being connected.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e283-7109-8cf3-780fbe03cbfe",
        name: "kafka_producer_leader_retrying",
        description:
          "A Kafka producer leader for a topic partition changed state to retrying.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e285-7109-84f5-b910c5003ccf",
        name: "kafka_producer_broker_abandoned",
        description:
          "A Kafka producer abandoned a broker connection for a topic partition.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e288-7109-9f49-ff00f53f5fac",
        name: "kafka_producer_broker_input_closed",
        description: "A Kafka producer broker's input channel was closed.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e28a-7109-bf1a-719e49166968",
        name: "kafka_producer_broker_shutdown",
        description: "A Kafka producer broker shut down.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e28d-7109-aa52-b27874eaa704",
        name: "kafka_producer_broker_selected",
        description:
          "A Kafka producer selected a broker for a topic partition.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947d-e28f-7109-b7e6-5cd7cf9644a2",
        name: "kafka_producer_broker_closing_broken_pipe",
        description:
          "A Kafka producer broker connection closed due to a broken pipe error.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b947e-021a-7109-b728-40f8d46c3847",
        name: "grpc_server_started",
        description:
          "The gRPC server finished starting and is listening for connections.",
        service_id: "019b72e8-be06-7e6e-bbbd-43c6cc4f8684",
      },
      {
        id: "019b947e-066d-7109-a141-b251a945f9eb",
        name: "payment_processed_successfully",
        description: "A payment was successfully processed.",
        service_id: "019b7734-bd57-7040-94d1-a9922c8f1e75",
      },
      {
        id: "019b947e-0670-7109-8f55-ed5ab0e605bc",
        name: "card_charge_initiated",
        description: "A card charge operation was initiated.",
        service_id: "019b7734-bd57-7040-94d1-a9922c8f1e75",
      },
      {
        id: "019b947e-a169-7231-abc3-c2587001dece",
        name: "grpc_server_started",
        description:
          "The gRPC server finished starting and is listening for payment requests.",
        service_id: "019b72e8-be6c-7e6e-a283-3e33d8b05f83",
      },
      {
        id: "019b9481-3c12-76cd-b66d-eba2cbc42712",
        name: "ad_service_starting",
        description: "The ad service finished starting up.",
        service_id: "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
      },
      {
        id: "019b9480-a2bd-75a6-9add-7313fbfaa562",
        name: "cart_request_server_error",
        description: "A request to the cart API failed with a server error.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b9480-a2c1-75a6-aefb-625bc8bc9900",
        name: "checkout_request_server_error",
        description:
          "A request to the checkout API failed with a server error.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b9481-3c16-76cd-8320-d9dac7ce365c",
        name: "ad_service_started",
        description: "The ad service started and is listening for requests.",
        service_id: "019b72e9-f78f-7eed-96ed-2a2ebe45697f",
      },
      {
        id: "019b9481-5e6b-7760-b1f1-7e55ab8b94ac",
        name: "consumer_offsets_loading_scheduled",
        description:
          "The GroupMetadataManager scheduled loading of consumer offsets and group metadata from a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e70-7760-9c0f-19d155c01455",
        name: "quorum_controller_partition_record_replayed",
        description:
          "The QuorumController replayed a PartitionRecord for a new consumer offsets partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e75-7760-ac54-36dd25825949",
        name: "consumer_group_member_loaded",
        description:
          "A consumer group member's metadata was loaded during group coordination.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e7a-7760-9932-8602d29a9228",
        name: "group_coordinator_loading_metadata",
        description:
          "The group coordinator started loading metadata for a consumer group.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e7c-7760-8e91-e0665c54f696",
        name: "consumer_offsets_partition_loaded",
        description:
          "The GroupMetadataManager finished loading consumer offsets and group metadata from a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e80-7760-b283-ee69405d3b5b",
        name: "group_coordinator_elected",
        description:
          "The group coordinator was elected for a partition in a specific epoch.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e86-7760-a33d-7a67c44320d5",
        name: "topic_configuration_updated",
        description:
          "The DynamicConfigPublisher updated a topic's configuration.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e88-7760-aafd-fd7c6e9c6dd0",
        name: "quorum_controller_config_record_replayed",
        description:
          "The QuorumController replayed a ConfigRecord that set a topic configuration.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e8b-7760-9956-3fdc1e0d36ca",
        name: "consumer_offsets_partition_leader_started",
        description:
          "A partition leader election started for a consumer offsets partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e8f-7760-b8e8-c5ee42c90861",
        name: "partition_log_loaded",
        description:
          "A partition log was loaded with its initial high watermark.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e92-7760-a0e8-397f763f690c",
        name: "consumer_offsets_partition_created",
        description: "A new consumer offsets partition was created.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5e9c-7760-aba2-ef31e6538b28",
        name: "partition_producer_state_reload_started",
        description:
          "The log loader started reloading producer state from a snapshot.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ea0-7760-a97a-2e49663de4fe",
        name: "partition_producer_state_recovery_completed",
        description: "Producer state recovery completed for a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ea3-7760-a86d-ef8387ffae84",
        name: "partition_log_load_completed",
        description: "A log partition finished loading.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ea6-7760-959e-fd4d0dfa6a8a",
        name: "partition_unflushed_segment_recovery_started",
        description:
          "The log loader started recovering an unflushed segment for a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eaa-7760-a533-4484a34622e0",
        name: "metadata_loader_publisher_initialized",
        description:
          "The metadata loader initialized a publisher component with a snapshot at a specific offset.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eae-7760-87cc-1bed6e56ccdc",
        name: "socket_listener_started",
        description:
          "The Kafka broker started listening for socket connections on a specific address and port.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eb0-7760-9a72-6e873e5f6f69",
        name: "controller_registration_incarnation_mismatch_detected",
        description:
          "The controller registration manager detected a registration for a different incarnation than the current one.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eb3-7760-b4c8-313802808637",
        name: "producer_state_manager_loading_snapshot",
        description:
          "The producer state manager is loading producer state from a snapshot file.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eb7-7760-811c-ab231dbad9ff",
        name: "snapshot_file_deleted",
        description: "An unneeded snapshot file was deleted during cleanup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ed3-7760-881b-ec41e2d5dceb",
        name: "broker_server_started",
        description: "The Kafka broker server started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ebb-7760-aed3-3004bc26063d",
        name: "expiration_reaper_fetch_started",
        description:
          "An expiration reaper thread for fetch operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ebd-7760-9c88-1f0ab91bf19b",
        name: "broker_epoch_read_failed",
        description:
          "The broker epoch file could not be read from the log directory.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ec0-7760-a4d2-0f414cc940ad",
        name: "broker_to_controller_heartbeat_channel_started",
        description:
          "The broker-to-controller heartbeat channel manager thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ec3-7760-98fe-5403a0026def",
        name: "kraft_controller_recorded",
        description: "The broker recorded a new KRaft controller node.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ec6-7760-96a7-e55089d47f56",
        name: "broker_incarnation_starting",
        description: "A broker incarnation transitioned to STARTING state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ecc-7760-8735-12fabbdebe06",
        name: "broker_registration_duplicate",
        description:
          "A broker registration attempt failed because the broker ID is already registered.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ecf-7760-b988-d7ce02a864ae",
        name: "broker_registration_failed_duplicate",
        description:
          "A broker failed to register with the controller due to duplicate broker registration.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ed5-7760-9158-8a47ce637c67",
        name: "throttled_channel_reaper_started",
        description: "A throttled channel reaper thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ed8-7760-99f1-35a1f724bfff",
        name: "broker_waiting_for_controller_quorum_voters",
        description:
          "The broker started waiting for the controller quorum voters future.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5edb-7760-bd80-66208cb3e3c3",
        name: "broker_finished_waiting_for_controller_quorum_voters",
        description:
          "The broker finished waiting for the controller quorum voters future.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5edd-7760-8cde-7a36e7864c64",
        name: "broker_to_controller_forwarding_channel_manager_started",
        description:
          "The broker-to-controller forwarding channel manager started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ee7-7760-a499-133980816f78",
        name: "client_metrics_reaper_started",
        description: "The client metrics reaper thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eeb-7760-ae30-f8dcede63faf",
        name: "quorum_controller_broker_record_replayed",
        description:
          "The quorum controller replayed a RegisterBrokerRecord during startup or recovery.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5eef-7760-a181-24896f7ddadc",
        name: "quorum_controller_feature_level_record_replayed",
        description:
          "The quorum controller replayed a FeatureLevelRecord setting the metadata version.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ef3-7760-963c-9f5bf2f62fdd",
        name: "metadata_loader_caught_up_to_high_water_mark",
        description:
          "The metadata loader finished catching up to the current high water mark.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ef6-7760-bdc6-f50ac50bc81f",
        name: "quorum_controller_controller_record_replayed",
        description:
          "The quorum controller replayed a RegisterControllerRecord during startup or recovery.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5ef9-7760-8bd4-4e3b7becb85d",
        name: "quorum_controller_topic_record_replayed",
        description:
          "The quorum controller replayed a TopicRecord for a topic.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5efc-7760-854d-cba953cc5928",
        name: "quorum_controller_partition_record_replayed_2",
        description:
          "The quorum controller replayed a PartitionRecord for a new partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f0a-7760-9f77-523bae7e50d5",
        name: "log_recovery_started_no_clean_shutdown",
        description:
          "Kafka broker started log recovery after detecting no clean shutdown file.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f82-7760-8eb3-2d23644e02a4",
        name: "quorum_controller_snapshot_load_started",
        description: "The QuorumController started loading a snapshot.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f84-7760-8561-22bf46599b24",
        name: "throttled_channel_reaper_fetch_started",
        description:
          "A throttled channel reaper thread for Fetch requests started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f87-7760-be12-3fe70ace7d1f",
        name: "throttled_channel_reaper_produce_started",
        description:
          "A throttled channel reaper thread for Produce requests started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f0e-7760-9bd2-a42ea8b7f4eb",
        name: "logs_loaded",
        description:
          "All log partitions finished loading during broker startup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f11-7760-92db-30cd71934604",
        name: "log_cleanup_started",
        description:
          "The log cleanup process started with its configured period.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f14-7760-88ca-f1b082d0aaf5",
        name: "log_flusher_started",
        description: "The log flusher started with its configured period.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f16-7760-adaf-bab728d2d142",
        name: "log_cleaner_started",
        description: "The log cleaner component started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f19-7760-8692-7131a9421bc6",
        name: "log_cleaner_thread_started",
        description: "A log cleaner thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f1c-7760-a29e-6195b701c065",
        name: "log_dir_failure_handler_started",
        description: "The log directory failure handler thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f1e-7760-8e2d-cb9e2ef6f442",
        name: "add_partitions_to_txn_sender_thread_started",
        description: "A transaction manager sender thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f21-7760-9ca4-7b97568eff66",
        name: "group_coordinator_starting",
        description: "The group coordinator began starting up.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f24-7760-94b1-0b5f02133fbe",
        name: "group_coordinator_startup_completed",
        description: "The group coordinator finished starting up.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f27-7760-a552-3e51351ec044",
        name: "expiration_reaper_alter_acls_started",
        description:
          "An expiration reaper thread for delayed AlterAcls operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f2a-7760-9d5a-f7c172ef123a",
        name: "broker_waiting_for_metadata_publishers",
        description:
          "The broker server began waiting for metadata publishers to be installed.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f2d-7760-983d-81995258314c",
        name: "broker_metadata_publishers_installed",
        description:
          "The broker server finished waiting for metadata publishers to be installed.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f30-7760-aee6-e8e469cc8479",
        name: "broker_waiting_for_controller_acknowledgment",
        description:
          "The broker server began waiting for the controller to acknowledge it is caught up.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f32-7760-81fc-0cfb31f02d22",
        name: "broker_metadata_publisher_initial_metadata_published",
        description:
          "The broker metadata publisher published initial metadata at a specific offset.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f35-7760-9494-5ffd7c9572d8",
        name: "log_manager_loading_logs_started",
        description:
          "The log manager began loading logs from configured log directories.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f38-7760-ac1b-673cd8fcde96",
        name: "metadata_log_snapshots_initialized",
        description: "Kafka metadata log snapshots were initialized from disk.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f8a-7760-a9f5-bd5c18fd395c",
        name: "throttled_channel_reaper_request_started",
        description:
          "A throttled channel reaper thread for general requests started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f8e-7760-94ac-2a4ac9abd72f",
        name: "throttled_channel_reaper_controller_mutation_started",
        description:
          "A throttled channel reaper thread for ControllerMutation requests started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fc1-7760-86f8-50657b7df72e",
        name: "quorum_controller_activation_denovo_kraft",
        description:
          "The quorum controller is performing activation for a de-novo KRaft cluster.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f3b-7760-8236-f3f875d51fd3",
        name: "raft_expiration_reaper_started",
        description: "A Raft expiration reaper thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f3d-7760-a2d5-14cc60bcca76",
        name: "raft_manager_initialization_started",
        description:
          "The Raft manager began reading the KRaft snapshot and log during initialization.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f40-7760-b626-21a9c5cbe9e4",
        name: "raft_manager_snapshot_loaded",
        description:
          "The Raft manager loaded a snapshot because the log start offset exceeded the listener's next offset.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f42-7760-902b-2f00f4004f6e",
        name: "raft_manager_voters_initialized",
        description:
          "The Raft manager initialized with a set of starting voters.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f45-7760-ad4b-323a7418d703",
        name: "raft_manager_request_manager_started",
        description:
          "The Raft manager started its request manager with static voters.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f48-7760-8e9e-0d0d1b368416",
        name: "raft_quorum_resigned_state_transition_attempted",
        description:
          "The Raft quorum began attempting a durable state transition to ResignedState.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f4a-7760-b0ff-4466bbb59e81",
        name: "raft_quorum_resigned_state_transition_completed",
        description:
          "The Raft quorum completed a state transition to ResignedState.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f4e-7760-a825-29ca1db751a9",
        name: "raft_quorum_candidate_state_transition_attempted",
        description:
          "The Raft quorum began attempting a durable state transition to CandidateState.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f51-7760-a0bb-2329f6ddbc6b",
        name: "raft_quorum_candidate_state_transition_completed",
        description:
          "The Raft quorum completed a state transition to CandidateState.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f54-7760-938f-0e50202d2155",
        name: "raft_leader_transition_attempting",
        description:
          "The Raft manager is attempting to transition this node to Leader state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f58-7760-af08-8b1e4764366c",
        name: "raft_leader_transition_completed",
        description: "The Raft manager completed a transition to Leader state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fa6-7760-b6ac-5c6a528693e0",
        name: "controller_registration_persisted",
        description:
          "The controller registration was persisted to the metadata log.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fc4-7760-b3e4-9a4659c487a5",
        name: "controller_server_waiting_for_metadata_publishers",
        description:
          "The controller server started waiting for metadata publishers to be installed.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fc7-7760-8dee-91fff5d2f15d",
        name: "controller_server_metadata_publishers_installed",
        description:
          "The controller server finished waiting for metadata publishers to be installed.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f61-7760-99b2-7be812468e1b",
        name: "raft_io_thread_started",
        description: "A Raft I/O thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f65-7760-8671-3eb42fdbd9dc",
        name: "raft_outbound_request_thread_started",
        description: "A Raft outbound request thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f68-7760-9bbf-0a21d9631218",
        name: "metadata_loader_catching_up_no_high_water_mark",
        description:
          "The metadata loader is still catching up because the high water mark is not yet known.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f6b-7760-9fa4-f132d7be5684",
        name: "raft_high_watermark_set_first_time",
        description:
          "The high water mark was set for the first time in this epoch.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f6e-7760-8dee-d77ac1c17249",
        name: "controller_quorum_voters_wait_started",
        description:
          "The controller server started waiting for the quorum voters future.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f71-7760-9adb-c5232612d15c",
        name: "controller_quorum_voters_wait_finished",
        description:
          "The controller server finished waiting for the quorum voters future.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f74-7760-932c-22b0a8430a33",
        name: "raft_listener_registered",
        description: "A listener was registered with the Raft manager.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f77-7760-b34f-93ae1815c244",
        name: "metadata_snapshot_load_started",
        description: "The metadata loader started handling a snapshot load.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f7a-7760-a59b-d4e79467c977",
        name: "quorum_controller_created",
        description:
          "The QuorumController component initialized with a cluster ID.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f7c-7760-89e1-47bf06229c00",
        name: "metadata_loader_catching_up_after_snapshot",
        description:
          "The MetadataLoader is catching up to the high water mark after loading a snapshot.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f7f-7760-9dbf-5a65dc0a20d5",
        name: "metadata_loader_catching_up_after_log_delta",
        description:
          "The MetadataLoader is catching up to the high water mark after processing a log delta.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f91-7760-b5dd-0aa137020ab0",
        name: "transaction_coordinator_starting_up",
        description: "The transaction coordinator component started up.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f94-7760-85f4-23d9ade6795d",
        name: "transaction_marker_sender_thread_starting",
        description: "A transaction marker sender thread started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f97-7760-af9a-b61a2e4cac7e",
        name: "transaction_coordinator_startup_complete",
        description: "The transaction coordinator component completed startup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f9a-7760-8500-c29b25123362",
        name: "partitions_transitioning_to_local_leaders",
        description: "Partitions transitioned to local leaders on this broker.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5f9d-7760-963a-9e603ad38868",
        name: "replica_fetchers_removed",
        description: "Replica fetchers were removed for a set of partitions.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fa0-7760-834d-0e6655f13611",
        name: "connection_accept_rate_updated",
        description: "The connection accept rate configuration was updated.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fa4-7760-999a-a5c4e47ba59d",
        name: "socket_server_data_plane_acceptor_created",
        description:
          "The socket server created a data-plane acceptor and processors for a listener endpoint.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fa9-7760-a3c3-7efca3c380bb",
        name: "log4j_controller_mbean_registered",
        description:
          "The Log4jController MBean was registered for JMX monitoring.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fac-7760-bff2-099e5dc0c6c9",
        name: "tls_client_renegotiation_disabled",
        description:
          "TLS client-initiated renegotiation was disabled via JVM property.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5faf-7760-a70f-f8a0cc1d6021",
        name: "signal_handlers_registered",
        description:
          "Signal handlers were registered for process termination signals.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fb2-7760-ad85-08c6aa370b22",
        name: "controller_starting",
        description: "The KRaft controller started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fb5-7760-9bcf-8ac755d26eb2",
        name: "endpoint_ready",
        description:
          "An endpoint completed authorization startup and became ready.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fb8-7760-86f1-21ef5c3ad1a8",
        name: "shared_server_starting",
        description: "The SharedServer component started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fbb-7760-bc49-61eab8c31c59",
        name: "quorum_controller_snapshot_loaded",
        description:
          "The quorum controller successfully loaded a metadata snapshot.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fbe-7760-8fb6-d2f28cdec3db",
        name: "quorum_controller_became_active",
        description:
          "The quorum controller became the active controller at a new epoch.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fca-7760-9e9c-177b744bc26a",
        name: "socket_server_request_processing_enabled",
        description: "The socket server enabled request processing.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fcd-7760-8460-5ce14df17ff3",
        name: "controller_server_metadata_features_loaded",
        description: "The controller server loaded new metadata features.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fd0-7760-913c-4f6e5ffe3aef",
        name: "controller_registration_channel_manager_started",
        description:
          "The controller-to-controller registration channel manager started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fd3-7760-a4b1-31e7635a155a",
        name: "controller_registration_manager_channel_initialized",
        description:
          "The controller registration manager initialized its channel manager.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fd5-7760-be1d-c63deb67501d",
        name: "controller_server_authorizer_wait_started",
        description:
          "The controller server began waiting for authorizer futures to complete.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fd8-7760-b433-452ee4ac9f7b",
        name: "controller_registration_request_sent",
        description:
          "The controller registration manager attempted to send a controller registration request.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fdb-7760-b58f-c536a1740c99",
        name: "controller_server_authorizer_wait_completed",
        description:
          "The controller server finished waiting for authorizer futures to complete.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fde-7760-917b-2ec732be7c58",
        name: "controller_server_acceptors_wait_started",
        description:
          "The controller server began waiting for socket server acceptors to start.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fe0-7760-9e3f-fe75aff3bca2",
        name: "controller_server_acceptors_wait_completed",
        description:
          "The controller server finished waiting for socket server acceptors to start.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9481-5fe4-7760-8fa8-4b05c1084342",
        name: "broker_server_transition_shutdown_to_starting",
        description:
          "The broker server transitioned from SHUTDOWN to STARTING state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9482-6fbb-7884-97c1-1dc64f587812",
        name: "recommendation_service_started",
        description:
          "The recommendation service finished starting up and is ready to accept requests.",
        service_id: "019b72ea-b79e-7f6d-a629-fde38900e601",
      },
      {
        id: "019b9483-22c8-79ac-a130-9a31c70abbeb",
        name: "opentelemetry_configured",
        description: "OpenTelemetry was successfully configured.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b9485-fcf0-7c8a-b4b2-40b92e6fad74",
        name: "broker_to_controller_alter_partition_channel_started",
        description:
          "A broker-to-controller channel manager for alter partition requests started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9483-22cb-79ac-9ad2-be7cae3303c3",
        name: "shipping_service_started",
        description:
          "The shipping service started successfully and is listening for requests.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b9483-22cf-79ac-9405-226bbf6f6dbf",
        name: "meter_provider_global_set",
        description:
          "The global meter provider was set and meters can now be created.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b9483-22d9-79ac-80b5-4519678c149c",
        name: "actix_runtime_detected",
        description:
          "The Actix runtime was detected and the server is starting in it.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b9483-22db-79ac-99a3-9d30a061f2b0",
        name: "actix_service_started",
        description:
          "The Actix web service started and is listening on a specific address.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b9485-fcf5-7c8a-b6d7-6951fbb5cca8",
        name: "broker_to_controller_directory_assignments_channel_started",
        description:
          "A broker-to-controller channel manager for directory assignments started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9485-fcf7-7c8a-9d32-a5d295a66edd",
        name: "controller_registration_acknowledged",
        description:
          "The controller acknowledged a controller registration request.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c384-7998-945d-d38c3d106e82",
        name: "quorum_controller_end_transaction_record_replayed",
        description: "The quorum controller replayed an EndTransactionRecord.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9483-22de-79ac-84a0-743a988f5fcc",
        name: "actix_workers_starting",
        description: "Actix server workers are starting.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b9489-f90d-7118-b590-f67c8d1aec8b",
        name: "kafka_api_versions_request_completed_2",
        description:
          "The Kafka client completed an API versions request to the broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9485-fcfa-7c8a-8f30-5122d89e82b6",
        name: "expiration_reaper_produce_started",
        description:
          "An expiration reaper thread for produce operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9485-fcfe-7c8a-9bfc-91ac28c03cb0",
        name: "expiration_reaper_delete_records_started",
        description:
          "An expiration reaper thread for delete records operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9485-fd00-7c8a-872c-b9ff0b774219",
        name: "expiration_reaper_elect_leader_started",
        description:
          "An expiration reaper thread for elect leader operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9485-fd03-7c8a-9d7b-791644945b6f",
        name: "expiration_reaper_remote_fetch_started",
        description:
          "An expiration reaper thread for remote fetch operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9486-0bca-7c8a-9df2-a720a26a4fcf",
        name: "client_initializing",
        description: "A new client connection began initializing.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9485-fd05-7c8a-bd45-75fe8485bd2f",
        name: "expiration_reaper_heartbeat_started",
        description:
          "An expiration reaper thread for heartbeat operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9485-fd08-7c8a-9a55-a830cb821fe3",
        name: "expiration_reaper_rebalance_started",
        description:
          "An expiration reaper thread for rebalance operations started.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9486-0bc0-7c8a-80c5-10b7258d4c83",
        name: "client_closed",
        description: "A client connection was closed.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9486-0bc3-7c8a-ab8f-f52715882d5b",
        name: "service_config_logged",
        description: "The service configuration was logged at startup.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9486-0bc8-7c8a-a347-24498db9b7aa",
        name: "tcp_listener_started",
        description: "The service started listening for TCP connections.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9585-03b3-7fd2-a2af-f29ca102fb29",
        name: "consumer_group_member_failed",
        description:
          "A consumer group member failed and was removed from the group.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9486-0bcd-7c8a-bb88-5c276fa97eb2",
        name: "client_initialized",
        description: "A new client connection was successfully initialized.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9486-0bcf-7c8a-af77-63d874edf597",
        name: "kafka_broker_connection_refused",
        description: "A connection to a Kafka broker was refused.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9486-0bd2-7c8a-aee6-73ee99c911be",
        name: "kafka_metadata_fetch_connection_refused",
        description:
          "A Kafka client failed to fetch metadata from a broker due to a connection refusal.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9486-0bd4-7c8a-bb9f-bc88bab3dbe9",
        name: "kafka_client_brokers_exhausted_connection_refused",
        description:
          "The Kafka client exhausted all available brokers due to connection refusals.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b948f-0ef6-7897-bc22-9791b94fe42a",
        name: "redis_connected",
        description:
          "The service successfully connected to its Redis/Valkey data store.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b9497-c365-7998-87f6-fcd37b80a98b",
        name: "broker_waiting_for_metadata_update",
        description:
          "The broker server started waiting for the initial broker metadata update to be published.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c367-7998-9c54-ebaf75eedaf5",
        name: "broker_metadata_update_published",
        description:
          "The broker server finished waiting for the initial broker metadata update to be published.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b948f-0efb-7897-b9e9-591b1c12c784",
        name: "feature_lifecycle_manager_initializing",
        description: "The OpenFeature lifecycle manager began initialization.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b948f-0efe-7897-a9c9-aefa46504ca9",
        name: "feature_provider_initialization_started",
        description: "The OpenFeature provider began initialization.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b948f-0f01-7897-9261-a56052edf4da",
        name: "aspnet_ports_overridden_by_urls",
        description:
          "ASP.NET Core overrode configured HTTP/HTTPS ports with values from the URLS environment variable.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b948f-0f03-7897-aaef-ea5826510679",
        name: "aspnet_listening_started",
        description:
          "The ASP.NET Core web server started listening on a network address.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b9497-c36a-7998-9a6a-0f51ef49875c",
        name: "kafka_config_loaded",
        description:
          "The Kafka broker configuration was loaded and logged at startup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c36d-7998-8dd3-20d43bf371ab",
        name: "broker_waiting_to_be_unfenced",
        description:
          "The broker server started waiting to be unfenced by the controller.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c370-7998-b424-4ce999411c07",
        name: "broker_unfence_request_granted",
        description:
          "The quorum controller granted a broker's request to be unfenced.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b948f-0f06-7897-af67-cfa70844487a",
        name: "aspnet_application_started",
        description: "The ASP.NET Core application finished starting.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b948f-0f08-7897-a199-618efdb7cf8c",
        name: "aspnet_hosting_environment_logged",
        description:
          "The ASP.NET Core hosting environment was logged at startup.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b948f-0f0b-7897-9009-1a00c7859401",
        name: "aspnet_content_root_logged",
        description:
          "The ASP.NET Core content root path was logged at startup.",
        service_id: "019b72ea-1d8a-7f2d-9716-c937a176178e",
      },
      {
        id: "019b948f-4adb-789e-8a01-2e5e642ad2ad",
        name: "kafka_consumer_connecting",
        description: "The Kafka consumer is connecting to a Kafka broker.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b9497-c372-7998-96e2-1648b1d085b5",
        name: "broker_registration_change_replayed",
        description:
          "The quorum controller replayed a broker registration change record.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c377-7998-a0aa-d9a51de4309a",
        name: "raft_manager_transition_to_unattached_attempted",
        description:
          "The Raft manager is attempting to transition to the Unattached state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c37a-7998-a7b4-a2433b14999c",
        name: "raft_manager_transition_to_unattached_completed",
        description:
          "The Raft manager completed a transition to the Unattached state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03b7-7fd2-b526-64bccc99e879",
        name: "consumer_group_became_empty",
        description: "A consumer group became empty after all members left.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b948f-4ae0-789e-af33-c71b3737eb86",
        name: "kafka_consume_topic_unavailable",
        description:
          "The Kafka consumer failed to consume messages because the subscribed topic does not exist or is unavailable.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b9493-6390-7b24-8708-b6c7f764258e",
        name: "otel_trace_export_deadline_exceeded",
        description:
          "The OpenTelemetry trace exporter failed to send traces to the collector due to a deadline being exceeded.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b9496-e736-796e-9eef-abd08f704959",
        name: "entity_framework_duplicate_key_tracking_error",
        description:
          "Entity Framework failed to track an entity because another instance with the same key is already being tracked.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b9497-9466-7984-8877-cfc1dc098e8c",
        name: "playwright_browser_context_creation_target_closed",
        description:
          "A Playwright browser context creation failed because the target page, context, or browser was already closed.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b9497-c339-7998-8f5e-6e6c31953824",
        name: "partition_log_created",
        description:
          "A log for a partition was created on disk with its configuration properties.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c33f-7998-8152-c75eccedbbc3",
        name: "partition_highwatermark_checkpoint_not_found",
        description:
          "No checkpointed high watermark was found for a partition during initialization.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c343-7998-ad12-4c6227965238",
        name: "broker_unfenced_recovery_to_running",
        description:
          "The broker lifecycle manager transitioned the broker from RECOVERY to RUNNING state after unfencing.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c37c-7998-b789-ea71be1259a7",
        name: "metadata_loader_offset_set_no_snapshots",
        description:
          "The metadata loader's next offset was set because no snapshots exist.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c37f-7998-86b7-a1b1b5220541",
        name: "quorum_controller_activation_bootstrap_records_appended",
        description:
          "The quorum controller performed activation and appended bootstrap records to an empty metadata log.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c381-7998-9e5b-e42f84a46d57",
        name: "quorum_controller_begin_transaction_record_replayed",
        description: "The quorum controller replayed a BeginTransactionRecord.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c346-7998-b757-50cebe0c1229",
        name: "broker_unfencing_wait_completed",
        description:
          "The broker server finished waiting for the broker to be unfenced.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c349-7998-869d-8dfe3e0ae95c",
        name: "kafka_version_logged",
        description: "Kafka logged its version information at startup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c34c-7998-941e-b1c5d8d36ce3",
        name: "kafka_start_time_logged",
        description: "Kafka logged its start time in milliseconds.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c34e-7998-a85a-8056db680560",
        name: "broker_transition_starting_to_started",
        description:
          "The broker server transitioned from STARTING to STARTED state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c351-7998-9939-9bdc6fc774a5",
        name: "kafka_commit_id_logged",
        description: "Kafka logged its commit ID at startup.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c353-7998-b01e-2e4d5ae6754c",
        name: "kafka_server_started",
        description: "The Kafka server finished starting up.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c355-7998-901c-a13af4674522",
        name: "topic_auto_creation_request_sent",
        description:
          "An auto-creation request for topics was sent to the active controller.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c358-7998-9077-210cae4259dd",
        name: "topic_created",
        description: "A topic was successfully created.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c35a-7998-9940-9e2b450ac2c2",
        name: "broker_registered",
        description:
          "The broker successfully registered with the cluster controller.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c35d-7998-9ff2-1f57729e5aee",
        name: "log_manager_no_logs_found",
        description:
          "The log manager found no existing logs to load from disk.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c360-7998-aec7-d77cf2d63e59",
        name: "broker_state_transition_starting_to_recovery",
        description:
          "The broker lifecycle manager transitioned from STARTING to RECOVERY state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c362-7998-928a-f48e340ecbd4",
        name: "broker_controller_catchup_acknowledged",
        description:
          "The broker server finished waiting for controller acknowledgment that it has caught up.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c387-7998-88bc-c6d23df0596b",
        name: "metadata_loader_caught_up_to_high_water_mark_2",
        description:
          "The metadata loader finished catching up to the current high water mark.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c391-7998-923d-084c1fb71966",
        name: "controller_registration_blocked_metadata_version",
        description:
          "The controller registration manager cannot register because the metadata version does not support KIP-919.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9497-c393-7998-a98a-8fd172b8d98b",
        name: "broker_registration_created",
        description:
          "A new broker registration was created with a new incarnation ID and epoch.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b94a5-6763-744f-b743-dbbc264f1bee",
        name: "kafka_consume_topic_unavailable_2",
        description:
          "The Kafka consumer failed to consume messages because the subscribed topic does not exist or is unavailable.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b94ba-22fd-71a5-8fdb-f38e083d7754",
        name: "payment_processed_successfully",
        description: "A payment was successfully processed.",
        service_id: "019b7734-a9e6-7040-b60b-219207820659",
      },
      {
        id: "019b94ba-2304-71a5-86b9-e2a8313d8f94",
        name: "card_charge_initiated",
        description: "A card charge was initiated.",
        service_id: "019b7734-a9e6-7040-b60b-219207820659",
      },
      {
        id: "019b94bf-b36a-727d-8c7c-ea63fac52d6f",
        name: "user_getting_product_reviews",
        description:
          "A simulated user requested product reviews for a specific product.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b94bf-b372-727d-8ea0-4cae936f2363",
        name: "ai_assistant_question_asked",
        description:
          "A simulated user asked the AI assistant a question about a product.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b94c3-ba0f-7310-aa13-cb8476043b61",
        name: "broker_server_waiting_for_socket_acceptors",
        description:
          "The broker server started waiting for all SocketServer Acceptors to start.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b94c3-ba13-7310-9b5d-81ce7a882f9f",
        name: "broker_server_waiting_for_authorizer_futures",
        description:
          "The broker server started waiting for all authorizer futures to complete.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b94c3-ba18-7310-8d37-1faa9f9b499b",
        name: "broker_server_authorizer_futures_completed",
        description:
          "The broker server finished waiting for all authorizer futures to complete.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b94c3-ba1a-7310-a7c7-54e981b928a2",
        name: "broker_server_socket_acceptors_started",
        description:
          "The broker server finished waiting for all SocketServer Acceptors to start.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b94e5-da90-7a06-8ddd-c2f3b8ba0ab5",
        name: "metadata_loader_catching_up",
        description:
          "The metadata loader is catching up to the high water mark.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b94e7-29a9-7a10-baa7-c999a660ca4c",
        name: "kafka_metadata_fetch_started",
        description:
          "A Kafka client started fetching metadata for a topic from a broker.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b94f5-2ec1-7fbe-a8e4-6ea7cbca3f00",
        name: "otel_metrics_export_deadline_exceeded",
        description:
          "The OpenTelemetry metrics exporter failed to send metrics to the collector due to a deadline being exceeded.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b94f5-5511-7fbe-9ecd-c6c7679249a5",
        name: "opentelemetry_tracer_provider_initialized",
        description:
          "The OpenTelemetry tracer provider was initialized and set as the global provider.",
        service_id: "019b72ea-df3a-7f6d-9cf6-c5122724100d",
      },
      {
        id: "019b950b-32ad-7fc7-aa37-c5bb55213e13",
        name: "currency_server_started",
        description:
          "The currency service started and is listening for requests on a specific port.",
        service_id: "019b72ea-42df-7f2d-940e-0c78c9437f43",
      },
      {
        id: "019b950c-8b6a-7fc9-a43b-6c15f172e364",
        name: "grpc_server_started_2",
        description:
          "The gRPC server finished starting and is listening for payment requests.",
        service_id: "019b72e8-be6c-7e6e-a283-3e33d8b05f83",
      },
      {
        id: "019b9585-038a-7fd2-88fe-aa8935cb3950",
        name: "consumer_offsets_partition_unload_scheduled",
        description:
          "The group metadata manager scheduled unloading of consumer offsets and group metadata from a partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-0395-7fd2-b12f-96136b98006f",
        name: "group_coordinator_resigned",
        description:
          "The group coordinator resigned from coordinating a consumer group partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-0399-7fd2-ab5c-4a06f88ae1bb",
        name: "partition_follower_started",
        description:
          "A partition follower started or restarted at a specific leader epoch and offset.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-039d-7fd2-9fe6-fb49bca0da4c",
        name: "consumer_offsets_partition_unloaded",
        description:
          "A consumer offsets partition finished unloading from the group metadata manager.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03a2-7fd2-aa3a-f7090223f8f0",
        name: "partitions_transitioned_to_local_followers",
        description:
          "Partitions transitioned to local follower state on this broker.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03a6-7fd2-aff7-0dc65dd1875b",
        name: "partition_fetchers_stopped_become_follower",
        description:
          "The broker stopped fetchers as part of transitioning partitions to follower state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03aa-7fd2-809f-6ecb64767a43",
        name: "partition_fetchers_started_become_follower",
        description:
          "The broker started fetchers as part of transitioning partitions to follower state.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03ad-7fd2-96f2-d0a7a4109a16",
        name: "consumer_group_metadata_unloaded",
        description:
          "The GroupCoordinator unloaded group metadata for a consumer group.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03b0-7fd2-af34-68f80314b08c",
        name: "produce_request_connection_closed_not_leader_or_follower",
        description:
          "A client connection was closed due to a NotLeaderOrFollowerException during a produce request.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03ba-7fd2-a108-d2b569378366",
        name: "response_send_failed_connection_closed",
        description:
          "Attempted to send a response on a connection that is no longer open.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03bd-7fd2-8669-b6e94e7abbd0",
        name: "node_disconnected_from_controller",
        description: "A Kafka node disconnected from the controller.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03c0-7fd2-b1f7-f68161c953de",
        name: "broker_fenced_session_timeout",
        description: "A broker was fenced because its session timed out.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03c3-7fd2-96a2-039829d22851",
        name: "broker_heartbeat_cancelled_node_disconnected",
        description:
          "An in-flight broker heartbeat request was cancelled due to node disconnection.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03c6-7fd2-8b87-fc088ee77d7b",
        name: "broker_fenced_partitions_changed",
        description:
          "The quorum controller changed partitions in response to a broker being fenced.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b9585-03c9-7fd2-8fef-83af1986349d",
        name: "broker_unfenced_partitions_changed",
        description:
          "The quorum controller changed partitions in response to a broker being unfenced.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b95ad-beb6-70d2-bd2d-368bcc35e2fe",
        name: "otel_log_export_deadline_exceeded",
        description:
          "The OpenTelemetry log exporter failed to send logs to the collector due to a deadline being exceeded.",
        service_id: "019b72ea-930a-7f6d-b994-572b080e59c5",
      },
      {
        id: "019b95bf-d156-70dd-ba9a-8323d8974536",
        name: "order_parsing_failed_out_of_memory",
        description:
          "Order parsing failed due to an out of memory exception during Entity Framework database save operation.",
        service_id: "019b72ea-0a2a-7eed-bff2-c66f64869e20",
      },
      {
        id: "019b9628-4827-70e9-932c-05db67bd9e9a",
        name: "recommendations_request_upstream_connection_terminated",
        description:
          "A request to the recommendations API failed because the upstream connection was terminated before a response could be sent.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b971b-bf13-74a0-b797-7c718950d1b1",
        name: "consumer_offsets_partition_already_loading",
        description:
          "The GroupMetadataManager is already loading consumer offsets and group metadata from a specific partition.",
        service_id: "019b72ea-805a-7f2d-b293-9a672271c769",
      },
      {
        id: "019b990d-edc5-74b0-8ec1-8a86edda3c9b",
        name: "frontend_upstream_connection_reset",
        description:
          "A request to the frontend service failed because the upstream connection was reset before the response started.",
        service_id: "019b72ea-6c5f-7f2d-a520-0b27b7bbff2b",
      },
      {
        id: "019b9fab-6741-70ba-8bd1-cd8e78dde3cd",
        name: "kafka_broker_connection_dns_lookup_failed",
        description:
          "Failed to connect to a Kafka broker due to DNS lookup failure.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
      {
        id: "019b9fab-6755-70ba-86d3-ed99bc716e5c",
        name: "kafka_metadata_fetch_dns_lookup_failed",
        description:
          "Failed to fetch Kafka metadata due to DNS lookup failure.",
        service_id: "019b72ea-1da9-7f2d-a46b-0e1b48d360a8",
      },
    ],
    datadog_accounts: [
      {
        id: "019b00e2-a6ac-731c-a960-61f33f15f7ac",
        name: "Datadog",
        site: "US5",
        account_id: "019b00c8-2e01-7323-a9de-a03e0e7af79a",
      },
    ],
    datadog_log_indexes: [
      {
        id: "019b00e3-8de2-7912-a071-ac6a2bb562a7",
        name: "main",
        datadog_account_id: "019b00e2-a6ac-731c-a960-61f33f15f7ac",
      },
    ],
    edge_instances: null,
    event_correlations: [
      {
        source: "019b947b-d4c9-7d10-bb25-1d3090e1f635",
        target: "019b947b-f852-7d10-acbe-c649713148d9",
        description:
          "checkout kafka_message_written -> fraud-detection order_record_consumed",
      },
      {
        source: "019b947b-d4d5-7d10-ae74-a7648a041273",
        target: "019b947c-b491-7ec1-89b6-ab39cd3b59eb",
        description:
          "checkout payment_processed -> payment transaction_completed",
      },
      {
        source: "019b947c-e0a5-7ec1-86c9-cf71ace47e43",
        target: "019b947c-e1cb-7ec1-828f-91fa80fcbe5a",
        description: "shipping quote_requested -> quote quote_calculated",
      },
      {
        source: "019b947b-d4d2-7d10-bc7b-ed4c024bd9aa",
        target: "019b947c-e0a9-7ec1-bdba-91bfcfcbe1cc",
        description: "checkout order_placed -> shipping tracking_id_created",
      },
      {
        source: "019b947b-d4c5-7d10-93ca-07e4af9b3658",
        target: "019b947c-76dd-7e32-a15f-97ced62ea0bf",
        description: "checkout place_order_invoked -> cart cart_emptied",
      },
      {
        source: "019b947b-bff3-7d10-b841-047010d3b147",
        target: "019b947c-3e9a-7da1-8bae-5e34cc06816b",
        description:
          "load-generator user_requested_recommendations -> recommendation list_recommendations_request_received",
      },
      {
        source: "019b947b-bff0-7d10-b0f1-a5a57237b375",
        target: "019b947b-66c5-7d10-85c0-b4bbbf623aa8",
        description:
          "load-generator user_requested_ads -> ad ad_request_received",
      },
      {
        source: "019b947b-d4d2-7d10-bc7b-ed4c024bd9aa",
        target: "019b947b-b2e8-7d10-88be-c6b83f380364",
        description: "checkout order_placed -> accounting order_details_logged",
      },
    ],
  };
  // Tailwind colors for categories
  const colors = [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#eab308", // yellow-500
    "#22c55e", // green-500
    "#14b8a6", // teal-500
    "#06b6d4", // cyan-500
    "#3b82f6", // blue-500
    "#6366f1", // indigo-500
    "#8b5cf6", // violet-500
    "#a855f7", // purple-500
    "#d946ef", // fuchsia-500
    "#ec4899", // pink-500
    "#f43f5e", // rose-500
    "#84cc16", // lime-500
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && !window.echarts) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js";
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    } else if (window.echarts) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !chartRef.current) return;

    // Filter out test services
    const services = contextData.services.filter(
      (s) => !s.name.startsWith("test-") && !s.name.includes("-test"),
    );
    const serviceIds = new Set(services.map((s) => s.id));

    // Create categories (one per service)
    const categories = services.map((s, i) => ({
      name: s.name,
      itemStyle: { color: colors[i % colors.length] },
    }));
    const serviceToCategory = {};
    services.forEach((s, i) => {
      serviceToCategory[s.id] = i;
    });

    // Group log events by service (max 75 per service for visual clarity)
    const logEventsByService = {};
    contextData.log_events.forEach((le) => {
      if (!serviceIds.has(le.service_id)) return;
      if (!logEventsByService[le.service_id]) {
        logEventsByService[le.service_id] = [];
      }
      if (logEventsByService[le.service_id].length < 70) {
        logEventsByService[le.service_id].push(le);
      }
    });

    const logEvents = Object.values(logEventsByService).flat();

    // Build nodes
    const nodes = [];
    const links = [];

    // Service nodes (scaled down)
    services.forEach((s) => {
      const eventCount = logEventsByService[s.id]?.length || 0;
      const hasDeps = s.dependencies && s.dependencies.length > 0;
      const baseSize = 18 + eventCount * 0.5 + (hasDeps ? 4 : 0);
      const cappedSize = Math.min(baseSize, 40);
      nodes.push({
        id: s.id,
        name: s.name,
        symbolSize: cappedSize,
        category: serviceToCategory[s.id],
        label: { show: true, fontSize: 11 },
      });
    });

    // Log event nodes (smaller, no labels - tooltip only)
    logEvents.forEach((le) => {
      nodes.push({
        id: le.id,
        name: le.name.replace(/_/g, " "),
        symbolSize: 6,
        category: serviceToCategory[le.service_id],
        label: { show: false },
      });
      // Link to parent service
      links.push({
        source: le.service_id,
        target: le.id,
      });
    });

    // Service-to-service dependency links
    services.forEach((s) => {
      if (s.dependencies && s.dependencies.length > 0) {
        s.dependencies.forEach((depId) => {
          if (serviceIds.has(depId)) {
            links.push({
              source: s.id,
              target: depId,
              lineStyle: { width: 3, opacity: 0.9 },
            });
          }
        });
      }
    });

    // Event-to-event correlation links (cross-service patterns)
    const logEventIds = new Set(logEvents.map((le) => le.id));
    if (contextData.event_correlations) {
      contextData.event_correlations.forEach((corr) => {
        if (logEventIds.has(corr.source) && logEventIds.has(corr.target)) {
          links.push({
            source: corr.source,
            target: corr.target,
            lineStyle: { width: 1.5, opacity: 0.7, type: "dashed" },
          });
        }
      });
    }

    const chart = window.echarts.init(chartRef.current);

    chart.setOption({
      tooltip: {
        backgroundColor: "rgba(24, 24, 27, 0.95)",
        borderColor: "#3f3f46",
        borderWidth: 1,
        padding: [8, 12],
        extraCssText: "max-width: 280px; white-space: normal;",
        textStyle: {
          color: "#e4e4e7",
          fontSize: 12,
        },
        formatter: (params) => {
          if (params.dataType === "node") {
            const service = services.find((s) => s.id === params.data.id);
            if (service) {
              return `<strong style="color:#fff">${service.name}</strong><br/><span style="font-size:11px;color:#a1a1aa;line-height:1.4;display:block;margin-top:4px">${service.description}</span>`;
            }
            return `<strong style="color:#fff">${params.data.name}</strong>`;
          }
          return null;
        },
      },
      legend: {
        data: categories.map((c) => c.name),
        orient: "vertical",
        left: 10,
        top: 20,
        textStyle: { color: "#a1a1aa", fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: "Context Graph",
          type: "graph",
          layout: "force",
          data: nodes,
          links: links,
          categories: categories,
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
            color: "#e4e4e7",
          },
          scaleLimit: {
            min: 0.3,
            max: 3,
          },
          zoom: 0.7,
          lineStyle: {
            color: "source",
            curveness: 0.15,
            opacity: 0.4,
          },
          force: {
            edgeLength: 35,
            repulsion: 60,
            gravity: 0.12,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: { width: 4, opacity: 1 },
          },
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [loaded]);

  return (
    <div className="not-prose my-6">
      <div
        ref={chartRef}
        style={{ width: "100%", height: "650px" }}
        className="rounded-xl border border-zinc-800 bg-zinc-950"
      />
      <p className="text-xs text-zinc-500 mt-2 text-center">
        Drag to explore. Click a node to focus on its connections.
      </p>
    </div>
  );
};
