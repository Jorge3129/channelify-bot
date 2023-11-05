## Use case

```plantuml
@startuml
left to right direction
actor User

rectangle TelegramBot {
  usecase "Submit News Channel" as UC1
  usecase "Receive Digest Channel Link" as UC2
  usecase "Provide OpenAI API Key" as UC3
  usecase "Select ChatGPT Model" as UC4
}

User --> UC1 : Submits link
User --> UC2 : Receives link
User --> UC3 : Provides key
User --> UC4 : Selects model
@enduml

```

## Deployment

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```

## Statechart

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```

## Activity

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```

## Interaction

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```

## Sequence

### Creating digest channel

```plantuml
@startuml
actor User
participant "Telegram Bot" as Bot
participant "Channel Service" as Service
database "Database" as DB
participant "Telegram API" as API

User -> Bot: /createChannel command
Bot -> Service: request create channel

Service -> API: Join news channel
API --> Service: Confirmation

Service -> DB: Check if digest exists
alt Digest Channel Exists
    DB --> Service: Digest channel info
else No Digest
    Service -> API: Create digest channel
    API --> Service: New digest channel info
    Service -> DB: Save digest channel info
end

Service -> Bot: return digest channel link
Bot -> User: Send digest channel link
@enduml

```

### Digest post creation

```plantuml
@startuml
participant "Summary Service" as Summary
participant "Channel Service" as Channel
database "Database" as DB
participant "Telegram API" as Telegram
participant "OpenAI API" as OpenAI

Summary -> Channel: Request channel mappings
Channel -> DB: Read channel mappings
DB -> Channel: Channel mappings data
Channel -> Summary: Return channel mappings

loop for each channel mapping
    Summary -> Telegram: Get posts (last 24h)
    Telegram -> Summary: Posts data

    Summary -> OpenAI: Send posts with prompt
    OpenAI -> Summary: Digest/summary

    Summary -> Telegram: Post digest to digest channel
end

User -> Telegram: Read digest post
@enduml

```

## Collaboration

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```

## Class

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```

## Component

```plantuml
Bob -> Alice : hello
Alice -> Wonderland: hello
Wonderland -> next: hello
next -> Last: hello
Last -> next: hello
next -> Wonderland : hello
Wonderland -> Alice : hello
Alice -> Bob: hello
```
