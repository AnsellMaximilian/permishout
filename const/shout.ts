import { Shout, ShoutReplyType } from "@/types/shout";

export const mockShouts: Shout[] = [
  {
    key: "shout-1",
    content:
      "100 men with preparation and weapons can beat a gorilla. No way 100 random dudes are losing.",
    userId: "user_1",
    username: "gorillaStrategist",
    name: "Devon Michaels",
    createdAt: "2025-02-02T12:00:00Z",
    replyMode: ShoutReplyType.EVERYONE,
  },
  {
    key: "shout-2",
    content:
      "You people keep underestimating how strong a silverback gorilla is. One swipe and your ribs are gone.",
    userId: "user_2",
    username: "primateRealist",
    name: "Claire Tanaka",
    createdAt: "2025-02-02T12:02:00Z",
    replyMode: ShoutReplyType.EVERYONE,
  },
  {
    key: "shout-3",
    content:
      "Counterpoint: 100 dudes don’t even agree on where to eat. They’re not coordinating a gorilla takedown.",
    userId: "user_3",
    username: "logisticsLad",
    name: "Ravi Desai",
    createdAt: "2025-02-02T12:04:00Z",
    replyMode: ShoutReplyType.FOLLOWERS,
  },
  {
    key: "shout-4",
    content:
      "If the gorilla gets one of them and throws the body into the crowd it’s over. Instant morale collapse.",
    userId: "user_4",
    username: "battleAnalyst",
    name: "Mei Ling",
    createdAt: "2025-02-02T12:02:30Z",
    replyMode: ShoutReplyType.EVERYONE,
  },
  {
    key: "shout-5",
    content:
      "One flashbang and a net and that gorilla is done. Don’t disrespect human tactics.",
    userId: "user_5",
    username: "tacticalTed",
    name: "Theo Jenkins",
    createdAt: "2025-02-02T12:07:00Z",
    replyMode: ShoutReplyType.MENTIONED,
  },
  {
    key: "shout-6",
    content:
      "100 men is like… two buses worth of people. They could form waves. Someone’s getting that gorilla eventually.",
    userId: "user_6",
    username: "mathGuy47",
    name: "Sandra Lowe",
    createdAt: "2025-02-02T12:08:45Z",
    replyMode: ShoutReplyType.EVERYONE,
  },
  {
    key: "shout-7",
    content:
      "The real answer depends on how angry the gorilla is and how many of the 100 have dad strength.",
    userId: "user_7",
    username: "philosofight",
    name: "Elijah Ford",
    createdAt: "2025-02-02T12:09:30Z",
    replyMode: ShoutReplyType.PEOPLE_FOLLOWED,
  },
  {
    key: "shout-8",
    content:
      "Gorilla wins if it’s UFC rules. If it’s a battlefield, the men win with planning. Context matters.",
    userId: "user_8",
    username: "rulesLawyer",
    name: "Fatima Abbas",
    createdAt: "2025-02-02T12:10:15Z",
    replyMode: ShoutReplyType.EVERYONE,
  },
  {
    key: "shout-9",
    content:
      "I saw a gorilla punch a tire in half on YouTube. I’m not betting against that thing.",
    userId: "user_9",
    username: "videoEvidence",
    name: "Kyle Thompson",
    createdAt: "2025-02-02T12:11:00Z",
    replyMode: ShoutReplyType.EVERYONE,
  },
  {
    key: "shout-10",
    content:
      "This debate is tearing my friend group apart. We need real science on this.",
    userId: "user_10",
    username: "sciencePlease",
    name: "Amina El-Sayed",
    createdAt: "2025-02-02T12:11:50Z",
    replyMode: ShoutReplyType.FOLLOWERS,
  },
];
