---
id: diagrams
aliases:
  - Use case
tags: []
---

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

cloud "Fly io"{
component "Flyctl"
database db [
    Postgres


]


file "Secrets"
frame "Serverless" {
frame "NodeJS Server" {
    node node [
        Telegram Bot
        ----

        ....

        ....
    ]
}

frame "Python Server" {
    node node2 [
        ChatGPT Client
        ----

        ....

        ....
    ]
node --> node2
}

  "Secrets" --> "Serverless"
}

 node -> db

}
cloud "Telegram" {

}

cloud "ChatGPT" {

}
"Telegram" <--> node
"ChatGPT" <-- node2

cloud "Github" {
	file "Repository"
  component "Github Actions"
	"Repository" --> "Github Actions"
	"Github Actions" --> "Flyctl"
}
```

## Statechart

```plantuml
START : Greet user. Show help
START : text, available commands

ADD_CHANNEL : subscribe to a compressed channel
ADD_CHANNEL --> ASK_KEY : if no key is present
ADD_CHANNEL --> ADD_EXISTING_CHANNEL : if the channel exists
ADD_CHANNEL --> CREATE_NEW_CHANNEL : if channel does not exist

ADD_EXISTING_CHANNEL : subscribe the user to
ADD_EXISTING_CHANNEL : a channel we already have

CREATE_NEW_CHANNEL : send request to channel service
CREATE_NEW_CHANNEL --> ADD_EXISTING_CHANNEL : when channel created

ASK_KEY : ask for OpenAI Key
ASK_KEY --> ASK_KEY : validation of key failed
ASK_KEY --> ADD_CHANNEL : got a valid key

```

## Activity

Channel creation flow

```plantuml
@startuml
start
:User sends /createChannel command;
:Bot receives command;
:Bot validates command format;
if (Is channel link valid?) then (yes)
  :Bot requests to join channel;
  else (no)
  :Bot sends error message to user;
  stop
endif

:Bot checks for existing digest channel in DB;
if (Does digest channel exist?) then (yes)
  :Bot retrieves existing channel info;
else (no)
  :Bot creates new digest channel;
  :Bot updates channel info in DB;
endif

:Bot sends digest channel link to user;
stop
@enduml

```

## Interaction

```plantuml
@startuml
actor "User" as User
participant "Bot" as Bot
participant "Original Telegram Channel" as OriginalChannel
participant "Summary Bot" as SummaryBot
participant "New Telegram Channel" as NewChannel
database "Database" as Database
database "OpenAI API" as OpenAI

User -> Bot: Sends a link to the Telegram channel
Bot -> Database: Checks the database for the channel's existence
alt Channel is absent
    Bot -> SummaryBot: Creates a new channel
    SummaryBot -> NewChannel: Creates a new channel
    Database -> Bot: Stores information about the new channel
else Channel exists
    Bot -> Database: Retrieves information about the existing channel
end

User -> Bot: Initiates a command to receive summary information
Bot -> NewChannel: Sends a command to start receiving summary information
NewChannel -> SummaryBot: Publishes summary information
SummaryBot -> OpenAI: Request for summary information
OpenAI --> SummaryBot: Summary information
SummaryBot -> NewChannel: Publishes summary information
NewChannel --> Bot: Notifies about successful creation of summary information
@enduml
```

## Sequence

Creating digest channel

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

Digest post creation

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
@startuml

class TelegramClientFactory {
    -client: TelegramClient | null
    +initialize(): Promise<TelegramClient>
    +getClient(): TelegramClient
    -createClient(): Promise<TelegramClient>
    -getStringSession(): StringSession
    -persistStringSession(session: StringSession): void
}

class TelegramCoreApiService {
    -factory: TelegramClientFactory
    -client: TelegramClient
    +createChannel(title: string, about?: string): Promise<TelegramChat>
    +joinChannel(inputChannel: string): Promise<TelegramChat>
    +getChannelNewMessageUpdates(chatId: string): Observable<NewMessageEvent>
    +sendMessage(message: string, destinationChatId: string): Promise<Api.TypeUpdates>
    +addUserToChannel(user: string, channelId: string): Promise<void>
}

class SummarizerService {
    +getPostSummary(postText: string): Promise<string>
}

class ChannelPostService {
    -telegramCoreApi: TelegramCoreApiService
    -summarizer: SummarizerService
    +sendPostSummary(event: NewMessageEvent, destinationChannelId: string): Promise<void>
}

class ChannelMapping {
    +id: string
    +sourceChatId: string
    +destinationId: string
}

class CreateChannelService {
    -telegramCoreApi: TelegramCoreApiService
    -channelPostService: ChannelPostService
    -channelMappingRepo: Repository<ChannelMapping>
    +createDigestChannel(sourceChannelUrl: string, newChannelTitle: string): Promise<void>
    -createChannelOrGetExisting(sourceChatId: string, newChannelTitle: string): Promise<string>
}

class BotController {
    -channelService: CreateChannelService
    +handleCreateChannel(ctx: TelegrafCommandContext): Promise<void>
}

TelegramCoreApiService --> TelegramClientFactory : uses >
ChannelPostService --> TelegramCoreApiService : uses >
ChannelPostService --> SummarizerService : uses >
CreateChannelService --> TelegramCoreApiService : uses >
CreateChannelService --> ChannelPostService : uses >
BotController --> CreateChannelService : uses >

@enduml

```

## Component

```plantuml
@startuml
package "Telegram Digest Bot System" {

    [Bot] as UI
    [Channel Service] as Core
    [Summary Service] as SummarySvc
    [Telegram API] as Telegram
    [Database] as DB
    [OpenAI API] as OpenAI

    UI --> Core : send commands
    Core --> DB : store channels
    Core --> Telegram : manage channels
    SummarySvc --> Core : get channel mappings
    SummarySvc --> Telegram : retrieve posts
    SummarySvc <--> OpenAI : summary generation
    SummarySvc --> Telegram : send digest posts

    note right of Core
        The core service
    end note

    note top of SummarySvc
        Service that interfaces with
        OpenAI to generate summaries.
    end note

    note "Stores channel mappings" as NoteDB
    DB .. NoteDB
    NoteDB .. DB

    note "User interface for sending \ncommands to the system." as NoteBot
    UI .. NoteBot
    NoteBot .. UI
}

@enduml

```
