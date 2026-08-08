const e="ionwave",t="IonWave: what happens to a bid, stage by stage",a="Portal pedia · 23",s="IonWave: what happens to a bid, across 292 separate websites",n="IonWave is one product sold to 292 government bodies, each on its own website. We crawl a third of them a night and carry the other two thirds forward. All data on this page is from the run of 28 July 2026. That night the crawl touched 97 sites, found 37 bids it had never seen, opened one of them, and scored that one. Everything else on the board was a decision made on an earlier day and copied across.",o=[{value:"951",label:"in snapshot"},{value:"914",label:"carried over"},{value:"37",label:"new tonight"},{value:"25",label:"triage says open"},{value:"926",label:"triage says skip"},{value:"7",label:"yes"},{value:"5",label:"maybe"},{value:"13",label:"no"}],i="Every number above is copied from data/ionwave/daily/2026-07-28/stats.json (477 bytes). The other 926 of the 951 are SKIPs. The snapshot file itself, data/ionwave/bids/all-bids.json, is 673,369 bytes and 951 rows. Only 316 of those 951 rows were actually fetched that night. The rest were carried from earlier runs. And only 1 of the 25 verdicts was written that night; the other 24 were copied forward.",r=["Bid A · lexingtoncounty:2027-IFB-07 · Honor Guard Uniforms for LCFS. SKIP.","Bid B · lexingtoncounty:2027-RFPQ-03 · On-Call Tree Trimming, Lexington County SC. YES, score 82.","Bid C · garlandtx:REQ00002591 · Mulching of Vegetative Debris, City of Garland TX. YES, score 70."],d=[{n:"0",title:"Is IonWave due tonight?",who:"scripts/portal_due.py --batch portals",summary:["Before anything runs, one script checks how long ago this portal last wrote a daily folder and compares it to its schedule. IonWave is set to every 1 day. If it is due, the word ionwave is printed and the orchestrator picks it up.","The registry row is also where every later stage learns how to treat this portal: whether it joins the shared carry-forward, whether it goes on the board, which batch it belongs to."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"the ionwave row, lines 533-545"},{path:"data/ionwave/daily/<date>/",size:"8 folders exist: 07-12, 07-13, 07-16, 07-20, 07-21, 07-23, 07-24, 07-28"}],blocks:[],notes:["Not printed means not run tonight. Nothing is lost. The third of the sites that would have been swept just slides a day."],tables:[]},{label:"The real registry row",paths:[],blocks:[`{
 "slug": "ionwave",
 "label": "IonWave (292 public agencies)",
 "engine": "ionwave",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "v1-pagetext",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Two fields in this row are out of date. authed: false and enrich_passes: [] are both contradicted by an IonWave login pass registered at scripts/enrichers.py:65-66. See the quirks table."],tables:[]}],notes:[],then:"pick which sites get visited tonight"},{n:"1",title:"Take a third of the sites",who:"data/ionwave/scripts/run_ionwave_sweep.py pull --shards 3",summary:["There are 292 sites and one shared gate in front of all of them. Visiting all 292 in one night takes one to three hours and reliably gets us throttled. So the list is cut into thirds by line number, every third host to a group, and today's date picks which group. Over three nights every site gets one visit.","The slice is decided by position in the file, not by content. Reorder or trim tenants.txt and a different set of sites lands in a different night."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/tenants.txt",size:"292 lines, one host each"},{path:"data/ionwave/tenants_shard.txt",size:"2,223 bytes · 97 lines · written 28 Jul 12:48"}],blocks:[],notes:["97 of 292 that night. Three separate files agree: 97 lines in the shard file, tenants_total: 97 in data/ionwave/bids/index.json, and 97 keys in the tenant cache. lexingtoncounty appears in none of them."],tables:[]},{label:"The first names in tonight's third (keys of _tenant_cache_2026-07-28.json)",paths:[],blocks:[`791coop aisd allenisd
alvinisd annatexas azleisd
bettendorf bisd blinn
bocomobids brookhavenny burlcobids
… clemson col
… garlandtx ← Bid C lives here
… wrga wylietexas

lexingtoncounty is NOT in this list
→ Bid A and Bid B were not visited tonight`],notes:[],tables:[]}],notes:[],then:"one site at a time, with a pause between each"},{n:"2",title:"Crawl, low and slow",who:"open folders/_lib/engines/ionwave.py · plain HTTP, no browser",summary:["Each site's public bid list is a plain web page. The engine fetches one site at a time, waits 12 to 18 seconds, then fetches the next, and walks the page numbers. Every site's result is written to a cache file the moment it lands, so killing the run does not throw the work away.","The speed is not a preference. All 292 sites sit behind one shared gate that counts requests per network address. Three workers with a 3 second pause used to make every site refuse us, and the sweep produced zero bids. One worker at 12 to 18 seconds is what actually returns data."],cells:[{label:"In → Out",paths:[{path:"https://<site>.ionwave.net/SourcingEvents.aspx?SourceType=1",size:"97 sites"},{path:"data/ionwave/runs/_tenant_cache_2026-07-28.json",size:"152,852 bytes · 97 keys"},{path:"data/ionwave/bids/all-bids.json",size:"overwritten with tonight's 316 rows"},{path:"data/ionwave/bids/index.json",size:"295 bytes"}],blocks:[],notes:["The list page has no links. The real deep link, PublicDetail.aspx?bidID=…, is not in the visible page at all. It is dug out of a hidden blob the grid ships with its own state (ionwave.py:77, :111, :126). Without that, every bid would be a title with nowhere to go."],tables:[]},{label:"index.json, read straight off disk",paths:[],blocks:[`{
 "generated_at": "2026-07-28T18:39:53.987778+00:00",
 "snapshot_total": 316,
 "source": "ionwave",
 "engine": "ionwave",
 "tenants_total": 97,
 "tenants_ok": 53,
 "tenants_empty": 44,
 "tenants_error": 0,
 "tenants_deferred": 0,
 "rows_parsed": 316,
 "open_total": 316
}`],notes:["A good night: 0 errors and 0 sites throttled out. 44 of the 97 simply had no open bids. But note snapshot_total: 316. This file describes tonight's third, not the board. The board ends the run at 951 and this file is never updated to say so."],tables:[]}],notes:[],then:"tonight's third is stitched back onto the other two thirds"},{n:"3",title:"Stitch the board back together",who:"data/ionwave/scripts/run_ionwave_sweep.py:88-93",summary:["Bids from tonight's 97 sites replace the old copies for those sites. Bids from the other 195 sites are kept exactly as they were. The result is one file that still describes the whole board, so the next stage sees a third of a night's change instead of the whole board flipping.","The print line from the run says it plainly: 316 fresh + 635 carried = 951 total."],cells:[{label:"In → Out",paths:[{path:"316 rows just crawled",size:"+"},{path:"635 rows kept from earlier runs",size:"="},{path:"data/ionwave/bids/all-bids.json",size:"673,369 bytes · 951 rows · 171 distinct sites"}],blocks:[],notes:[`Two real costs of carrying, both measured on this run. 1. Closed bids linger. The "only keep bids closing today or later" filter runs inside the engine, on fresh rows only. Carried rows are never re-checked. On 28 July, 127 of the 951 rows had already closed, and all 127 of them were carried rows. Zero fresh rows were stale. Bid B, closed 22 July, is one of them, and it is still the top YES on the day's report. 2. A throttled site loses its history. The keep rule is "every prior bid whose site is not in tonight's third". A site that IS in tonight's third but returns nothing has its prior bids dropped from both lists. Tonight that cost nothing (tenants_deferred: 0), but 47 bids that were in the 24 July snapshot are not in tonight's, from 961 compared down to 914 carried decisions.`],tables:[]},{label:"Bid B, as it sits carried in all-bids.json Bid B",paths:[],blocks:[`{
 "bid_id": "lexingtoncounty:2027-RFPQ-03",
 "ref": "2027-RFPQ-03",
 "addendum_no": 0,
 "title": "On-Call Tree Trimming, Removal
 & Stump Grinding Services",
 "buyer": "Lexingtoncounty",
 "agency": "Lexingtoncounty",
 "state": "",
 "bid_type": "RFPQ",
 "status": "Open",
 "due_date": "2026-07-22",
 "due_date_raw": "7/22/2026 12:00:00 PM (ET)",
 "issue_date": "2026-07-06",
 "detail_url": "https://lexingtoncounty.
 ionwave.net/PublicDetail.aspx?bidID=1052&SourceType=1",
 "description": "ALL QUESTIONS REGARDING THIS
 SOLICITATION MUST BE SUBMITTED IN IONWAVE…",
 "_detail_ok": true,
 "_docs_postback_walled": true
}`],notes:['Two things to notice. "status": "Open" even though the close date is six days in the past. Status is whatever the site said the last time we looked. And "state": "": 893 of the 951 rows have no state at all, because 272 of the 292 entries in data/ionwave/tenants.json have a blank state.'],tables:[]}],notes:[],then:"which of these 951 have we never seen before?"},{n:"4",title:"Work out what is genuinely new",who:"open folders/_lib/platform_sweep.py · prep",summary:["The 951 rows are checked against the newest previous day's decision file. A bid we have decided before keeps its old decision. A bid we have never seen goes into the queue for the AI. 914 kept their decision. 37 were new.","This is where IonWave does its own memory. It does not use the shared safety net that other portals use later on. It re-applies its own decisions right here, and again when the archive is written."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/bids/all-bids.json",size:"951 rows"},{path:"data/ionwave/daily/2026-07-24/triage.json",size:"the newest previous archive, four days back"},{path:"data/ionwave/runs/triage-input.json",size:"7,335 bytes · 37 rows"},{path:"data/ionwave/runs/triage-carryover.json",size:"111,892 bytes · 914 rows"},{path:"data/ionwave/runs/judge-input.json",size:"548,228 bytes · 951 rows"},{path:"data/ionwave/runs/_funnel.json",size:"156 bytes"}],blocks:[],notes:["judge-input.json is built for all 951 rows even though the judge only ever reads a filtered slice of it. It is not dead. Stage 6 reads it back and picks out the rows it needs."],tables:[]},{label:"_funnel.json, whole file",paths:[],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 951,
 "carryover_count": 914,
 "triage_input_count": 37,
 "prior_archive_ids_compared_against": 961
}`,`{
 "bid_id": "lexingtoncounty:2027-IFB-07",
 "decision": "SKIP",
 "reason": "uniforms"
}`],notes:["One word decided it, on an earlier day. Tonight that word just gets copied across. Bid A costs nothing further, ever. That is the whole point of the carry file."],tables:[]}],notes:[],then:"the 37 new titles go to the AI"},{n:"5",title:"First pass: open it or bin it",who:"max-triage · AI (read-only; the operator writes the file)",summary:["The AI gets six fields per bid and nothing else: a title, a buyer, a state, a close date, a row number and an id. There is no description on an IonWave list page, so a title is the entire case a bid gets to make.","Default is bin it. Out of 37 new bids that night, 36 were SKIP and 1 was OPEN. That one is Bid C."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/runs/triage-input.json",size:"37 rows"},{path:"data/ionwave/runs/triage-verdicts.json",size:"5,268 bytes · 37 rows"}],blocks:[],notes:[`Five files in this folder are not from this run. _triage_batch_1.json and _triage_batch_2.json (19 rows each), their two verdict files, and _judge_verdicts_batch_1.json all carry a 13 July timestamp on disk. 19 + 19 is 38, which is exactly the "new" count on the 13 July row of data/ionwave/daily/INDEX.md. They are two-week-old scratch files that were never cleaned up, sitting next to tonight's real ones with no way to tell them apart from the name.`],tables:[]},{label:"Bid C in, Bid C out Bid C",paths:[],blocks:[`{
 "idx": 765,
 "bid_id": "garlandtx:REQ00002591",
 "title": "Mulching of Vegetative Debris",
 "buyer": "Garlandtx",
 "state": "TX",
 "due_date": "2026-08-11"
}`,`{
 "bid_id": "garlandtx:REQ00002591",
 "idx": 765,
 "decision": "OPEN",
 "reason": "mulching vegetative debris, Cat 1/6"
}`],notes:["Bid C has a real state (TX) because garlandtx is one of the 20 sites in tenants.json that have one. Most bids reach the judge with the state field blank."],tables:[]}],notes:[],then:"only the OPENs get their detail page opened"},{n:"6",title:"Go and read the actual bid page",who:"run_ionwave_sweep.py prep-judge → engines/ionwave.py · headless browser",summary:["This is the only stage that can add real text to an IonWave bid. A browser opens each OPEN bid's detail page and lifts the scope notes, the buyer's name and phone, and the list of attached files. Then the judge's input is rebuilt so it carries that text instead of just a title.","It runs on the OPEN bids that still need a verdict, nothing else. Which is why, out of 951 rows, only 20 carry page text, 20 carry a contact, 20 carry a document list, and 17 carry a description. The other 931 are a title, a buyer and a date."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/runs/{triage-verdicts, triage-carryover}.json",size:"who still needs judging"},{path:"https://garlandtx.ionwave.net/PublicDetail.aspx?bidID=4065",size:"2,195 characters of page text"},{path:"data/ionwave/bids/all-bids.json",size:"rewritten with contact + documents + page_text"},{path:"data/ionwave/runs/judge-input-open.json",size:"1,125 bytes · 1 row"}],blocks:[],notes:['The model doc is behind the code here. docs/portal-dataflow/ionwave.md describes this stage as "which bids still need a verdict". The code at platform_sweep.py:209-250, called at :279, now also re-queues bids that were already judged, when the close date was pushed back, when a real description finally arrived, or when the addendum number moved. Nothing was re-queued on 28 July, so the count is the same either way, but the model does not describe this behaviour.'],tables:[]},{label:"Selected fields of Bid C in all-bids.json Bid C",paths:[],blocks:[`{
 "contact_name": "Liz Segura",
 "contact_phone": "972 (205) 2416",
 "contact_email": "esegura@garlandtx.gov",
 "_detail_ok": true,
 "_docs_postback_walled": true,
 "documents": [ ← 11 rows, in file order
 {
 "file_name": "Bid_Invitation.pdf",
 "file_description": "",
 "file_url": "",
 "login_gated": false,
 "file_path": "data/ionwave/docs/garlandtx_
 REQ00002591/Bid_Invitation.pdf"
 },
 … rows 2-6: five more real PDFs, same shape …
 {
 "file_name": "178 KB",
 "file_description": "",
 "file_url": "",
 "login_gated": false,
 "_dl_err": "link not found on detail page"
 },
 … row 8 is a real PDF again, then row 9 is "492 KB" …
 {
 "file_name": "Activity Date",
 "file_description": "Activity Name",
 "file_url": "",
 "login_gated": false,
 "_dl_err": "link not found on detail page"
 },
 … row 11 is "8/4/2026 11:30:00 AM (CT)", same shape …
 ]
}`],notes:['Four of the eleven "documents" are not documents. Two are file sizes. Two are cells lifted from the question-deadline table underneath, one of them the column heading "Activity Date" with "Activity Name" as its description. The parser walked past the end of the attachment table and kept reading whatever table came next. On other bids that next table is the plan-holder list, so company names and their home towns get stored as file names too.',"The damage is not just cosmetic. Each of these rows carries a _dl_err, so it reads as a failed download. 94 of the 228 document rows carry a download error, and only 15 of those 94 name an actual file. The other 79 were never files at all. Five in six of this portal's reported document failures are phantom."],tables:[]}],notes:[],then:"one bid, one score"},{n:"7",title:"Second pass: would LGS bid this?",who:"max-bid-judge · AI (the operator writes the file)",summary:["Yes, maybe or no, with a score out of 100 and the reasoning. On 28 July this stage saw exactly one bid, because exactly one bid was newly opened and no older OPEN was waiting for a verdict.","What it was given was mostly IonWave's own boilerplate. The real scope was in the attachments, and the judge said so out loud rather than guessing."],cells:[{label:"What the judge was actually shown Bid C",paths:[],blocks:[`{
 "idx": 765,
 "bid_id": "garlandtx:REQ00002591",
 "title": "Mulching of Vegetative Debris",
 "buyer": "Garlandtx",
 "state": "TX",
 "due_date": "2026-08-11",
 "description_full": "Title: Mulching of
 Vegetative Debris\\nBuyer: Garlandtx\\nState: TX\\n
 Closes: 2026-08-11\\nSource URL: https://garlandtx.
 ionwave.net/PublicDetail.aspx?bidID=4065&SourceType=1
 \\n\\nRFP body:\\nPER CITY OF GARLAND SPECIFICATIONS\\n
 RFP – Request for Proposal Request for information and
 pricing that specifies the relative importance of price
 and other evaluation factors.\\nNO FAXED BIDS! …"
}`],notes:['Every word of that "RFP body" is submission housekeeping. Not one word about trees, mulch or acreage.'],tables:[]},{label:"judge-verdicts.json · 850 bytes, 1 row Bid C · YES, 70",paths:[],blocks:[`{
 "bid_id": "garlandtx:REQ00002591",
 "would_lgs_bid": "yes",
 "lgs_score": 70,
 "reasoning": "Title 'Mulching of Vegetative
 Debris' is a direct match to Category 6 (machine
 grinding of vegetative debris) and overlaps Category 1
 debris-reduction work; City of Garland, TX is a core
 municipal buyer type consistent with won LGS city
 contracts. The captured body is pure IonWave portal
 boilerplate (submission instructions only) with the
 real scope sitting in 11 unextracted attachments -
 per rule, a strong in-scope title with a thin body is
 not a score-down, so this stays a surfaced yes with
 the missing scope flagged for the operator rather
 than penalized.",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "scope_in_11_unextracted_attachments",
 "low_scale_inferred_no_value_stated"
 ]
}`],notes:['"11 unextracted attachments" is the judge trusting the count from stage 6. Four of those eleven were table junk; seven were real files, and all seven had already been downloaded to data/ionwave/docs/garlandtx_REQ00002591/. The flag is honest about the gap and slightly wrong about its size.'],tables:[]}],notes:[],then:"tonight's one verdict is merged with 24 carried ones"},{n:"8",title:"Write the night down",who:"run_ionwave_sweep.py publish (step 1) → platform_sweep.compile_archive",summary:["Carried decisions plus tonight's decisions, carried verdicts plus tonight's one verdict, written into a dated folder that nothing later is allowed to change. This is the durable record. Every roll-up, ledger and board downstream reads these files, not the working files in runs/.","This is also IonWave's second act of memory. The shared carry-forward step later on deliberately leaves this portal alone, because the work is already done here."],cells:[{label:"data/ionwave/daily/2026-07-28/",paths:[],blocks:[],notes:[`new-bids.json does not hold new bids. It holds all 951 snapshot rows. The name is shared across every portal in the system and means "tonight's snapshot", not "tonight's arrivals". Anyone counting rows in that file to answer "how many new bids" gets 951 instead of 37.`],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["triage.json","951 decisions, the whole board, tomorrow's memory","117,157 b"]},{header:!1,cells:["verdicts.json","25 scores, 1 new and 24 carried","24,011 b"]},{header:!1,cells:["new-bids.json","951 rows, the whole snapshot, not the 37 new ones","672,430 b"]},{header:!1,cells:["stats.json","the funnel counts","477 b"]},{header:!1,cells:["report.md","the human summary","5,722 b"]}]]},{label:"stats.json, whole file",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "ionwave",
 "engine": "ionwave",
 "endpoint": "https://<tenant>.ionwave.net/
 SourcingEvents.aspx?SourceType=1",
 "snapshot_total": 951,
 "carryover_count": 914,
 "new_to_triage": 37,
 "triage": {"open": 25, "skip": 926, "total": 951},
 "scoring": {"yes": 7, "maybe": 5, "no": 13, "total": 25},
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T18:43:25.630550+00:00"
}`,`{
 "bid_id": "lexingtoncounty:2027-RFPQ-03",
 "would_lgs_bid": "yes",
 "lgs_score": 82,
 "reasoning": "Title is a verbatim Category 4
 match — 'On-Call Tree Trimming, Removal & Stump
 Grinding Services' for a county — strong signal
 despite empty body.",
 "red_flags": ["thin_description_pull_rfp_packet"],
 "verdict": "yes",
 "score": 82,
 "primary_reason": "Title is a verbatim Category 4
 match — …"
}`],notes:["Every field appears twice under two names: would_lgs_bid and verdict, lgs_score and score. Judge agents return two different shapes, and rather than pick one, the compile step fills both so no strict reader downstream can silently lose a YES."],tables:[]}],notes:[`Two already-closed bids are on tonight's surfaced list. Bid B (closed 22 July, YES 82) and gtowntx:202632, "Hauling, Storing and Disposal Services", closed 22 July, MAYBE 40. Both are carried rows from sites that were not in tonight's third, and nothing re-checks a carried row's close date. The day's report.md prints Bid B as the top YES with "closes 2026-07-22" right next to it.`],then:"the sweep pushes its own bids to the board without waiting"},{n:"9",title:"Onto the board, early",who:"run_ionwave_sweep.py publish (step 2) · runs the shared scripts as subprocesses",summary:["Most portals wait for the shared publish step much later in the night. IonWave runs the same two scripts itself, right here, so its bids reach the board inside its own chain. The bids are upserted next to every other portal's and grouped into clusters.","They are run as separate processes on purpose: the publish script has code that runs the moment it is imported, and importing it would be destructive."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/daily/*/",size:"every archived day, not just tonight"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards total · 10 from ionwave"},{path:"supabase: bids, clusters, sweep_runs",size:"upsert"}],blocks:[],notes:["The board holds 10 IonWave cards but the night produced 7 YESs. The extra three are all viportbids emergency debris jobs, last seen in the 16 July archive and closed on 17 July. The card dump walks every archived day, so a YES that fell out of the snapshot stays on the board. That is deliberate, so the operator does not lose sight of a bid because one crawl missed it, but it means the card count and the day's YES count are different questions.","Published twice a night. The same two scripts run again board-wide at phase 2.85. Both are whole-board upserts, so nothing breaks. It is just paid for twice."],tables:[]},{label:"Bid B's board card Bid B",paths:[],blocks:[`{
 "id": "8fba80907a1a44ca",
 "portal": "ionwave",
 "portal_label": "IonWave (292 public agencies)",
 "source_bid_id": "lexingtoncounty:2027-RFPQ-03",
 "title": "On-Call Tree Trimming, Removal
 & Stump Grinding Services",
 "buyer": "Lexingtoncounty",
 "state": "",
 "solicitation_no": null,
 "federal": false,
 "score": 82,
 "verdict": "yes",
 "category": "",
 "due_date": "2026-07-22",
 "contact_name": "Linsey Hardy - Procurement Officer",
 "contact_email": null,
 "contact_phone": "(803) 785-8319",
 "red_flags": ["thin_description_pull_rfp_packet"],
 "fit_signals": [],
 "first_seen": "2026-07-12",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:[`"buyer": "Lexingtoncounty" is the site's own name with a capital letter on the front, not the county's real name. The buyer field for this whole portal is the web address, tidied up. State is blank. Both matter at the next stage, where bids are matched across portals.`],tables:[]}],notes:[],then:"go and fetch the actual file bytes"},{n:"10",title:"The documents",who:"run_ionwave_sweep.py publish (step 3) · three steps: download, upload, log in",summary:['Stage 6 learned the file names. This stage tries to get the file bytes. First the public ones are downloaded, then uploaded to shared storage, then a real LGS supplier login is used to try the ones marked "please log in to view this document". Whatever is still out of reach gets a written reason, not a blank.',"If this whole stage fails, the run does not stop. It prints a failure line and leaves the bids on the board with incomplete documents."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/docs/<bid_id>/<file>",size:"25 bid folders on disk"},{path:"supabase: bid-docs bucket + bid_documents",size:"rows + files"},{path:"supabase: bid_enrichment",size:'doc_status "gated_login" for what stayed locked'}],blocks:[],notes:["Registration is per site. The LGS supplier account has to be signed up with each of the 292 bodies separately. Where it is not, the run writes a reason instead of retrying forever. clemson is the named case in data/ionwave/PORTAL.md, and Clemson is one of tonight's seven YESs, at score 82.",'Across the 951 rows there are 228 document entries, and they split three ways with nothing left over: 92 came down to disk, 42 are marked login-gated, and 94 carry a download error. Only 15 of those 94 name an actual file; the other 79 are the table rows from stage 6 that were never attachments. All 15 real ones belong to leegov:B260231JLO, and each still carries "(please login to view this document)" inside its file name instead of the login_gated flag, so the login pass never tries them.'],tables:[]},{label:"Bid C's folder, listed off disk",paths:[],blocks:[`data/ionwave/docs/garlandtx_REQ00002591/
 9,184,729 Debris_Removal_Maps_-_05.14.2026.pdf
 504,683 Bidders_Qualification_Statement.pdf
 344,858 City_of_Garland_Terms_Conditions_…pdf
 282,751 _Notice_to_Bidders_REQ00002591.pdf
 182,604 RFP-Specifications_REQ00002591.pdf
 162,178 Bid_Invitation.pdf
 128,816 BidForm_SpringCreek_Mulching-_Bid_Form.pdf
 all 7 written 28 Jul 14:04-14:05`,`data/ionwave/docs/lexingtoncounty_2027-RFPQ-03/
 1,419,122 Terms_and_Conditions_Services_…pdf
 740,960 TREE_TRIMMING_RFPQ_4.24.26.docx.pdf
 307,507 Contract_Sample_4.18.23.doc.pdf
 147,012 Vendor_Application.pdf
 143,607 Copy_of_W9.pdf
 129,074 NON-COLLUSION_AFFIDAVIT_-_2026.pdf
 128,891 CERTIFICATE_OF_FAMILIARITY_-_REVISED.docx.pdf
 all 7 written 15 Jul 06:04`],notes:["Bid B's real specification document has been on disk since 15 July. Nothing re-fetched it on 28 July, because a bid that already has a verdict is never enriched again. Its stored contact and page text are also 13 days old."],tables:[]}],notes:['The download has no plain link. Attachment rows carry a one-time token in their address; the generated files ("Bid Invitation", "Public Question & Answer") have no address at all and no file extension. The engine sniffs the first few bytes and adds .pdf, otherwise a browser refuses to open them.'],then:"IonWave's own chain is finished, the shared machinery takes over"},{n:"11",title:"Shared carry-forward: skipped on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Other portals use a shared safety net here: if a bid fell out of tonight's pull, its old verdict is rescued so it does not vanish from the board. IonWave is not in that list. Its registry row says carry_forward: "engine-internal", and the script only touches portals whose row says "orchestrator".`,"In plain terms: IonWave already did this twice, itself. Once at stage 4 for the OPEN or SKIP decisions, once at stage 8 for the scores. Running the shared step on top would apply the same rescue a third time."],cells:[{label:"Evidence",paths:[{path:"data/portals/registry.json:544",size:'"carry_forward": "engine-internal"'},{path:"scripts/portal_registry.py:108",size:"the filter that leaves ionwave out"}],blocks:[],notes:["What it means for this portal. IonWave's memory is entirely its own. That works, and it is why 914 of 951 bids kept their decision tonight for free. It also means the one known hole, a site that returns nothing losing its carried bids, has no outside safety net to catch it. Nothing outside the engine is watching."],tables:[]}],notes:[],then:"the ledger, the report and the fixtures are rebuilt"},{n:"12",title:"Ledger, report, fixtures",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared rebuilds in a row. The running YES ledger walks every day of every portal's archive and de-duplicates by portal and bid id. The daily report is overwritten with the one layout every portal shares. The board fixtures are rebuilt, board-wide this time."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/daily/*/verdicts.json",size:"8 days of archive"},{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"data/ionwave/daily/2026-07-28/report.md",size:"5,722 bytes, rewritten"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"second run of the night"}],blocks:[],notes:[],tables:[]},{label:"Proof there are two writers of report.md",paths:[],blocks:[`stats.json generated_at
 2026-07-28T18:43:25.630550+00:00

report.md footer line
 _Standardized report · regenerated
 2026-07-28T22:37:27+00:00_`],notes:["Nearly four hours apart. The first report.md was written by the sweep at 18:43 and thrown away; the one on disk was written by the shared formatter at 22:37. If you edit the file the sweep produces, your edit does not survive the night."],tables:[]}],notes:[],then:"IonWave stops being its own board"},{n:"13",title:"Publish, cluster, de-duplicate",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py → run_enrichment_phase.py",summary:["This is where IonWave's bids sit down next to every other portal's and get grouped. The same job advertised on IonWave, on BidNet and on the state's own site should become one row for the operator, not three.","IonWave is well behaved here for one reason: its bid id is <site>:<reference number>, which is stable across nights. Portals with page-local ids cannot keep their merge decisions from one night to the next."],cells:[{label:"Bid B is the same job as seven other cards on the board (every card whose title is character-for-character Bid B's, read from PortalPro/src/fixtures/portal-bids.json)",paths:[],blocks:[],notes:["Look at what the matcher has to work with. Eight cards, five spellings of one buyer, a different id format on almost every portal, two close dates (the county re-issued) plus one card with no close date at all, and one blank state, IonWave's. IonWave brings the weakest evidence to this table: no state, a buyer name derived from a web address, and no solicitation number field filled in. It is the hardest card here to match on anything except the title.","The login hazard in this phase. The board-wide enrichment step also has an IonWave pass registered, and that pass logs into the real LGS account. IonWave already ran it at stage 10. Running this phase without --skip AUTHED logs into the account a second time in one day, which is exactly what detection discipline forbids."],tables:[[{header:!0,cells:["Portal","Its id","Buyer as that portal spells it","Score","Closes"]},{header:!1,cells:["ionwave","lexingtoncounty:2027-RFPQ-03","Lexingtoncounty","82","2026-07-22"]},{header:!1,cells:["demandstar","541522","Lexington County, SC","85","2026-07-22"]},{header:!1,cells:["scbo","67033","Lexington County","85","2026-07-22"]},{header:!1,cells:["bidnet","444086840578","Unknown South Carolina public agency","86","07/22/2026"]},{header:!1,cells:["demandstar","544211","Lexington County, SC","90","2026-08-17"]},{header:!1,cells:["scbo","67651","Lexington County","90","2026-08-17"]},{header:!1,cells:["bidprime","3ec68ab2-94c8-…","Lexington County","88","2026-08-17"]},{header:!1,cells:["napc","262535b9c271b3b1","?","88","(blank)"]}]]}],notes:[],then:"read the PDFs, turn them into requirements"},{n:"14",title:"Documents into requirements",who:"2.87 · extract_doc_text.py → build_bidpack.py → requirements-extractor → apply_requirements.py → publish_doc_gaps.py",summary:["The text is pulled out of every cluster's documents, including the IonWave PDFs from stage 10, and turned into a structured list of what the buyer is asking for, with the exact words quoted. This step also backfills blanks: buyers, close dates, solicitation numbers.","For IonWave that backfill matters more than for most portals, because so much of its board arrives with a blank state and a buyer that is really a web address."],cells:[{label:"Where the material comes from, for this portal",paths:[],blocks:[],notes:[`This is where IonWave's thin data gets rescued, or does not. A bid whose PDFs came down gets a real requirements list. A bid on a site LGS is not registered with gets an honest "we could not read it" instead of a false blank. Both are correct. But the 931 rows with no page text and no documents have nothing to extract from at all.`],tables:[[{header:!1,cells:["Real downloaded PDFs","25 bid folders under data/ionwave/docs/; Bid B's TREE_TRIMMING_RFPQ_4.24.26.docx.pdf is 740,960 bytes of actual scope"]},{header:!1,cells:["Page text","only 20 of 951 rows carry any; this is thin by construction, not by accident"]},{header:!1,cells:["Login-gated files",'42 document rows; the cluster gets a neutral "no material" requirements row rather than a blank pill on the board']}]]}],notes:[],then:"now that blanks are filled, look for duplicates again"},{n:"15",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The same duplicate check runs again, but only on the pairs that became comparable after stage 14 filled in blanks. A pair that could not be judged before, because one side had no buyer and no number, may now be an obvious match.","This second pass matters more for IonWave than for almost any other portal, for the reason the table at stage 13 shows: an IonWave card starts life with a blank state and a buyer taken from a web address. Until something fills those in, it can only be matched on its title."],cells:[{label:"In → Out",paths:[{path:"supabase: clusters + dedup_adjudications",size:"the pairs worth re-asking about"},{path:"data/portals/llm-dedup-merges.json",size:"the merges to apply"}],blocks:[],notes:["Merge decisions are durable. Because IonWave's id is stable across nights, a merge decided once stays decided. It is not re-asked and re-paid for every night."],tables:[]}],notes:[],then:"what changed, who needs telling, did it all actually run"},{n:"16",title:"Watch, mail, and the check on the whole night",who:"2.88 · watch_list_signals.py · publish_page_text.py · four email scripts · pipeline_sentinel.py",summary:["Tonight's snapshot is compared with last night's for free change markers. IonWave is the named example in that script, because its reference numbers carry an addendum number: when a buyer re-issues a bid, the number ticks up and we see it without opening anything.","Then the captured page text is pushed to the database, the operator emails are written, and one last script asks whether every phase really ran."],cells:[{label:"In → Out",paths:[{path:"data/ionwave/daily/2026-07-28/new-bids.json",size:"vs the 24 July file · addendum_no"},{path:"supabase: bid_updates, bid_page_text",size:null},{path:"data/portals/daily-watch-digest.md, daily-new-bids.md, daily-alerts.md, contracts-digest.md",size:null},{path:"data/portals/sentinel.json",size:null}],blocks:[],notes:["Three limits worth naming. The addendum watcher only reports on bids that already have a cluster, so a change on a bid we never surfaced is ignored. Page text reaches the database for 20 of 951 rows, so coverage for this portal is thin by design. And the four email scripts have no sending key. There is no resend.env in data/auth/, so the digests are written to disk and never sent."],tables:[]},{label:"The sentinel exists because of this portal",paths:[],blocks:[],notes:["Rows copied from data/ionwave/daily/INDEX.md. On 11 July the crawl pulled 903 bids and then nothing else ran. No triage, no judging, no board. Those 903 only became an archive on 12 July. The sentinel now checks every portal's stats for a pull with no triage. IonWave is the reason that check exists.","It also has to read the bids table directly for this portal, because IonWave has no field-coverage row and would otherwise look like it had never published anything."],tables:[[{header:!0,cells:["Date","Snapshot","New","Open","Yes"]},{header:!1,cells:["2026-07-12","903","903","20","6"]},{header:!1,cells:["2026-07-13","911","38","22","6"]},{header:!1,cells:["2026-07-24","961","27","24","6"]},{header:!1,cells:["2026-07-28","951","37","25","7"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","What it costs"]},{header:!1,cells:["One shared gate in front of all 292 sites, counting per network address","more workers returns zero bids, not more bids. One worker, 12-18 second pauses, 30-45 minutes for a third of the board. There is no faster setting that works."]},{header:!1,cells:["Only a third of the sites are visited a night; the rest are carried untouched","a carried bid's close date is never re-checked. 127 of the 951 rows on 28 July had already closed, all 127 carried. Two of them were on the surfaced list, including the day's top YES."]},{header:!1,cells:[`The stitch keeps "every bid whose site is not in tonight's third"`,`a site that IS in tonight's third but gets throttled returns nothing, so its earlier bids are dropped from both lists. When its turn comes round up to 3 days later the bid is "new" again and gets re-triaged and re-judged from scratch. Nothing gates on the throttled count.`]},{header:!1,cells:["bids/index.json says snapshot_total: 316","that is tonight's third, not the board. all-bids.json ends the run at 951 and index.json is never updated. Quote the wrong one and you under-report the portal by two thirds."]},{header:!1,cells:["daily/<date>/new-bids.json holds 951 rows, not 37",`the name means "tonight's snapshot" everywhere in this system. Counting its rows to answer "how many new bids" is off by 914.`]},{header:!1,cells:["272 of the 292 sites have a blank state in tenants.json",'893 of 951 bids carry no state. The judge is literally told "State: (unknown)", and the duplicate matcher gets a blank column on every IonWave card.']},{header:!1,cells:["The buyer field is the web address, tidied up",'"Lexingtoncounty", not "Lexington County, SC". Seven other cards on five other portals spell the same buyer four other ways. IonWave brings the weakest matching evidence to the cross-portal join.']},{header:!1,cells:["The document-table parser runs past the end of the table",`94 of the 228 document rows carry a download error and only 15 of them name an actual file. The other 79 are table rows stored as attachments: 27 plan-holder company names, 24 schedule dates, 14 column headings such as "Activity Date", 7 status cells and 7 file sizes such as "178 KB". They land on 11 bids. Bid C's "11 attachments" were really 7, and the judge quoted the wrong number back in a red flag. Five in six of this portal's reported document failures are phantom.`]},{header:!1,cells:["Detail pages are only opened for OPEN bids that still need a verdict","20 of 951 rows carry page text, contact or documents; 17 carry a description. Once a bid is judged it is never enriched again, even though its deep link is known. Bid B's stored contact and PDFs are from 15 July."]},{header:!1,cells:["Document bytes are walled two ways","42 document rows are marked login-gated; the LGS supplier account must register with each of the 292 bodies separately. clemson is unregistered and is one of tonight's YESs."]},{header:!1,cells:["Five scratch files in runs/ are two weeks old","_triage_batch_1/2, _triage_verdicts_batch_1/2 and _judge_verdicts_batch_1 all date from 13 July. Seven dated tenant caches are also never pruned. The model doc says six, disk says seven."]},{header:!1,cells:["Published to the board twice a night","once inside this portal's own chain at phase 1.95, once board-wide at 2.85. Both are whole-board upserts, so it is safe and wasteful. The authed document pass is registered twice the same way, and that one is not safe to run twice."]},{header:!1,cells:["The registry row is stale in two fields","it says authed: false and enrich_passes: [], but scripts/enrichers.py:65-66 registers an IonWave pass that logs into a real LGS account. The crawl and the detail page genuinely need no login; only the last document step does."]},{header:!1,cells:["Three docs still call this portal standalone",'the IonWave sweep skill, data/ionwave/config.json and data/ionwave/PORTAL.md all say it runs on its own. The registry says batch: "portals" and it runs inside /portals. PORTAL.md is also an unfinished draft with TODO field rows and a stale "0% document coverage" figure.']},{header:!1,cells:["The model doc predates the re-judge code","docs/portal-dataflow/ionwave.md describes stage 6 as picking bids that still need a verdict. The code also re-queues already-judged bids when the close date is extended, a real description arrives, or the addendum number moves. Nothing was re-queued on 28 July, so the numbers still line up, but the map is behind the ground."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/ionwave/daily/2026-07-28/stats.json, a row count in docs/portal-dataflow/pedia-inspect/ionwave.json, or a file opened and counted directly. Nothing on this page is an example. Baseline map: docs/portal-dataflow/ionwave.md (evidence-cited to file:line). Where it disagrees with the files, the files won and the disagreement is named above. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/ionwave/daily/2026-07-28/stats.json, a row count in docs/portal-dataflow/pedia-inspect/ionwave.json, or a file opened and counted directly. Nothing on this page is an example. Baseline map: docs/portal-dataflow/ionwave.md (evidence-cited to file:line). Where it disagrees with the files, the files won and the disagreement is named above. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar).",c="docs/portal-dataflow/pedia-ionwave.html",u={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:d,sections:l,footer:h,source_page:c};export{u as default,a as eyebrow,h as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
