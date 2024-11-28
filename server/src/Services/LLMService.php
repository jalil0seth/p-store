<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class LLMService
{
    protected string $baseUrl = 'https://api.livepolls.app/api';
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        ]);
    }

    public function generateMetadata(array $productData): array
    {
        try {
            $systemPrompt = "You are a product metadata generator. Generate detailed, SEO-friendly metadata for the given product.";
            $userPrompt = json_encode($productData);

            $response = $this->makeRequest($systemPrompt, $userPrompt);
            return json_decode($response, true);
        } catch (\Exception $e) {
            \Log::error('LLM Service error: ' . $e->getMessage());
            throw new \Exception('Failed to generate product metadata');
        }
    }

    protected function makeRequest(string $systemPrompt, string $userContent): string
    {
        try {
            $response = $this->client->post('/llm/generate', [
                'json' => [
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt
                        ],
                        [
                            'role' => 'user',
                            'content' => $userContent
                        ]
                    ],
                    'model' => 'gpt-3.5-turbo',
                    'temperature' => 0.7
                ]
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            return $body['response'] ?? throw new \Exception('Invalid response format');
        } catch (RequestException $e) {
            \Log::error('LLM API error: ' . $e->getMessage());
            throw new \Exception('Failed to communicate with LLM API');
        }
    }
}
