import { mutation } from "./_generated/server";

// Prices are real values. Accessibility is A-F (update in Convex dashboard if needed).
const AIRBNB_LISTINGS = [
	{
		name: "Theater | Hottub | GameRm | Pet friendly | 5BR",
		url: "https://www.airbnb.com/rooms/1308195361525825026",
		imageUrl:
			"https://a0.muscache.com/im/pictures/prohost-api/Hosting-1308195361525825026/original/0406ad8b-e94c-4beb-9562-1cf20c94f7d2.jpeg",
		price2Night: 1691,
		price3Night: 2131,
		location: "McGaheysville, VA",
		accessibility: "C",
	},
	{
		name: "Clean 5BR Mtn View, Pool, Hottub",
		url: "https://www.airbnb.com/rooms/837895645024463583",
		imageUrl:
			"https://a0.muscache.com/im/pictures/prohost-api/Hosting-837895645024463583/original/33441c06-8535-4b8f-bdff-42fdfddc9699.jpeg",
		price2Night: 1662,
		price3Night: 2266,
		location: "Nelson County, VA",
		accessibility: "B",
	},
	{
		name: "River Oasis Amazing River Front home Pet Friendly!",
		url: "https://www.airbnb.com/rooms/968752000295079739",
		imageUrl:
			"https://a0.muscache.com/im/pictures/miso/Hosting-968752000295079739/original/78aee089-49e3-4c34-9628-cfa01d7cdef5.jpeg",
		price2Night: 1512,
		price3Night: 2023,
		location: "Elkton, VA",
		accessibility: "C",
	},
	{
		name: "6BR Beach Home for Families & Groups. Pet Friendly",
		url: "https://www.airbnb.com/rooms/944894095578611862",
		imageUrl:
			"https://a0.muscache.com/im/pictures/hosting/Hosting-944894095578611862/original/b84690b6-6ee3-406a-a5a1-6c13e0f66a3a.png",
		price2Night: 1788,
		price3Night: 2392,
		location: "Colonial Beach, VA",
		accessibility: "A",
	},
	{
		name: "Woodhaven: Your Serene Countryside Escape",
		url: "https://www.airbnb.com/rooms/1164376503663864330",
		imageUrl:
			"https://a0.muscache.com/im/pictures/prohost-api/Hosting-1164376503663864330/original/fde9c849-0053-46a0-8c85-2cbc182ab240.jpeg",
		price2Night: 1761,
		price3Night: 2238,
		location: "Orange, VA",
		accessibility: "A",
	},
	{
		name: "Spacious waterfront family retreat. Dogs welcome!",
		url: "https://www.airbnb.com/rooms/1020474169172564681",
		imageUrl:
			"https://a0.muscache.com/im/pictures/prohost-api/Hosting-1020474169172564681/original/2ba6f8fd-3387-4dc2-99e8-97959c7413c4.jpeg",
		price2Night: 1137,
		price3Night: null,
		location: "Reedville, VA",
		accessibility: "A",
	},
	{
		name: "Family Gem! Hot Tub, Movies, Game Room & More!",
		url: "https://www.airbnb.com/rooms/1595731669270024673",
		imageUrl:
			"https://a0.muscache.com/im/pictures/hosting/Hosting-1595731669270024673/original/d514f656-c168-4243-aced-6b2fc6d270cd.jpeg",
		price2Night: 1394,
		price3Night: 1456,
		location: "Elkton, VA",
		accessibility: "A",
	},
];

export const seed = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("airbnbs").first();
		if (existing) return "Already seeded";

		for (const listing of AIRBNB_LISTINGS) {
			await ctx.db.insert("airbnbs", listing);
		}
		return "Seeded 8 listings";
	},
});
