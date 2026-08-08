const e="florida-vbs",t="Florida VBS: what happens to a bid, stage by stage",a="Portal pedia · 20",s="Florida VBS: 144 open bids, and only one of them was read that night",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. Florida VBS is a public state advertisement board with no login and no browser needed. That night it pulled 144 open bids, found 35 it had never seen, kept exactly one of them after the first read, sent that one to the judge, and the judge said no. The single YES the portal reports was judged twelve days earlier and has been carried along ever since.",o=[{value:"144",label:"in snapshot"},{value:"109",label:"already seen"},{value:"35",label:"new tonight"},{value:"3",label:"triage open"},{value:"141",label:"triage skip"},{value:"1",label:"judged tonight"},{value:"1",label:"yes standing"}],r=`Counts from data/florida-vbs/daily/2026-07-28/stats.json (460 bytes): snapshot_total 144, carryover_count 109, new_to_triage 35, triage 3 open / 141 skip, scoring 1 yes / 0 maybe / 2 no. Read the triage and the yes/maybe/no rows carefully. Both count the whole board of 144, not the work of this run: tonight's first read saw 35 bids and kept 1, and tonight's judge answered once. This run's judge output is data/florida-vbs/runs/judge-verdicts.json: 1,087 bytes, one row, verdict "no", score 25. Adding a portal's scoring.yes to another portal's is therefore always wrong.`,i=["Bid A · ITB-16355 · Fencing & Concrete Pad, Dept of Military Affairs. Was thrown out at triage on an earlier night.","Bid B · RFSQ-16481 · Mechanical Vegetation with Operator, St. Johns River Water Management District. YES at 70, judged 16 July.","Bid C · ITB-16545 · 42201 C-10 Palm Harvest_2nd Call. The only bid that walked the whole path on 28 July."],l=[{n:"1",title:"The gate: is Florida due today?",who:"P0 · scripts/portal_due.py --batch portals",summary:["Most portals run every night. This one is set to every 3 days. The gate looks at the newest dated folder under data/florida-vbs/daily/ and only prints the portal's name if that folder is old enough. On the other days nothing about Florida runs at all.","Because the pull always asks for every open bid, a skipped day loses nothing. The next run still sees everything that is still open."],cells:[{label:"In",paths:[{path:"data/florida-vbs/daily/<date>/",size:"33 dated folders on disk, newest 2026-07-28"},{path:"data/portals/registry.json",size:"the portal's settings row"},{path:"supabase:portals",size:"where cadence_days really comes from"},{path:"stdout",size:"one slug per line"}],blocks:[],notes:[],tables:[]},{label:"The real settings row (data/portals/registry.json)",paths:[],blocks:[`{
 "slug": "florida-vbs",
 "label": "Florida VBS",
 "engine": "florida_vbs",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Every later stage on this page reads one of these settings."],tables:[]}],notes:["What the folder names actually show. The 33 archive dates run from 2026-06-03 to 2026-07-28. Through June the gaps are almost all one day. The last four gaps are 3, 4, 3 and 5 days. So the run before this one was 2026-07-23, five days earlier, not three. That is what the folder names say. Why the spacing changed is not visible from these files."],then:"the name is printed, so a helper is sent to run the sweep"},{n:"2",title:"The hand-off",who:"P0.9 · Agent(general-purpose) → .claude/skills/florida-vbs-sweep/SKILL.md",summary:["The orchestrator starts a child agent and tells it to run the Florida runbook end to end. Florida goes out in Batch C, five portals at once, next to Texas.","The batch list is fixed. It does not know about the 3-day setting. The gate in stage 1 is the only thing that stops Florida running every night."],cells:[{label:"In",paths:[{path:".claude/skills/florida-vbs-sweep/SKILL.md",size:"the runbook the child follows"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"a running child agent",size:"no file"}],blocks:[],notes:["This is the one stage with nothing to show. The stage model marks its output no code evidence, and there is no file on disk for it. If the child fails, the other portals carry on and the roll-up marks Florida FAILED."],tables:[]}],notes:[],then:"two plain web requests, no login, no browser"},{n:"3",title:"Pull: ask how many, then ask for them",who:"P1 · data/florida-vbs/scripts/run_daily.py → florida_vbs.pull",summary:["The site looks like an app, but underneath it is a plain public data feed. The pull asks the count endpoint how many open advertisements exist, then asks for them 100 at a time. No login. No browser. Start to written file: about two seconds.","The list gives titles, buyers, dates and links. It does not give the description. That has to be fetched one bid at a time later, and only for the few bids that survive the first read."],cells:[{label:"In → Out",paths:[{path:"POST /mfmp/pub/search/bids/count",size:"the total"},{path:"POST /mfmp/pub/search/bids",size:"100 rows per page"},{path:"data/florida-vbs/bids/all-bids.json",size:"read back in, then rewritten · 109,918 bytes · 144 rows"},{path:"data/florida-vbs/bids/index.json",size:"294 bytes"},{path:"data/florida-vbs/logs/pull_log.txt",size:"21,972 bytes, all runs"}],blocks:[`[2026-07-28T20:21:53] FL VBS (MFMP VIP) pull starting
