const e="commbuys",t="COMMBUYS: what happens to a bid, stage by stage",a="Portal pedia · 14",s="COMMBUYS: what happens to a bid, from the Massachusetts grid to the board",n="Every stage of the nightly run, with a real record from the actual files at each step. All data is from the run of 28 July 2026. Two bids are followed the whole way, and the honest headline of that night is what happened to them: neither one was touched by the AI. Both had been decided on an earlier day and were carried forward by the portal's own code. The AI saw 73 fresh titles, opened 2 of them, and scored those two no and maybe. Every one of the 4 YES bids on the board that night was an older decision riding along.",o=[{value:"854",label:"in snapshot"},{value:"781",label:"carried over"},{value:"73",label:"new tonight"},{value:"18",label:"triage says open"},{value:"836",label:"triage says skip"},{value:"4",label:"yes"},{value:"2",label:"maybe"},{value:"12",label:"no"}],i="Every number above is copied from data/commbuys/daily/2026-07-28/stats.json (505 bytes). The 18 OPEN and the 18 scored bids are cumulative across days, not tonight's work: only 2 of the 18 were opened tonight, and only those 2 were scored tonight. 33 daily archive folders exist for this portal.",r=["Bid A · BD-27-1107-1107T-TRC01-131496 · NOI DDP- Specialty Courts- Solider On, Trial Court. Carried in as a SKIP.","Bid B · BD-23-1165-COSPD-COS01-131378 · On Call Tree Removal, City of Salem. Carried in as a YES, score 85."],l=[{n:"1",title:"Is this portal due tonight?",who:"scripts/portal_due.py --batch portals · phase P0",summary:["The gate looks at the newest folder under data/commbuys/daily/. Cadence is one day, so COMMBUYS is due whenever today's folder is missing. If it is not due, nothing below runs at all.","One day is also a safety choice, not just a preference: this site slows down when it is hit fast."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"the portal list"},{path:"data/commbuys/daily/",size:"33 dated folders"},{path:"a printed list of due slugs",size:"no file is written"}],blocks:[],notes:[],tables:[]},{label:"The real registry row for this portal",paths:[],blocks:[`{
 "slug": "commbuys",
 "label": "COMMBUYS — Massachusetts Statewide
 Procurement",
 "engine": "commbuys",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:['Two of these fields are traps and both come back later: enrich_passes: [] does not mean "no documents", and carry_forward: "engine-internal" is why stage 10 does nothing.'],tables:[]}],notes:[],then:"the orchestrator hands the portal to a child agent"},{n:"2",title:"Dispatch",who:"Agent(general-purpose) reading .claude/skills/commbuys-sweep/SKILL.md · phase P1",summary:["COMMBUYS runs in Batch G of the nightly. One child agent per portal, five at a time, and the batch has to finish before the next starts. If this child errors, the roll-up marks the portal failed and the other portals carry on."],cells:[{label:"In → Out",paths:[{path:".claude/skills/commbuys-sweep/SKILL.md",size:"the phase list"},{path:"a running child agent",size:"no file"}],blocks:[],notes:[],tables:[]},{label:"The portal's real config",paths:[],blocks:[`{
 "engine": "commbuys",
 "state": "MA",
 "category": "state_procurement",
 "entity_url": "https://www.commbuys.com/bso/
 view/search/external/advancedSearchBid.
 xhtml?openBids=true",
 "auth": "none",
 "public_view": true,
 "page_size": 25,
 "max_pages": 80,
 "lgs_fit": "medium",
 "out_of_core_state": true,
 "onboarded": "2026-06-09"
}`],notes:[],tables:[]}],notes:[],then:"no browser, no login. A plain web client walks the grid"},{n:"3",title:"Pull: walk every page of the open-bid grid",who:"data/commbuys/scripts/run_daily.py · step 1: ps.pull · phase P1",summary:["First a plain GET of the search page. It hands back a security cookie, a hidden page token, and the first 25 rows. Then page after page is asked for with a POST that echoes that cookie back as a header, 25 rows at a time, until a short page says the list is done. A row is only kept if it carries at least twelve cells, and six of them are read: bid number, organization, description, opening date, status, and the agency's own reference.","No description exists yet. The grid's Description cell becomes the title. That is all a COMMBUYS bid has at this point."],cells:[{label:"In → Out",paths:[{path:"advancedSearchBid.xhtml",size:"one GET, then 34 POSTs · 35 pages in all"},{path:"data/commbuys/bids/all-bids.json",size:"517,848 bytes · 854 rows"},{path:"data/commbuys/bids/index.json",size:"334 bytes"},{path:"data/commbuys/logs/pull_log.txt",size:"129,009 bytes · written 2026-07-28"}],blocks:[`{
 "generated_at": "2026-07-28T21:26:22.939707+00:00",
 "snapshot_total": 854,
 "source": "commbuys",
 "engine": "commbuys",
 "endpoint": "https://www.commbuys.com/bso/
 view/search/external/advancedSearchBid.
 xhtml?openBids=true",
 "records_total_open": 859,
 "pages_scanned": 35,
 "open_total": 854,
 "state": "MA"
}`],notes:[],tables:[]},{label:"Real record Bid A · as pulled",paths:[],blocks:[`{
 "bid_id": "BD-27-1107-1107T-TRC01-131496",
 "title": "NOI DDP- Specialty Courts-
 Solider On",
 "buyer": "Trial Court",
 "agency": "Trial Court",
 "state": "MA",
 "due_date": "2026-07-29",
 "due_date_raw": "07/29/2026 15:00:00",
 "status": "Sent",
 "alternate_id": "",
 "detail_url": "https://www.commbuys.com/bso/
 external/bidDetail.sda?docId=BD-27-1107-
 1107T-TRC01-131496&external=true",
 "description": "",
 "_detail_ok": false
}`],notes:["Twelve fields, empty description. The detail_url is a genuine public link from the very first moment. Nothing later has to invent one."],tables:[]}],notes:["859 versus 854 is not a loss, but the alarm behind it can be eaten. The server reported 859 and the walk collected all 859. The last page line in logs/pull_log.txt reads page 35 (first=850): 9 rows, 9 new (total 859). The next log line is dropped 5 rows with due_date < 2026-07-28: five rows were already past their close date. So the file's 854 is fully explained, out loud, in the log. The catch is what that costs the truncation alarm. The alarm compares the count after the drop against the server's total and only fires past two pages (50 rows), so every normal expiry drop eats into the headroom that is meant to catch a real short pull. And a real short pull is possible: if one page POST throws, the loop breaks there and the night ends with a partial universe, marked by nothing louder than a log line."],then:"tonight's list is compared against last night's archive"},{n:"4",title:"Prep: split what is old from what is new",who:"data/commbuys/scripts/run_daily.py · step 2: ps.prep · phase P2",summary:["The snapshot is compared against the last archive's triage file. Bids already decided on a past day go into a carryover pile with their old decision attached. Bids never seen before go into the pile the AI will read. Only the new pile costs money.","This is half one of the portal's own memory. COMMBUYS does not wait for the shared carry-forward step later in the night. It re-adopts yesterday's decisions right here."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"854 rows"},{path:"runs/triage-carryover.json",size:"138,723 bytes · 781 rows"},{path:"runs/triage-input.json",size:"17,067 bytes · 73 rows"},{path:"runs/judge-input.json",size:"595,233 bytes · 854 rows"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 854,
 "carryover_count": 781,
 "triage_input_count": 73,
 "prior_archive_ids_compared_against": 830
}`],notes:['830 bids were on record last time and 781 of them are still open tonight, so 49 closed or vanished. 73 are brand new. "Last time" is 2026-07-24, four days back: the cadence says one day, but the archive folders jump 07-21, 07-23, 07-24, 07-28. The diff is only ever as fresh as the last folder that exists.'],tables:[]},{label:"Real records · both tracers land here, not in the AI pile Bid ABid B",paths:[],blocks:[`{
 "bid_id": "BD-27-1107-1107T-TRC01-131496",
 "decision": "SKIP",
 "reason": "specialty court program, not LGS",
 "title": "NOI DDP- Specialty Courts-
 Solider On"
}`,`{
 "bid_id": "BD-23-1165-COSPD-COS01-131378",
 "title": "27-06-DPS On Call Tree Removal,
 Maintenance, and Stump Grinding",
 "decision": "OPEN",
 "reason": "on-call tree removal, stump
 grinding"
}`],notes:["781 rows in this file: 765 SKIP and 16 OPEN. Counted from the file itself."],tables:[]}],notes:[`A big file that mostly holds nothing. judge-input.json is built for all 854 bids, but a bid whose detail page was never fetched has an empty body. Bid A's row, verbatim, ends like this: "description_full": "Title: NOI DDP- Specialty Courts- Solider On\\nBuyer: Trial Court\\n State: MA\\nCloses: 2026-07-29\\nSource URL: https://www.commbuys.com/bso/external/ bidDetail.sda?docId=BD-27-1107-1107T-TRC01-131496&external=true\\n\\n RFP body (truncated to 6KB):\\n" The header is there, the body is a single newline. 595 KB of that file is header text for bids nobody will ever score.`],then:"73 titles go to the AI, nothing else does"},{n:"5",title:"Pass 1: keep it or drop it, from the title alone",who:"Agent max-triage · AI · phase P3",summary:["The agent gets title, buyer, state and closing date for each of the 73 new bids and answers OPEN or SKIP. Default is SKIP. COMMBUYS titles are real sentences rather than codes, because they come from the grid's Description cell, so this call is better informed here than on most portals.","That night: 71 SKIP, 2 OPEN."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"17,067 bytes · 73 rows"},{path:"runs/triage-verdicts.json",size:"11,467 bytes · 73 rows"}],blocks:[`{
 "idx": 136,
 "bid_id": "BD-26-1350-TOWFA-HSFAC-131723",
 "decision": "SKIP",
 "reason": "Athletic field lighting renovation,
 construction not vegetation"
}`],notes:[],tables:[]},{label:"The only two OPENs the AI produced that night",paths:[],blocks:[`{
 "idx": 345,
 "bid_id": "BD-26-1154-1155-C-131699",
 "decision": "OPEN",
 "reason": "Loading and hauling services, LGS runs
 this fleet; earthwork adjacent"
}`,`{
 "idx": 400,
 "bid_id": "BD-27-1301-2-2-131744",
 "decision": "OPEN",
 "reason": "Town-wide landscaping, municipal
 grounds maintenance at townwide scope"
}`],notes:[],tables:[]}],notes:[`Neither tracer is in this file. Bid A and Bid B were both decided on earlier days. Everything the funnel shows as "18 open" and "18 scored" is mostly older work being re-counted. Tonight the AI's whole contribution to this portal was 73 title reads and 2 opens.`],then:"only OPEN bids get their detail page fetched"},{n:"6",title:"Enrich the OPENs: go get the real page",who:"ps.enrich_opens(PORTAL, config, open_ids) · phase P4",summary:["For each OPEN bid the public detail page is fetched, the HTML is stripped to text, and emails, phone numbers, a contact name and any off-portal document links are pulled out of the body. Those get written as a labelled CONTACT: and DOCUMENTS: block pinned to the front of the description, the whole stripped page is kept as page text, and any document links are chased for real files.","That prepend is a design decision that everything downstream depends on. COMMBUYS prints the buyer's contact as plain body text, never as a link, and the description is trimmed to 6 KB before the judge sees it. Putting the contact first is what keeps it alive.","Tonight it fetched exactly two pages. The input is tonight's triage answers, so only tonight's two OPENs were visited. The snapshot still shows 15 enriched rows because the writer merges the old snapshot forward into any field the fresh row leaves empty. Proof, from the day folders themselves: the previous archive (2026-07-24) holds 830 rows with 13 fetched pages; tonight's holds 854 rows with 15, and the two added are exactly the two OPENs from stage 5. Nothing was dropped."],cells:[{label:"What the whole snapshot looks like after this stage",paths:[],blocks:[],notes:["839 of 854 bids have no body text of any kind. For them the grid's one-line Description is the entire record, forever."],tables:[[{header:!0,cells:["Counted in bids/all-bids.json","Rows"]},{header:!1,cells:["rows in the file","854"]},{header:!1,cells:["detail page fetched OK (_detail_ok)","15"]},{header:!1,cells:["with any description at all","15"]},{header:!1,cells:["whose description starts CONTACT:","15"]},{header:!1,cells:["with saved page_text","9"]},{header:!1,cells:["with doc_pointers","11"]},{header:!1,cells:["with real downloaded documents","4"]},{header:!1,cells:["with a contact_email field","0"]}]]},{label:"Real record Bid B · enriched on an earlier night, carried forward",paths:[],blocks:[`{
 "bid_id": "BD-23-1165-COSPD-COS01-131378",
 "title": "27-06-DPS On Call Tree Removal,
 Maintenance, and Stump Grinding",
 "buyer": "City of Salem",
 "due_date_raw": "07/30/2026 11:00:00",
 "status": "Sent",
 "description": "CONTACT: Anthony P. Delaney ·
 adelaney@salem.com · (978) 619-5696 ·
 (978) 745-7461\\nDOCUMENTS: salem.com\\n\\n
 Bid Solicitation - BD-23-1165-COSPD-COS01-
 131378 … Purchaser: Anthony Delaney
 Organization: City of Salem Department:
 COSPD - Purchasing … File Attachments:
 27-06-DPS IFB Manual - On Call Tree
 Maintenance.pdf 27-06-DPS Attachment A -
 Prevailing Wage Schedule.pdf …",
 "_detail_ok": true,
 "doc_pointers": ["https://www.salemma.gov/"],
 "page_text": "COMMBUYS - Bid Solicitation -
 BD-23-1165-COSPD-COS01-131378 …"
}`],notes:["The page names the two real files by title, and we cannot download either of them. See the wall below."],tables:[]}],notes:["COMMBUYS' own attachments are out of reach. They download through a form POST that the anonymous view answers with an empty 202; it needs a seller login. A downloader for them exists in the repo and is deliberately left unwired until that login path is proven. So the two PDFs named on Bid B's page stay names. What the doc chase does fetch instead is whatever the buyer's own website links, which is its own problem, at stage 13."],then:"only bids that still need a verdict are assembled"},{n:"7",title:"Build the Pass 2 pile",who:"ps.build_judge_input_open(PORTAL) · phase P4",summary:["This collects the bids that still lack a verdict: tonight's OPENs, plus any older OPEN that was never scored, plus any already-scored bid whose material changed since the last run: an extended closing date, a description that has finally arrived, or a new revision number. It re-reads the snapshot so the body fetched minutes ago is in the prompt. Tonight that third case added nobody.","Notice the mismatch with the stage before. This step looks back at older unscored OPENs; the page fetch does not look back at all, because its only input is tonight's triage answers. An old OPEN that slipped through unscored would be judged on whatever body it happens to already have.","Tonight that pile is 2 bids, exactly the two the AI opened. The other 16 OPENs already had a verdict from a previous night and are skipped."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:"tonight's and older opens"},{path:"daily/<last date>/verdicts.json",size:"who already has a verdict"},{path:"runs/judge-input-open.json",size:"5,174 bytes · 2 rows"}],blocks:[],notes:["The two bodies are 2,306 and 2,114 characters. Both real pages, both fetched at stage 6."],tables:[]},{label:"Real record · one of the two, shortened",paths:[],blocks:[`{
 "idx": 345,
 "bid_id": "BD-26-1154-1155-C-131699",
 "title": "27-0068 Soil - Loading and Hauling",
 "buyer": "City of Medford",
 "state": "MA",
 "due_date": "2026-08-13",
 "detail_url": "https://www.commbuys.com/bso/
 external/bidDetail.sda?docId=BD-26-1154-
 1155-C-131699&external=true",
 "description_full": "Title: 27-0068 Soil - Loading
 and Hauling\\nBuyer: City of Medford\\n…\\n
 RFP body:\\nCONTACT: Fiona Maxwell ·
 fmaxwell@medford-ma.gov · (781) 393-2465 ·
 (781) 393-2479\\nDOCUMENTS: medford-ma.gov
 \\n\\nBid Solicitation - BD-26-1154-1155-C-
 131699 …"
}`],notes:["Note the header says RFP body: here, while the big judge-input.json at stage 4 says RFP body (truncated to 6KB):. Two builders, two wordings, same field name."],tables:[]}],notes:[],then:"the AI reads the real page and scores it"},{n:"8",title:"Pass 2: the score",who:"Agent max-bid-judge · AI · phase P5",summary:["Yes, maybe or no, with a number out of 100, a reason, and the signal lists. Massachusetts sits outside the eight states LGS works in, so every surfaced bid carries an out-of-core flag, a label for the operator, never a rejection.","Zero YES that night. One no at 32, one maybe at 48. Both real judgements on real page text, and both against LGS."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"2 rows"},{path:"runs/judge-verdicts.json",size:"2,503 bytes · 2 rows"}],blocks:[],notes:[`The maybe is honest about its own blind spot. On BD-27-1301-2-2-131744, "IFB - Town-Wide Landscaping III", the judge wrote score 48 and the reason says the COMMBUYS body "is a header stub and the real IFB sits on the OpenGov portal, unread". Its red flags include thin_description_pull_rfp_packet and island_mobilization_cost_nantucket. The document wall at stage 6 is visible right here, in the AI's own words.`],tables:[]},{label:"Real record · the night's only fully-read verdict",paths:[],blocks:[`{
 "bid_id": "BD-26-1154-1155-C-131699",
 "title": "27-0068 Soil - Loading and Hauling",
 "would_lgs_bid": "no",
 "score": 32,
 "primary_reason": "Medford DPW is buying loading
 and hauling of soil on a 1-year contract with
 a 1-year option — the body says nothing about
 trees, brush, vegetation, or storm debris,
 and the UNSPSC line (11-11-15-00-0000) is
 dirt/earth material, not vegetative debris…",
 "service_match": "adjacent",
 "scale_match": "unknown",
 "buyer_match": "core",
 "red_flags": [
 "out_of_core_state",
 "material_hauling_not_vegetative_debris",
 "no_tree_brush_or_storm_scope_in_body",
 "excavation_trucking_contractor_vertical"
 ],
 "fit_signals": [
 "municipal_dpw_buyer_type_lgs_works_with",
 "annual_contract_with_option_year",
 "loading_and_hauling_uses_lgs_grapple_
 and_truck_fleet"
 ],
 "kansas_city_risk": false,
 "closed_award": false
}`],notes:[],tables:[]}],notes:[],then:"old decisions and new ones are merged into one night's record"},{n:"9",title:"Compile: write tonight's archive",who:"ps.compile_archive(PORTAL, config) · phase P6",summary:["Carryover plus new triage becomes one triage file of 854 rows. Then the second half of the portal's own memory: yesterday's verdicts, for bids still open tonight, are merged with tonight's two. 2 fresh + 16 carried = the 18 verdicts the funnel reports.","Each verdict row is also written twice over, in both key spellings (would_lgs_bid and verdict, score and lgs_score), so a strict reader downstream cannot silently lose a YES."],cells:[{label:"data/commbuys/daily/2026-07-28/",paths:[],blocks:[],notes:['Note that new-bids.json is byte-for-byte the size of the snapshot: on this portal it is not "new bids", it is the whole open universe copied into the day folder.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","854 rows, the full snapshot copy","517,848 B"]},{header:!1,cells:["triage.json","854 decisions, tomorrow's memory","150,187 B"]},{header:!1,cells:["verdicts.json","18 scored bids","16,461 B"]},{header:!1,cells:["stats.json","the funnel at the top of this page","505 B"]},{header:!1,cells:["report.md","the human summary","3,303 B"]}]]},{label:"Real record Bid B · a verdict from an earlier night, re-written tonight",paths:[],blocks:[`{
 "bid_id": "BD-23-1165-COSPD-COS01-131378",
 "would_lgs_bid": "yes",
 "verdict": "yes",
 "score": 85,
 "lgs_score": 85,
 "primary_reason": "On-call tree removal,
 maintenance, and stump grinding for a city
 DPW is straight Category 4 - matches multiple
 won contracts (Annual Tree Removal, Stump
 Grinding, and Mulching; On-Call Tree Trimming
 Services) almost verbatim. On-call qualifier
 puts it above floor.",
 "title": "27-06-DPS On Call Tree Removal,
 Maintenance, and Stump Grinding",
 "red_flags": [
 "out_of_core_8_states_MA",
 "prevailing_wage_schedule_attached"
 ]
}`],notes:["The other three YES that night, also carried: Emergency Tree Trimming & Removal (Brockton, 85), Tree trimming/line clearance (West Boylston Municipal Lighting Plant, 80), IFB - TREE REMOVAL FOR BFD (Boston, 62)."],tables:[]}],notes:[],then:"the portal's own night is over. The shared machinery takes over"},{n:"10",title:"Shared carry-forward: deliberately does nothing here",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:['Most portals get their old verdicts rescued by this shared script. COMMBUYS does not, and that is on purpose. The registry says carry_forward: "engine-internal", and the --all run only touches portals whose value is "orchestrator". So this slug is filtered out and nothing is written for it.',"What that means for this portal: its memory is not weaker, it is earlier. Stage 4 re-adopts old triage decisions and stage 9 re-adopts old verdicts. Running the shared step too would apply the same carry-forward twice. The registry value is checked as a drift gate, so flipping it by accident is caught."],cells:[{label:"The proof, in tonight's own numbers",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Old triage decisions re-adopted at stage 4","781 rows in runs/triage-carryover.json"]},{header:!1,cells:["Old verdicts re-adopted at stage 9","18 in the archive minus 2 written tonight = 16 carried"]},{header:!1,cells:["Written by the shared carry-forward script","nothing"]}]]}],notes:[],then:"the day folder is read back by three shared scripts"},{n:"11",title:"Ledger, report, and the hand-off file",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps read the folder that stage 9 just wrote. The ledger walks every verdicts file this portal ever produced and folds its YES and MAYBE bids into the all-portal list, which is why that list is a superset of the board. The report is overwritten with the one layout every portal shares. Then the fixture dump turns portal-shaped rows into board-shaped cards. This is the hand-off, the moment COMMBUYS data stops living in its own folder."],cells:[{label:"In → Out",paths:[{path:"data/commbuys/daily/*/verdicts.json",size:"all 33 folders"},{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"daily/2026-07-28/report.md",size:"rewritten · 3,303 bytes"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 15 from commbuys"}],blocks:[],notes:["The rewritten report ends with its own timestamp: Standardized report · regenerated 2026-07-28T22:37:26+00:00, an hour after compile finished at 21:34 UTC."],tables:[]},{label:"All 15 COMMBUYS cards in the fixture, and what is missing",paths:[],blocks:[],notes:[`MAYBE never reaches the board. The dump sends only yes for non-federal portals. So the two MAYBE bids on 28 July, FAC120 Landscaping, Snow Removal, Tree Services … (55) and IFB - Town-Wide Landscaping III (48), reach the local ledger and stop there. They never become board rows, never get documents published, never appear in an email. This is settled policy, not drift: the dump's own comment calls YES-only the board rule and federal feeds the one exception. The stale wording is one file downstream: the publisher's header still describes the bids table as "YES+MAYBE".`],tables:[[{header:!0,cells:["Verdict","Cards in the fixture"]},{header:!1,cells:["yes","15"]},{header:!1,cells:["maybe","0"]}]]}],notes:[],then:"the cards meet every other portal's cards"},{n:"12",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The fixture, not the portal folder, is read and pushed into the shared board database. Bids are then grouped into clusters so one solicitation seen on two portals shows once. Clustering blocks on normalized title plus state, and on solicitation number plus state.","COMMBUYS always carries a real buyer, because the grid's organization cell is never blank, so the buyer-based split works cleanly here."],cells:[{label:"How much duplicate pressure this portal creates",paths:[],blocks:[],notes:["Contact is patched, never overwritten. The additive contact update exists because of this portal's family: a full-row upsert once wiped contact for texas-esbd, georgia and commbuys, taking them from full coverage to zero in a single publish.","From data/portals/overlap.json, built 2026-07-24T22:32:19+00:00."],tables:[[{header:!0,cells:["Shares normalized titles with","Count"]},{header:!1,cells:["demandstar","14"]},{header:!1,cells:["napc","10"]},{header:!1,cells:["beaconbid","6"]},{header:!1,cells:["bidexpress","2"]},{header:!1,cells:["scbo","1"]}]]},{label:"Real record Bid B as a board card",paths:[],blocks:[`{
 "id": "1f37f60fd807e6e1",
 "portal": "commbuys",
 "source_bid_id": "BD-23-1165-COSPD-COS01-131378",
 "title": "27-06-DPS On Call Tree Removal,
 Maintenance, and Stump Grinding",
 "buyer": "City of Salem",
 "state": "MA",
 "solicitation_no": null,
 "federal": false,
 "score": 85,
 "verdict": "yes",
 "description": "CONTACT: Anthony P. Delaney ·
 adelaney@salem.com · (978) 619-5696 ·
 (978) 745-7461\\nDOCUMENTS: salem.com\\n\\n
 Bid Solicitation - BD-23-1165-COSPD-COS01-
 131378 …",
 "due_date": "2026-07-30",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": [
 "out_of_core_8_states_MA",
 "prevailing_wage_schedule_attached"
 ],
 "first_seen": "2026-07-15",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["The three contact fields are null in the fixture. The email is sitting in plain sight inside the description. Filling the columns is a separate job, next stage. first_seen 2026-07-15 is why this bid was already decided long before tonight."],tables:[]}],notes:[],then:"the board tries to fill what the portal could not"},{n:"13",title:"Documents, contact columns, requirements",who:"2.85b run_enrichment_phase.py · 2.87 extract_doc_text.py → requirements-extractor → apply_requirements.py",summary:["COMMBUYS has no enricher of its own registered. Its enrich_passes list is empty. It is still enriched, by three shared jobs: documents the engine already recorded get uploaded, page text gets published, and the contact columns get filled by parsing the CONTACT line the engine wrote at stage 6.",`Then every published cluster's documents are read and an agent extracts what the bid requires: bonds, licences, insurance, pre-bid meetings. A cluster with no readable file gets a neutral "no material" row rather than a blank.`],cells:[{label:"The contact chain · one string holds it all up",paths:[],blocks:[],notes:["Zero rows in the snapshot carry a contact_email field. All 15 enriched descriptions start with CONTACT:. The column filler matches exactly the engine's CONTACT: Name · email · phone shape. Break that prepend and contact coverage for this portal goes to zero overnight, with nothing failing loudly.","5 of the 15 COMMBUYS cards show has_documents: true. That flag comes from the shared documents table, not from the snapshot. Bid B's snapshot row has no downloaded files at all, only a pointer to salemma.gov, yet its card shows the paperclip."],tables:[]},{label:"What the doc chase actually downloaded that night · all 4 rows",paths:[],blocks:[],notes:["This is a real defect, confirmed on this night's files. All four bids pulled files that are not the solicitation. When the page gives only a bare agency domain as the document hint, the chase downloads whatever PDFs that homepage links. Those files then feed the documents table, the text extractor, the bid pack and the requirements agent. A bare homepage should be a pointer, not a download."],tables:[[{header:!0,cells:["Bid","Files fetched"]},{header:!1,cells:["WAT-27-09 ON-CALL WATER, SEWER & STORMWATER REPAIRS City of Everett","6 files. Three are junk: OVER-FLOW-FLYER…pdf, Trash-Collection-Schedule…pdf, Boards-and-Commissions-with-Current-Vacancies_10-30-24.pdf. Two are the solicitation (25-25-On-call-Water-Bid-Final.pdf, 25-25-On-Call-Water-Bid-Detail.pdf) plus a prevailing wage sheet."]},{header:!1,cells:["IFB - TREE REMOVAL FOR BFD City of Boston","12 files. Two City Record editions, an executive order on procurement goals, and nine vendor how-to guides in Cantonese and Spanish (Entering a Bid On-Line - Cantonese.pdf). Not one of them is the tree IFB."]},{header:!1,cells:["SCH-81226-1000 City of Attleboro","2 files. The same City of Attleboro Charter…pdf twice, once over http and once over https."]},{header:!1,cells:["SPACER CABLE SYSTEM Templeton Light & Water Department","8 files. A water ban notice, an EV charger flyer, a heat pump form, a connected-homes flyer… and one real file: Templeton-RFP-bid-package-spacer-cable-system-7-20-26.pdf."]}]]}],notes:[],then:"newly filled fields make new pairs comparable"},{n:"14",title:"Dedup, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment and the requirements backfill have just filled blank buyers, closing dates and solicitation numbers. Pairs that were not comparable an hour ago now are, so dedup runs again, only over that residue, not the whole board.","Why it matters for COMMBUYS specifically: the second clustering key is solicitation number plus state, and the engine already captures the agency's own reference in the snapshot's alternate_id. That field was empty on both tracers tonight, but it is the natural feed for that key when the agency fills it in."],cells:[{label:"In → Out",paths:[{path:"the shared clusters table + past dedup rulings",size:null},{path:"data/portals/llm-dedup-merges.json",size:null}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed since last night, and who needs to be told"},{n:"15",title:"Watch, digests, sentinel",who:"2.88 · watch_list_signals.py · publish_page_text.py · the digest senders · pipeline_sentinel.py",summary:["Tonight's snapshot is diffed against the last archived one for changes the page already shows. Then the discovery, deadline and contract emails go out, and a health check closes the run."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Free list-signal watcher","works here. COMMBUYS prints an Amendments table inside the text already captured. This portal is one of the four the free watch layer was designed around"]},{header:!1,cells:['Registry watch: "none"',"means no second re-capture pass, not untouched. The signal watcher loops every registry slug regardless"]},{header:!1,cells:["Page text published","9 of 854 rows have page text to publish"]},{header:!1,cells:["Discovery + watch + contract emails","silent no-op until the mail key exists in data/auth/resend.env"]},{header:!1,cells:["Sentinel","checks every portal finished every phase, writes data/portals/sentinel.json"]}]]}],notes:[],then:null}],d=[{heading:"Files in runs/ that tonight's run never touched",tables:[[{header:!0,cells:["File","Last written","What it is"]},{header:!1,cells:["_triage_prompt.json","2026-06-09","125,518 bytes, 954 rows of title/buyer/state, a Pass 1 prompt payload for a 954-bid snapshot. Written on the day the portal was onboarded, seven weeks stale. Agent scratch, not pipeline output."]},{header:!1,cells:["judge-verdicts-new.json","2026-06-13","2 rows in verdict shape, for two bids that are not the two judged tonight. Nothing reads it: compile only reads judge-verdicts.json. A staging file somebody merged by hand."]},{header:!1,cells:["_backfill_blocks.json + _backfill.sql","2026-06-22","8 computed CONTACT blocks and hand-written UPDATE statements that paste them into the board's description column. The one-off repair that created the CONTACT-prepend design. Nothing emits either file."]},{header:!1,cells:["doc_targets.json · enrich_targets.json","2026-06-22","5 rows each. Both scripts print to the screen; these files exist only because a person redirected the output once."]},{header:!1,cells:["_open_ids.json","2026-07-13","39 bytes: a list of one bid id, BD-26-1150-CH015-CH015-131320. Looks like a hand-built argument for a single enrich run. That bid is still in tonight's snapshot, enriched."]},{header:!1,cells:["runs/docs/","2026-06-22","an empty folder."]}]],paragraphs:["Fourteen files and one folder sit in data/commbuys/runs/. Seven files were written by tonight's run. The other seven are older, and no code in the repo writes any of them. Dates below are the files' own last-modified stamps."]},{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Only OPEN bids ever get their page fetched","15 of 854 rows have any body text. For the other 839 the grid's one-line Description is title, description and evidence all at once, and the SKIP made from it is final"]},{header:!1,cells:["COMMBUYS' own File Attachments cannot be downloaded","they need a seller login; the anonymous endpoint answers empty. A downloader is written and deliberately unwired, with no tracked condition for wiring it, so it can sit dead forever"]},{header:!1,cells:["A bare agency homepage is used as a document seed","every one of the 4 doc-bearing bids tonight pulled files that are not the solicitation: Cantonese vendor guides, a trash collection schedule, a city charter twice, a water ban notice. That junk reaches the documents table, the bid pack and the requirements agent"]},{header:!1,cells:["The CivicPlus plan-holder wall","the captcha is solved and the plan-holder form does submit, but CivicPlus never shows a download link afterwards. The files are emailed to the plan-holder or need a website account, so a human has to fetch them"]},{header:!1,cells:["The doc chase only ever does a plain fetch","form-gated sources such as ProjectDog and the Winthrop plan-holder page stay as pointers in the description. That is deliberate: a fake download is worse than an honest pointer"]},{header:!1,cells:["The page fetch never looks back","it reads tonight's triage answers only, so tonight it visited 2 pages while the snapshot showed 15 enriched rows. The other 13 are older work merged forward. The judge pile, by contrast, does look back at older unscored OPENs"]},{header:!1,cells:["The whole contact chain is one prepended string","0 rows carry a contact_email field; the email only exists inside CONTACT: … at the head of the description. Change that format and coverage silently drops to zero"]},{header:!1,cells:["MAYBE never reaches the board",`2 MAYBE bids on 28 July, 0 maybe cards in the fixture. Settled policy, stated in the dump's own comment: YES-only is the board rule, federal feeds are the exception. What is stale is the publisher's header, which still describes the bids table as "YES+MAYBE"`]},{header:!1,cells:["One failing page POST ends the walk","a 403 or a timeout at page N yields an N-page universe with only a log line. The alarm that should catch it compares the count after expired rows are dropped and fires only past 50, so ordinary drops (5 tonight) spend headroom meant for a real short pull"]},{header:!1,cells:["enrich_passes is empty in the registry",'any dashboard or audit reading that as "no enrichment" mis-reports this portal: documents, page text and contact all arrive through shared passes']},{header:!1,cells:["Seven stale files in runs/ with no writer","anyone reading _triage_prompt.json (954 rows) or judge-verdicts-new.json as current gets numbers from June"]},{header:!1,cells:["The runbook at data/commbuys/PORTAL.md is an auto-generated draft",'every field-map row says TODO; its health block is dated 2026-07-14 and its "current gap note" describes a single bid, not the portal. It never mentions the token-and-cookie pagination or the CONTACT-block design, the two things that actually make this portal work']},{header:!1,cells:["The stage model doc is anchored on an older night","docs/portal-dataflow/commbuys.md quotes 830 bids over 34 pages, 29 new, 13 enriched, 16 verdicts, all from 2026-07-24. The files on disk for 2026-07-28 say 854 over 35 pages, 73 new, 15 enriched, 18 verdicts. Where they differ, the files win, and every number on this page comes from the files"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file. Nothing on this page is an example or a reconstruction. Counts come from data/commbuys/daily/2026-07-28/stats.json, from row counts of the named JSON files, and from their byte sizes on disk. Baseline map: docs/portal-dataflow/commbuys.md (evidence-cited to file:line, anchored on the 2026-07-24 run). Companion page: Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file. Nothing on this page is an example or a reconstruction. Counts come from data/commbuys/daily/2026-07-28/stats.json, from row counts of the named JSON files, and from their byte sizes on disk. Baseline map: docs/portal-dataflow/commbuys.md (evidence-cited to file:line, anchored on the 2026-07-24 run). Companion page: Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-commbuys.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