[2026-07-28T20:21:54] VIP reports recordsTotal=144 OPEN advertisements
[2026-07-28T20:21:54] page 1: 100 rows, 100 new (total 100/144)
[2026-07-28T20:21:55] page 2: 44 rows, 44 new (total 144/144)
[2026-07-28T20:21:55] wrote 144 open bids -> …\\bids\\all-bids.json`],notes:[],tables:[]},{label:"Real record Bid A as the snapshot holds it",paths:[],blocks:[`{
 "bid_id": "ITB-16355",
 "advertisement_id": 16355,
 "title": "Fencing & Concrete Pad for SASMO
 VSAT Compound",
 "buyer": "Department of Military Affairs (DMA)",
 "agency_short": "DMA",
 "agency_ad_number": "DMA-ITB-356",
 "type": "Invitation to Bid",
 "status": "OPEN",
 "due_date": "2026-07-29",
 "due_date_raw": "2026-07-29T20:00:00.000+00:00",
 "open_date": "2026-06-26",
 "posting_date": "2026-06-26",
 "state": "FL",
 "detail_url": "https://vendor.myfloridamarketplace.com/
 search/bids/detail/16355",
 "description": "",
 "_detail_ok": false
}`],notes:["Empty description, _detail_ok: false. That is what 141 of the 144 rows look like."],tables:[]}],notes:["Two things to know about this stage. First, the word OPEN must be sent in capitals. Title case returns zero bids and nothing would look broken. Second, if one page fails, the loop stops instead of retrying, and the snapshot is quietly short. With only two pages, one bad page is half the state. The only signal is a warning line in the log when the shortfall is bigger than one page. On 28 July the count and the rows matched exactly, 144 and 144."],then:"compare against what we decided last time"},{n:"4",title:"Split: which of these have we already decided?",who:"P2 · run_daily.py → ps.prep",summary:["Today's 144 bids are compared with the last archive folder, which was daily/2026-07-23/triage.json and held 136 bids. Anything already decided keeps its old decision and costs nothing. Only genuinely new bids go to the AI.","109 were already decided. 35 were new. That is a 24% new rate, which is what a five-day gap on a 144-bid board looks like."],cells:[{label:"Out",paths:[{path:"runs/triage-input.json",size:"8,169 bytes · 35 rows · the new ones"},{path:"runs/triage-carryover.json",size:"13,547 bytes · 109 rows · old decisions kept"},{path:"runs/judge-input.json",size:"88,816 bytes · 144 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 144,
 "carryover_count": 109,
 "triage_input_count": 35,
 "prior_archive_ids_compared_against": 136
}`],notes:[],tables:[]},{label:"Real record Bid A inside judge-input.json",paths:[],blocks:[`{
 "idx": 1,
 "bid_id": "ITB-16355",
 "title": "Fencing & Concrete Pad for SASMO
 VSAT Compound",
 "buyer": "Department of Military Affairs (DMA)",
 "state": "FL",
 "due_date": "2026-07-29",
 "detail_url": "https://vendor.myfloridamarketplace.com/
 search/bids/detail/16355",
 "description_full": "Title: Fencing & Concrete Pad for
 SASMO VSAT Compound\\nBuyer: Department of Military
 Affairs (DMA)\\nState: FL\\nCloses: 2026-07-29\\n
 Source URL: https://…/16355\\n\\n
 RFP body (truncated to 6KB):\\n"
}`],notes:['The body stops right after the words "RFP body". There is nothing after the colon.'],tables:[]}],notes:["The 88 KB file that is mostly empty. judge-input.json holds all 144 bids with a formatted body for each one, and 142 of those 144 bodies are empty. It is built before anything is fetched tonight, so the only two with text are the bids enriched on earlier runs, RFSQ-16481 and ITB-16472. Tonight's kept bid is not one of them: its body is empty here, and the text arrives at stage 6. This file is not dead either, stage 6 filters it down to the bids that need judging. But it is the clearest picture of the portal's main wall. Almost nothing in the snapshot has any text in it."],then:"35 titles go to the first AI read"},{n:"5",title:"First read: keep or drop, on the title alone",who:"P3 · max-triage agent on runs/triage-input.json",summary:["The agent gets six fields per bid: position, id, title, buyer, state, closing date. No description exists yet, so the title is the whole case. The default answer is drop. Only real LGS work words, or a vague utility or on-call title, earn a keep.","Out of 35 new bids, 34 were dropped and 1 was kept. That one is Bid C."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"35 rows"},{path:"runs/triage-verdicts.json",size:"3,823 bytes · 35 rows · 34 SKIP, 1 OPEN"}],blocks:[`{
 "idx": 38,
 "bid_id": "ITB-16545",
 "title": "42201 C-10 Palm Harvest_2nd Call",
 "buyer": "St. Johns River Water Management Dist",
 "state": "FL",
 "due_date": "2026-08-05"
}`],notes:[],tables:[]},{label:"Real answers Bid C kept",paths:[],blocks:[`{
 "bid_id": "ITB-16545",
 "decision": "OPEN",
 "reason": "Palm removal on district canal"
}`,`{
 "bid_id": "AD-16527",
 "decision": "SKIP",
 "reason": "Aggregate material logistics, no LGS verb"
}`,`{
 "bid_id": "ITB-16355",
 "decision": "SKIP",
 "reason": "fencing/concrete construction, no LGS verb"
}`],notes:["Read on an earlier night, kept as a memory in runs/triage-carryover.json, and never read again. That is the whole point of the split at stage 4."],tables:[]}],notes:[],then:"only the kept bid gets its own page fetched"},{n:"6",title:"Go and get the actual text, for the one bid that earned it",who:"P4 · ps.enrich_opens(...) then ps.build_judge_input_open(P)",summary:["For each kept bid the sweep fetches the public detail record and writes the scope, the commodity codes, the contact and the attachment links onto the snapshot. That night it fetched exactly one.","Then it works out who needs judging. The rule is: bids kept tonight, plus bids kept on an earlier night that never got a verdict, plus already-judged bids whose material has changed (a later closing date, a real scope where there was none, a new revision). Tonight that came to one bid and no others."],cells:[{label:"In → Out",paths:[{path:"GET /mfmp/pub/search/bids/detail?id=16545",size:"public, no auth"},{path:"bids/all-bids.json",size:"rewritten with description, contact, documents, page_text"},{path:"runs/judge-input-open.json",size:"1,743 bytes · 1 row"}],blocks:[`[2026-07-28T20:25:03] enrich_details: fetching 1 OPEN detail records (requests)
[2026-07-28T20:25:05] enrich_details: 1/1 enriched`],notes:[],tables:[[{header:!1,cells:["kept tonight","ITB-16545"]},{header:!1,cells:["kept earlier, still unjudged","none. RFSQ-16481 and ITB-16472 are both marked OPEN in the carryover file, but both already have verdicts"]},{header:!1,cells:["material changed since last run","none fired"]}]]},{label:"Real record Bid C the only row in judge-input-open.json",paths:[],blocks:[`{
 "idx": 38,
 "bid_id": "ITB-16545",
 "title": "42201 C-10 Palm Harvest_2nd Call",
 "buyer": "St. Johns River Water Management Dist",
 "state": "FL",
 "due_date": "2026-08-05",
 "detail_url": "https://vendor.myfloridamarketplace.com/
 search/bids/detail/16545",
 "description_full": "…RFP body:\\nThe St. Johns River Water
 Management District (the “District”) is seeking
 submittals from qualified Respondents with a minimum
 of three (3) years of experience harvesting cabbage
 palms. The selected Respondent shall harvest cabbage
 (also called Sabal) palms within designated areas,
 remove and transport harvested palms away from
 District property and purchase all harvested palms
 from the District at the bid rate…
 | Commodity Codes: 21101703 Harvesters; 70151700
 Forestry harvesting;… | Contact: Breanna Pierce
 bpierce@sjrwmd.com (386) 643-1168 | Attachments:
 42201IFB26 C-10 Palm Harvest_2nd Call.pdf"
}`],notes:["Scope, commodity codes, a named contact with email and phone, and the attachment name. All of it from one free public request."],tables:[]}],notes:["This is the portal's biggest wall, and it is by choice. Only bids the first read keeps ever get their text fetched. On 28 July that means 3 of 144 snapshot rows carry a description, documents and a contact: RFSQ-16481 from 16 July, ITB-16472 from 23 July, ITB-16545 from tonight. The pull reads the old snapshot back in before rewriting it, which is why the earlier two keep their text. The other 141 rows are titles and dates and nothing else, permanently."],then:"one bid, one judgement"},{n:"7",title:"Second read: would LGS bid this?",who:"P5 · max-bid-judge agent on runs/judge-input-open.json",summary:["The judge reads the full text and answers yes, maybe or no, with a score out of 100 and its reasons. One bid went in. The answer was no, at 25.","The reason is worth reading. The contractor does not get paid to remove the palms. He buys them from the district and resells them. The money flows the wrong way for this kind of business."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts.json",size:"1,087 bytes · 1 row"}],blocks:[],notes:["This is the honest headline of the night. One bid reached the judge and it came back no. Everything the portal shows as a YES that day was decided on an earlier run. A night that judges nothing in is not a broken night. It is what a small, high-signal state board looks like most of the time."],tables:[]},{label:"Real record Bid C · NO, 25",paths:[],blocks:[`{
 "bid_id": "ITB-16545",
 "title": "42201 C-10 Palm Harvest_2nd Call",
 "buyer": "St. Johns River Water Management Dist",
 "state": "FL",
 "would_lgs_bid": "no",
 "score": 25,
 "category": "vegetation harvest / material sale
 — non-fit",
 "primary_reason": "This is backwards from our normal
 work — the contractor doesn't get paid to remove
 anything, he BUYS the cabbage palms from the District
 at his bid rate and resells them into the nursery
 trade…",
 "red_flags": [
 "inverted_commercial_structure_contractor_pays_agency",
 "revenue_depends_on_reselling_live_palms_not_removal_fees",
 "contract_structure_lgs_cannot_fulfill",
 "no_guarantee_of_quantity_size_or_quality_all_
 volume_risk_on_vendor",
 "requires_3_years_cabbage_palm_harvesting_experience_
 lgs_lacks",
 "second_call_relet_suggests_no_bidders_first_round"
 ]
}`],notes:[],tables:[]}],notes:[],then:"tonight's answer is folded into the standing set"},{n:"8",title:"Compile: write the day's folder",who:"P6 · ps.compile_archive(P, cfg)",summary:["The old decisions and the new ones are merged back into one list of 144. Tonight's single verdict is laid on top of the verdicts still live from last time. Then the day folder is written, plus a summary and a row in the running index.","This merge is why the portal reports 3 verdicts when it only judged 1."],cells:[{label:"Out · data/florida-vbs/daily/2026-07-28/",paths:[],blocks:[`| date | snapshot | new | open | yes | maybe | no |
| 2026-07-28 | 144 | 35 | 3 | 1 | 0 | 2 |
| 2026-07-23 | 136 | 29 | 5 | 1 | 0 | 4 |`],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["triage.json","144 decisions, tomorrow's memory (3 OPEN, 141 SKIP)","17,367 bytes"]},{header:!1,cells:["verdicts.json","3 verdicts, the standing live set","2,975 bytes"]},{header:!1,cells:["new-bids.json","144 rows, a copy of the snapshot","109,918 bytes"]},{header:!1,cells:["stats.json","the funnel counts at the top of this page","460 bytes"]},{header:!1,cells:["report.md","the human summary (rewritten again at stage 10)","977 bytes"]}]]},{label:"Real record Bid B in verdicts.json, carried, not re-judged",paths:[],blocks:[`{
 "bid_id": "RFSQ-16481",
 "title": "Mechanical Vegetation with Operator",
 "buyer": "St. Johns River Water Management Dist",
 "state": "FL",
 "would_lgs_bid": "yes",
 "score": 70,
 "category": "adjacent - Cat 6 watershed/vegetation
 mulching",
 "primary_reason": "Mechanical vegetation mulching with
 operator is a direct equipment match for LGS's
 forestry-mulching crews, and $1.5M over a 3-year
 prequalified-pool term is real recurring scale, but
 the buyer is a water management district doing
 conservation-land mulching…",
 "red_flags": [
 "buyer_not_core_electric_utility_water_mgmt_district",
 "prequalification_pool_award_not_guaranteed"
 ],
 "verdict": "yes"
}`],notes:["This exact verdict first appears in daily/2026-07-16/verdicts.json and is byte-for-byte the same on 07-20, 07-23 and 07-28."],tables:[]}],notes:["A verdict only survives while its bid is still on the board. On 23 July the file held five verdicts. Three of them, AD-16510, AD-16525 and IN-16522, are gone on 28 July. They closed and left the snapshot, and the merge only keeps verdicts whose bid is still in today's pull. Nothing warns about that. The count simply drops from 5 to 3. And a timing problem you can see on this page. Bid B, the only YES, closes 2026-07-29, the day after this run. On a 3-day setting the next run lands on or after 31 July, when it is already closed. The YES was surfaced on 16 July, which is what gave the operator the time."],then:"the portal's own work is done, the shared machinery takes over"},{n:"9",title:"Carry forward: skipped on purpose for this portal",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across the whole system there is a safety net that re-applies yesterday's verdicts to today's bids. Florida is not in the set it runs on. Its settings row says carry_forward: "engine-internal", and the script only picks up portals whose value is "orchestrator".`,"What that means in plain terms: Florida already does its own carrying, in two places. Old first-read decisions are carried at stage 4, and old verdicts are carried at stage 8. Running the shared net on top of that would apply the same thing twice."],cells:[{label:"How you can tell from the files alone",paths:[],blocks:[`bid_id · bid_key · buyer · buyer_match · category · closed_award ·
detail_url · due_date · fit_signals · kansas_city_risk ·
primary_reason · red_flags · scale_match · score · service_match ·
state · title · verdict · would_lgs_bid`],notes:["The trap. Running carry_forward_verdicts.py --portal florida-vbs by hand would rewrite verdicts.json on top of a set that was already merged. The safety net is only safe on the portals it was meant for.","The shared script stamps every row it touches with a marker. Here are all the field names that appear across the three rows of daily/2026-07-28/verdicts.json:","No _carryforward_from. No _first_judged. The shared net never touched this file. That is the cleanest proof on disk that the skip is real and deliberate."],tables:[]}],notes:[],then:"the day folder is read by three shared jobs"},{n:"10",title:"Ledger, report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three jobs read Florida's day folder. The first walks all 33 archive dates and rebuilds the running list of every YES ever found, which is what keeps a Florida YES alive on the days Florida does not run. The second rewrites report.md into the one shared layout every portal uses. The third turns YES verdicts into cards for the board."],cells:[{label:"report.md after the rewrite, one long line cut at the …",paths:[],blocks:[`# Florida VBS / MyFloridaMarketPlace Vendor
 Information Portal (VIP) — 2026-07-28

**Source:** https://vendor.myfloridamarketplace.com
 · engine \`florida_vbs\` · state FL

- Snapshot: **144** open bids
- Carryover: 109 · NEW today: 35
- Triage: 3 OPEN / 141 SKIP
- Scored: **1 YES / 0 MAYBE / 2 NO**

## YES — Max would bid

- **[70] Mechanical Vegetation with Operator** —
 St. Johns River Water Management Dist ·
 closes 2026-07-29
 …
## MAYBE — operator judgment

_none_

---
_Standardized report — regenerated
 2026-07-28T22:37:27+00:00_`],notes:["977 bytes. Two writers touch this file each run. The rewrite stamp of 22:37 is two hours after the sweep's own stats.json stamp of 20:27, so this one is last and wins."],tables:[]},{label:"Real board card Bid B in PortalPro/src/fixtures/portal-bids.json",paths:[],blocks:[`{
 "id": "26e2bb4f153209a9",
 "portal": "florida-vbs",
 "source_bid_id": "RFSQ-16481",
 "title": "Mechanical Vegetation with Operator",
 "buyer": "St. Johns River Water Management Dist",
 "state": "FL",
 "federal": false,
 "score": 70,
 "verdict": "yes",
 "due_date": "2026-07-29",
 "contact_name": "Breanna Pierce",
 "contact_email": "bpierce@sjrwmd.com",
 "contact_phone": "(386) 643-1168",
 "first_seen": "2026-07-16",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["first_seen 16 July, last_seen 28 July. Twelve days on the board from one judgement."],tables:[]}],notes:["MAYBE never reaches the board from this portal. The card dump only surfaces YES for non-federal portals, and Florida is not on the federal list. On 28 July the MAYBE count was 0, so nothing was actually lost. The gate is there every run anyway."],then:"bids stop being Florida-shaped here"},{n:"11",title:"Onto the shared board, and joined with every other portal",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Florida's YES bids are pushed into the shared bids table, then grouped into clusters with bids from every other portal, so the same solicitation seen in three places becomes one row for the operator. An AI then confirms the pairs that look like duplicates.","Florida is a strong source for this. Of the four cluster folders on disk that hold a Florida page, three also hold a page from another portal: BidNet on the hurricane-debris cluster, DemandStar on both water-district clusters, and CentralAuctionHouse on Bid B's as well."],cells:[{label:"Real proof on disk: cluster folders that contain a Florida page",paths:[],blocks:[`data/bidpacks/fl-florida-department-of-transportation-fdot-district-wide-
 maintenance-of-mitiga-789278/page-florida-vbs.md
data/bidpacks/fl-hurricane-debris-removal-and-disposal-b6ebd0/
 page-florida-vbs.md
data/bidpacks/fl-st-johns-river-water-management-dist-mechanical-aquatic-
 vegetation-shredding-59abca/page-florida-vbs.md
data/bidpacks/fl-st-johns-river-water-management-district-mechanical-
 vegetation-with-operator-bd0bbc/page-florida-vbs.md`],notes:["A cadence side effect. On the days Florida does not run, it writes no run row here while daily portals do. That is the 3-day setting showing up in a shared table, not a failure. Anything that reads those rows has to allow for gaps.","Four cluster folders on disk carry a Florida page. The last one is Bid B."],tables:[]}],notes:[],then:"the files are downloaded and read"},{n:"12",title:"Documents and requirements",who:"2.86 publish_bid_documents.py + publish_page_text.py · 2.87 requirements extraction",summary:["Florida has no enrichment pass of its own. Its settings say enrich_passes: [], and that is correct, because the fetching already happened inside the sweep at stage 6. Two shared jobs then walk every portal's snapshot: one downloads the attachment links Florida recorded, one pushes Florida's captured page text into the shared table. After that an agent reads the file text and pulls out the bid requirements with exact quotes.","The attachments come from a public download link. No login, no fee."],cells:[{label:"Real documents block from the snapshot Bid B",paths:[],blocks:[`"documents": [
 {
 "file_name": "42184RFQ26 Mech Veg with Operator.pdf",
 "file_url": "https://vendor.myfloridamarketplace.com/
 mfmp/bids/detail/attachment/download?attachmentId=38755",
 "file_description": "42184RFQ26 Mech Veg w/ Operator"
 }
]`,`"documents": [
 {
 "file_name": "42201IFB26 C-10 Palm Harvest_2nd Call.pdf",
 "file_url": "https://vendor.myfloridamarketplace.com/
 mfmp/bids/detail/attachment/download?attachmentId=38932",
 "file_description": "42201 C-10 Palm Harvest_2nd Call"
 }
]`],notes:[],tables:[]},{label:"What that adds up to on 28 July",paths:[],blocks:[],notes:["Every bid the operator can see has its file. Coverage is 100% of the surfaced set, and it looks thin only because the surfaced set is three bids. There is no separate web page to scrape here. The joined data parts are the page text. Both jobs run after publishing and look bids up by cluster. A Florida bid that never published gets neither its files nor its page text."],tables:[[{header:!1,cells:["snapshot rows","144"]},{header:!1,cells:["rows with a description","3"]},{header:!1,cells:["rows with documents","3"]},{header:!1,cells:["rows with a contact email","3"]},{header:!1,cells:["rows with nothing but a title and dates","141"]}]]}],notes:[],then:"now that blanks are filled, look for duplicates again"},{n:"13",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment has just filled in buyers and closing dates that were blank an hour earlier. Pairs that could not be compared before can be compared now. This pass judges only that leftover, and only pairs touching a cluster that is new today.","If it finds no pairs it stops. Re-running the apply step on an old merge file is the mistake to avoid here."],cells:[{label:"Files it writes",paths:[{path:"data/portals/llm-dedup-candidates.json",size:"shared across all portals"},{path:"data/portals/llm-dedup-merges.json",size:"shared across all portals"}],blocks:[],notes:["Nothing here is Florida-specific. By this point a Florida bid is a cluster like any other."],tables:[]}],notes:[],then:"what changed since last time, and did everything run?"},{n:"14",title:"Change signals, emails, and the run check",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · alerts_engine.py · pipeline_sentinel.py",summary:[`Florida has no detailed watch recipe. Its settings say watch: "none". The free list-level scanner still covers it: it walks every portal in the registry and compares today's snapshot against the last archived one.`],cells:[{label:null,paths:[],blocks:[],notes:["An open question the files cannot settle. The sentinel must read cadence_days before it calls a two-day-old Florida archive stale. Nothing on disk from this run shows whether it does."],tables:[[{header:!1,cells:["closing date changed","can fire. Florida's rows carry due_date"]},{header:!1,cells:["status changed","can fire. Florida's rows carry status"]},{header:!1,cells:["addendum posted","can never fire. Florida's status values are only OPEN, CLOSED, PENDING or DRAFT, and there is no addendum counter on the row"]},{header:!1,cells:["the scanner on non-run days","runs anyway, but Florida's snapshot has not changed, so it produces nothing. Wasted work, not wrong work"]},{header:!1,cells:["the email digests","silently do nothing until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["the sentinel","checks every portal finished every phase and writes data/portals/sentinel.json"]}]]}],notes:[],then:"and then a person sees it"},{n:"15",title:"Packs, boards, and the numbers reported",who:"2.89 build_bidpack.py · 2.9-2.96 monitor + overview · 3-4.99 roll-up + scorecard.py",summary:["Every cluster is rendered into a folder of plain text: the bid summary, the page text, the requirements, the full document text. A Florida bid appears inside its cluster's folder as page-florida-vbs.md. Then the operator boards are rebuilt from every portal's stats file, and the day's roll-up and scorecard are written.","The end is not the database. The end is the board at shessi.dev/lgs, the morning email, and the pack folder a person opens."],cells:[{label:null,paths:[],blocks:[],notes:["Two rules at the reporting end. The monitor's staleness colouring has to read cadence_days, or Florida will look broken on every day it was never supposed to run. And Florida's scoring.yes is a standing live count, so it must never be added to another portal's. The only YES numbers reported come from scripts/scorecard.py."],tables:[]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Only bids the first read keeps ever get their text fetched","3 of 144 rows had a description, contact and documents on 28 July. The other 141 are permanently title-only. Everything downstream sees that same thin set"]},{header:!1,cells:["The word OPEN must be sent in capitals","Title case returns zero bids from the server and nothing looks broken"]},{header:!1,cells:["One failed page stops the pull instead of retrying","Only two pages exist. On 28 July page 1 held 100 rows and page 2 held 44, so one bad page is between a third and two thirds of the state. The single signal is a warning line in logs/pull_log.txt when the shortfall is bigger than one page"]},{header:!1,cells:["A bid that leaves the snapshot loses its verdict","Live on disk: AD-16510, AD-16525 and IN-16522 were in the 23 July verdicts and are gone on 28 July. The count drops silently, 5 to 3"]},{header:!1,cells:["stats.json.endpoint is not the real endpoint","stats.json records https://vendor.myfloridamarketplace.com while bids/index.json records the real one, …/mfmp/pub/search/bids. Two files, two answers, same run"]},{header:!1,cells:["MAYBE verdicts never reach the board","The card dump surfaces YES only for non-federal portals. On 28 July the MAYBE count was 0, so nothing was lost that run"]},{header:!1,cells:["Judged once, shown for days","Bid B was judged on 16 July and reappears unchanged on 20, 23 and 28 July. It is never re-read unless its closing date moves, a real scope arrives where there was none, or a new revision is posted"]},{header:!1,cells:["3-day setting against a fast-closing board","Bid B closed 29 July, one day after this run. The next run lands 31 July at the earliest. A bid posted and closed inside a 72-hour window can be missed completely, in a state whose hurricane and emergency work is the reason the portal was onboarded"]},{header:!1,cells:["The stage model is stale","docs/portal-dataflow/florida-vbs.md quotes the 23 July run throughout: 136 snapshot, 107 carryover, 29 new, 5 OPEN, 32 archive dates. Disk says 144, 109, 35, 3 OPEN and 33 archive dates. The files win"]},{header:!1,cells:["The runbook is stale too",'data/florida-vbs/PORTAL.md is still the auto-generated draft dated 14 July. It says last swept 13 July with 29 archive days; disk has 33 through 28 July. Its pull recipe, detail recipe and field map are all TODO, and its "current gap note" is about DemandStar document fees, not Florida']},{header:!1,cells:["The runbook says contact coverage 0%","The enriched snapshot rows carry contact_name, contact_email and contact_phone, and the board card for Bid B shows all three. Both statements are on disk. Which one is out of date cannot be settled from these files"]},{header:!1,cells:["A second copy of this portal still exists","open folders/platforms/florida-vbs/ has its own config, pull script and archive. Its config and pull script were last touched 30 May, and everything else in it stops at 3 June — that is the newest file anywhere in the folder, and the last date in its archive. The stage model says nothing in the current flow reads it and asks for that to be confirmed. PORTAL.md still lists its pull_bids.py as live code, so it is the wrong file to edit"]},{header:!1,cells:["The old public URL is dead","www.myflorida.com/apps/vbs returns 404 and has been retired. The live source is the vendor portal. Do not go looking at the old host again"]},{header:!1,cells:["State transport lettings are not here","Only its advertisements for goods and services appear. The actual road lettings sit behind Bid Express and are skipped on purpose"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/florida-vbs/daily/2026-07-28/stats.json, a row count, or a file listing. Long values inside records are shortened with a trailing … and never reworded. Baseline map: docs/portal-dataflow/florida-vbs.md (evidence-cited to file:line, and stale against this run). Companion page: Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/florida-vbs/daily/2026-07-28/stats.json, a row count, or a file listing. Long values inside records are shortened with a trailing … and never reworded. Baseline map: docs/portal-dataflow/florida-vbs.md (evidence-cited to file:line, and stale against this run). Companion page: Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-florida-vbs.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
