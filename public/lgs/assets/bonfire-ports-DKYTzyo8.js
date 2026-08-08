const e="bonfire-ports",t="Bonfire (Ports): what happens to a bid, stage by stage",s="Portal pedia · 09",a="Bonfire (Ports): the night nothing survived",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. On this run the portal pulled 40 open bids, sent 16 brand-new ones to the triage AI, and the AI threw out all 16. Nobody was scored. The single NO you see in the counts was decided eight days earlier and copied forward.",o=[{value:"40",label:"in snapshot"},{value:"24",label:"carryover"},{value:"16",label:"new to triage"},{value:"1",label:"triage says open"},{value:"39",label:"triage says skip"},{value:"0",label:"yes"},{value:"0",label:"maybe"},{value:"1",label:"no"}],r="All eight numbers come from data/bonfire-ports/daily/2026-07-28/stats.json (415 bytes). Two of them need a warning label. The 1 OPEN and 39 SKIP are counted over all 40 bids, not over the 16 new ones: the OPEN is broward-224780, and it arrives in runs/triage-carryover.json, meaning that decision was made on an earlier run. All 16 genuinely new bids are SKIP in runs/triage-verdicts.json (1,530 bytes, 16 rows). The 1 NO was not judged on this run either: runs/judge-input-open.json and runs/judge-verdicts.json are both 2 bytes, an empty list, so Pass 2 never ran. daily/2026-07-28/verdicts.json is byte-for-byte identical to daily/2026-07-20/verdicts.json, 693 bytes both. The whole AI bill for the night was 16 titles read.",i=["Bid A · broward-246235 · Asphalt Transportation Trailer, Broward County FL. New tonight, dies at triage.","Bid B · broward-224780 · Drainage and Sewer Infrastructure Maintenance, Broward County FL. The only OPEN, already judged NO on 20 July, so tonight it just rides along.","No third bid. Nothing reached YES or MAYBE on this run."],l=[{n:"0",title:"Is this portal even due today?",who:"scripts/portal_due.py --batch portals → Agent(general-purpose)",summary:["This is a weekly portal, not a nightly one. The gate looks at the newest folder under data/bonfire-ports/daily/. If it is 7 or more days old the slug is printed as due and the orchestrator hands the whole sweep to one child agent in Batch D. On every other day nothing runs and that is correct.","The 7 comes from data/portals/registry.json, but Supabase can override it, so an edit on the operator board changes the run day with no code change."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:'cadence_days 7 · batch "portals"'},{path:"data/bonfire-ports/daily/",size:"31 day folders, newest 2026-07-28"}],blocks:[],notes:["Previous folder is 2026-07-20. Eight days, so it was due."],tables:[]},{label:"The registry row this portal runs on",paths:[],blocks:[`{
 "slug": "bonfire-ports",
 "label": "Bonfire (Ports)",
 "engine": "bonfire",
 "batch": "portals",
 "cadence_days": 7,
 "authed": false,
 "enrich_passes": ["bonfire-ports c+d"],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:[],tables:[]}],notes:[],then:"one plain web call per tenant, no login and no browser"},{n:"1",title:"Pull the open list",who:"data/bonfire-ports/scripts/run_daily.py → engines/bonfire.py",summary:["Two tenants, two calls. DFW Airport gave 14 open bids, Broward County gave 26, total 40. Anything already past its close date is dropped on the spot.",`The description is always empty here. The Bonfire detail page sits behind a Cloudflare challenge, so a plain request gets a holding page instead of the notice. Across all 40 rows in tonight's snapshot, description is "" and _detail_ok is false. Forty out of forty. The pull is list only.`],cells:[{label:"In → Out",paths:[{path:"data/bonfire-ports/config.json",size:"2 tenants: dfwairport, broward"},{path:"https://<tenant>.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",size:null},{path:"data/bonfire-ports/bids/all-bids.json",size:"20,454 bytes · 40 rows · 13 fields"},{path:"data/bonfire-ports/bids/index.json",size:"381 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T20:37:01.778981+00:00",
 "snapshot_total": 40,
 "source": "bonfire-ports",
 "engine": "bonfire",
 "endpoint": "/PublicPortal/
 getOpenPublicOpportunitiesSectionData",
 "tenants_configured": 2,
 "tenants_with_bids": 2,
 "tenants_skipped": [],
 "per_tenant_open": {"dfwairport": 14, "broward": 26},
 "open_total": 40
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "broward-246235",
 "ref_number": "WWOD0727261000",
 "title": "Purchase and Delivery of Asphalt
 Transportation Trailer",
 "buyer": "Broward County (incl. Port Everglades)",
 "agency": "Public Works - Water & Wastewater
 Operations",
 "status": "open",
 "due_date": "2026-07-29",
 "due_date_raw": "2026-07-29 18:00:00",
 "posting_date": null,
 "state": "FL",
 "detail_url": "https://broward.bonfirehub.com/
 opportunities/246235",
 "description": "",
 "_detail_ok": false
}`],notes:["The id is <subdomain>-<ProjectID>. Rename a tenant subdomain in config.json and every bid gets a new key, so the whole board would look brand new the next morning."],tables:[]}],notes:["The universe here is two tenants wide, on purpose. Georgia Ports Authority is not on Bonfire at all, it runs SAP Ariba. Port Everglades has no subdomain of its own, it rides Broward County's. Both facts are written down in data/bonfire-ports/config.json. Bonfire's real universe is only reachable through the separate logged-in bonfire-pro path, which you meet at stage 7: on this very same night that sweep saw 2,626 open opportunities (data/bonfire-pro/daily/2026-07-28/stats.json), against these 40."],then:"tonight's ids are compared against the last archive"},{n:"2",title:"Split old from new",who:"run_daily.py step 2 → platform_sweep.prep",summary:["Tonight's 40 ids are checked against the 34 ids in the 20 July archive. 24 are old and keep the decision they already had. 16 are new and go to the AI. The other 10 of that older 34 are simply gone, closed or withdrawn between the two runs. That last number is 34 minus 24. No file records it.","Every bid also gets a text blob prepared for the judge. Because the descriptions are empty, that blob is the title, buyer, state, close date and link, followed by an empty RFP body."],cells:[{label:"Out",paths:[{path:"runs/triage-input.json",size:"3,758 bytes · 16 rows"},{path:"runs/triage-carryover.json",size:"3,384 bytes · 24 rows"},{path:"runs/judge-input.json",size:"22,965 bytes · 40 rows"},{path:"runs/_funnel.json",size:"153 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 40,
 "carryover_count": 24,
 "triage_input_count": 16,
 "prior_archive_ids_compared_against": 34
}`],notes:[],tables:[]},{label:"Real record Bid A · triage-input.json row 0",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "broward-246235",
 "title": "Purchase and Delivery of Asphalt
 Transportation Trailer",
 "buyer": "Broward County (incl. Port Everglades)",
 "state": "FL",
 "due_date": "2026-07-29"
}`,`{
 "idx": 28,
 "bid_id": "broward-224780",
 "title": "Drainage and Sewer Infrastructure
 Maintenance",
 "buyer": "Broward County (incl. Port Everglades)",
 "state": "FL",
 "due_date": "2026-08-07",
 "detail_url": "https://broward.bonfirehub.com/
 opportunities/224780",
 "description_full": "Title: Drainage and Sewer
 Infrastructure Maintenance\\nBuyer: Broward
 County (incl. Port Everglades)\\nState: FL\\n
 Closes: 2026-08-07\\nSource URL: https://…\\n\\n
 RFP body (truncated to 6KB):\\n"
}`],notes:["Read the last line. The RFP body header is there and then the string stops. That is the whole scope the judge would ever see."],tables:[]}],notes:["Two ways this step goes quietly wrong. The lookup for the previous archive includes today, so running the sweep twice on the same day compares tonight against tonight and finds zero new bids. And if the previous triage.json cannot be read, the code returns an empty map and every bid looks new, which silently re-triages the whole board at full cost. Both are in the code at open folders/_lib/platform_sweep.py:51-56 and :67-71."],then:"16 titles go to the triage AI"},{n:"3",title:"Pass 1: keep or bin, on the title alone",who:"max-triage · AI writes runs/triage-verdicts.json",summary:["An agent reads four fields per bid: title, buyer, state, close date. There is nothing else to read. Default answer is SKIP. OPEN only if the title names work LGS actually does, such as tree, debris, vegetation, right of way, clearing, mowing, brush, stump, storm or ditch.","Tonight all 16 came back SKIP. Not one new bid was worth a second look. Look at what this one airport and one county were buying: a trailer, window shades, election services, transducer parts, cloud software, an HR platform, psychological evaluations, bird abatement. This is a procurement board for one airport and one county, and most of what it posts is nowhere near a vegetation contract."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"16 rows"},{path:"runs/triage-verdicts.json",size:"1,530 bytes · 16 rows · all SKIP"}],blocks:[`asphalt trailer, equipment purchase
window shades, commodity
election services, non-fit
structure build, no LGS verb
transducer parts, commodity
brand-name IT hardware
financial data subscription
cloud software, SaaS
server hardware refresh, IT
media training, professional services
glass replacement, building work
bird abatement, pest control
HR platform, software
training platform, software
psych evaluations, personnel services
air quality testing, wrong vertical`],notes:["No python script writes this file. An agent does. A missed row would be a silent hole, and nothing checks for it."],tables:[]},{label:"Real record Bid A · binned",paths:[],blocks:[`{
 "bid_id": "broward-246235",
 "decision": "SKIP",
 "reason": "asphalt trailer, equipment purchase"
}`,`{
 "bid_id": "broward-224780",
 "decision": "OPEN",
 "reason": "Drainage Infrastructure Maintenance
 matches the drainage/ditch/channel OPEN
 trigger; could include open-channel/ditch
 vegetation clearing - promote to Pass 2 for
 full-scope judgment"
}`],notes:["Bid A's journey ends here. Pulled, diffed, one title read. That is its total cost.","This row is from runs/triage-carryover.json, not from tonight's AI call. It is the only non-SKIP row in that file, and it is the whole reason the funnel shows 1 OPEN."],tables:[]}],notes:[],then:"the step that is supposed to fetch the scope"},{n:"4",title:"The enrichment that never happens, and the empty shortlist",who:"ps.enrich_opens(...) then ps.build_judge_input_open(...)",summary:['The sweep instructions tell the child agent to enrich the OPEN bids before judging them. The shared code asks the bonfire engine for a detail fetcher. The bonfire engine does not define one. The call returns 0 and nothing is fetched. The description stays empty right through the judge. This is the honest answer to "why does the judge never see a scope for this portal."',"Then the shortlist is built: today's new OPENs, plus any carried-over OPEN that was never judged, minus anything already judged on a previous day. Bid B is the only OPEN, and it was judged on 20 July, so it is dropped. The shortlist comes out empty."],cells:[{label:"Out of the enrichment call",paths:[{path:"nothing",size:"the callable is absent, the function returns 0"}],blocks:[],notes:["The sweep skill lists this as its Phase 4. On this engine it is words on a page, not code that runs."],tables:[]},{label:"Out of the shortlist builder",paths:[{path:"runs/judge-input-open.json",size:"2 bytes · 0 rows"}],blocks:["[]"],notes:["Two bytes. That is the file the judge is meant to read."],tables:[]}],notes:[],then:"the judge is handed an empty list"},{n:"5",title:"Pass 2: did not run",who:"max-bid-judge · AI writes runs/judge-verdicts.json",summary:["With nothing on the shortlist, there is nothing to score. Both files are two bytes, an empty list. No YES, no MAYBE, no NO was produced on 28 July.",`This is not a failure. It is what a correct run looks like when the only OPEN bid on the board was already answered. But it does mean the "1 NO" in the day's counts is a fossil, and anyone quoting it as tonight's work is wrong.`],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"2 bytes · 0 rows"},{path:"runs/judge-verdicts.json",size:"2 bytes · 0 rows"}],blocks:[],notes:["What Pass 2 sees when it does run here. The description is always blank, so the judge is scoring a title and a buyer name. That is exactly why the one live verdict on this portal carries the flag thin_description_login_gated."],tables:[]},{label:"The verdict that already existed Bid B · judged 2026-07-20",paths:[],blocks:[`{
 "bid_id": "broward-224780",
 "title": "Drainage and Sewer Infrastructure
 Maintenance",
 "buyer": "Broward County (incl. Port
 Everglades), FL",
 "state": "FL",
 "would_lgs_bid": "no",
 "score": 12,
 "category": "non-fit",
 "primary_reason": "Sewer and drainage
 infrastructure maintenance is civil/utility
 pipe work - LGS clears vegetation and removes
 debris; it does not maintain stormwater pipes,
 manholes, or sewer lines, and no historical
 win comes close to this vertical.",
 "red_flags": [
 "wrong_vertical_civil_infrastructure",
 "thin_description_login_gated",
 "sewer_scope_not_lgs_trade"
 ],
 "verdict": "no"
}`],notes:["Read from daily/2026-07-20/verdicts.json. The 28 July file holds the same 693 bytes."],tables:[]}],notes:[],then:"the day folder is written, and it becomes tomorrow's memory"},{n:"6",title:"Write the archive",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover decisions and tonight's decisions are merged into one triage file of 40 rows. Every still-live verdict from the previous day is carried into today's verdicts file, but only if the bid is still in tonight's snapshot. Then the counts are written and one row is added to the archive index.","Note the file names. new-bids.json is not the night's new bids. It is the full 40-row snapshot, identical in size to bids/all-bids.json at 20,454 bytes. The name is a house convention across every portal and it misleads on sight."],cells:[{label:"data/bonfire-ports/daily/2026-07-28/",paths:[],blocks:[`| date | snap | new | open | yes | maybe | no |
| 2026-07-28 | 40 | 16 | 1 | 0 | 0 | 1 |
| 2026-07-20 | 34 | 8 | 1 | 0 | 0 | 1 |
| 2026-07-13 | 38 | 5 | 1 | 0 | 0 | 1 |
| 2026-07-12 | 35 | 0 | 1 | 0 | 0 | 1 |
| 2026-07-10 | 35 | 1 | 1 | 0 | 0 | 1 |
| 2026-07-09 | 39 | 0 | 2 | 1 | 0 | 1 |
| 2026-07-08 | 41 | 2 | 3 | 2 | 0 | 1 |`],notes:["Five runs in a row with zero YES. The last YES on this portal's own archive was 9 July 2026."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","the full 40-row snapshot, not new bids","20,454 B"]},{header:!1,cells:["triage.json","40 decisions: 1 OPEN, 39 SKIP","5,247 B"]},{header:!1,cells:["verdicts.json","1 row, carried from 20 July","693 B"]},{header:!1,cells:["stats.json","the funnel counts","415 B"]},{header:!1,cells:["report.md","the human summary","387 B"]}]]},{label:"stats.json, whole file",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "bonfire-ports",
 "engine": "bonfire",
 "endpoint": "",
 "snapshot_total": 40,
 "carryover_count": 24,
 "new_to_triage": 16,
 "triage": {"open": 1, "skip": 39, "total": 40},
 "scoring": {"yes": 0, "maybe": 0, "no": 1, "total": 1},
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T20:39:17.982229+00:00"
}`],notes:[`"endpoint": "" is a bug with a visible symptom. The compile step reads a config key called entity_url, but this portal's config uses tenants instead, so the endpoint never lands. That empty string is then printed as the Source line of the report at stage 9, which comes out blank.`],tables:[]}],notes:[],then:"a second, different sweep also lives in this folder"},{n:"7",title:"The lodger in runs/extended/",who:"the /bonfire-pro skill · Batch H · a different slug",summary:["A completely separate logged-in sweep, portal key bonfire-pro, drops all of its working files inside this portal's folder, at data/bonfire-ports/runs/extended/. Its own daily archive goes to data/bonfire-pro/daily/, not here. Nothing in the bonfire-ports sweep reads those files.","Nothing except one thing, and that one thing matters."],cells:[{label:"What is actually in there",paths:[{path:"runs/extended/all-mapped-2026-07-28.json",size:"3,436,525 bytes"},{path:"runs/extended/agencies-2026-06-20.json",size:"180,950 bytes"}],blocks:[],notes:["Twenty two all-mapped-*.json files, roughly 3.4 MB each, one per bonfire-pro run since 20 June. The folder holds 221 files and 211,451,779 bytes, about 211 MB. That dwarfs this portal's own 20 KB snapshot by four orders of magnitude."],tables:[]},{label:"Why you must not tidy this folder",paths:[],blocks:[],notes:["One shared script reaches in here by path. scripts/page_text_public_capture.py:90 globs data/bonfire-ports/runs/extended/all-mapped-*.json to turn a Bonfire project id into a public web address. If somebody ever moved bonfire-pro's files to data/bonfire-pro/runs/, where they logically belong, the Bonfire page text capture would quietly lose its lookup and stop producing text. It would not crash. It would just go blank.",'Three files in there have no writer anywhere in the repo: doc-targets-2026-06-20.json, docprobe-2026-07-23.json and docprobe-authed-2026-07-23.json. A repo-wide search for "docprobe" hits only three documentation files and not a single script. They look hand made during the July document debugging.'],tables:[]}],notes:[],then:"the portal's own night is over, the shared machinery starts"},{n:"8",title:"Carry forward: this portal is not in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`The registry says carry_forward: "engine-internal". The shared script only touches portals whose value is "orchestrator", so it never sees this slug. That is deliberate. The engine already merged yesterday's decisions at stage 6, and running the shared version too would apply the same merge twice.`,"You can see the skip on disk: there is no daily/2026-07-28/_carryforward_audit.json. The model lists that file as an output of this stage. Its absence is the confirmation, not a gap."],cells:[{label:"The one real difference between the two versions",paths:[],blocks:[],notes:["The two YES bids that vanished from the archive but not from the board. On 8 July this portal's index shows 2 YES. On 9 July it shows 1. On 10 July it shows 0, and it has shown 0 on every run since. The two bids are broward-221837 (FEMA Debris Clearing and Removal Services DCRS, due 2026-07-09) and broward-221835 (FEMA Temporary Debris Management Site (TDMS) Services, due 2026-07-10). Their close dates passed, so the pull stopped returning them, so the compile step's verdict merge filtered them out. That much is visible in the files. And yet both are still on the operator's board today. The fixture at PortalPro/src/fixtures/portal-bids.json holds exactly 2 bonfire-ports rows and they are those two, with last_seen 2026-07-08 and 2026-07-09. Per the model, the reason is that scripts/dump_yes_for_portalpro.py walks every day folder and keeps every bid ever judged YES. The portal's own archive has forgotten them. The board has not.","The shared script keeps a verdict alive after the bid leaves the snapshot and stamps it _in_today_snapshot: false. The engine version drops it the moment the bid is gone. Engine-internal is the stricter of the two, and on this portal you can watch that strictness happen."],tables:[]}],notes:[],then:"ledger, report, board cards"},{n:"9",title:"The all-time ledger, the rewritten report, the board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The ledger walks every day folder of every portal and rebuilds one all-time YES list. The report step throws away the engine's compact summary and re-renders it the same way for every portal. The fixture step flattens every bid ever judged YES into one card each, and that file is what the database publisher reads."],cells:[{label:"report.md after the rewrite · whole file, 387 bytes · last line wrapped to fit",paths:[],blocks:[`# Bonfire (ports & airports) — 2026-07-28

**Source:** · engine \`bonfire\` · state multi

- Snapshot: **40** open bids
- Carryover: 24 · NEW today: 16
- Triage: 1 OPEN / 39 SKIP
- Scored: **0 YES / 0 MAYBE / 1 NO**

## YES — Max would bid

_none_

## MAYBE — operator judgment

_none_

---
_Standardized report · regenerated
 2026-07-28T22:37:25+00:00_`],notes:["The Source line is blank. That is the empty endpoint from stage 6 showing through. The real address only ever survives in bids/index.json."],tables:[]},{label:"Real board card, one of this portal's 2 rows in the fixture",paths:[],blocks:[`{
 "id": "49d13bc99abdb550",
 "portal": "bonfire-ports",
 "source_bid_id": "broward-221837",
 "title": "FEMA Debris Clearing and Removal
 Services DCRS",
 "buyer": "Broward County (incl. Port Everglades)",
 "state": "FL",
 "solicitation_no": null,
 "federal": true,
 "score": 90,
 "verdict": "yes",
 "category": "Category 1 - Disaster/Storm Debris
 Removal",
 "description": "Verbatim disaster debris clearing
 and removal for a county — this is the heart
 of our business; the Bonfire page only shows
 metadata so pull the RFP packet…",
 "due_date": "2026-07-09",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": ["thin_description_pull_rfp_packet",
 "federal"],
 "first_seen": "2026-06-13",
 "last_seen": "2026-07-08",
 "has_documents": false
}`],notes:["Three things are wrong on this card and all three are field-name traps, listed in the quirks table below: solicitation_no is null while the snapshot holds ref_number, the contact fields are null, and the description is byte-for-byte the same string as ai_reasoning. The operator is reading the AI's opinion, not the notice."],tables:[]}],notes:["Why federal: true. Any verdict carrying a red flag of federal makes the card federal on the board. Both bonfire-ports rows are tagged that way, from the judge's own flags. Federal bids are surfaced and tagged, never banned."],then:"the bid stops being portal shaped"},{n:"10",title:"Onto the shared board, then fill what the pull could not",who:"2.85 · publish_to_supabase.py + llm_dedup + bonfire_enrich.py + page_text_public_capture.py",summary:["Every YES row is upserted into one shared bids table and grouped with every other portal's bids that share a normalized title and state. Then two enrichment passes run. One is this portal's own: it opens the Bonfire page with a Cloudflare-solving fetcher, pulls the named contact and the Scope of Work out of the page text, and patches them onto the database row. The other is a shared pass that saves the whole public page text per cluster.","The enrichment writes to the database only. It never writes back to bids/all-bids.json. That is why the runbook can claim 100% contact coverage while the snapshot on disk shows zero. Both are true, at different layers, and nothing says so."],cells:[{label:"What lands where",paths:[],blocks:[],notes:['Three ways the Cloudflare pass gives up quietly: a page still showing the holding message is skipped and never retried; the contact pattern needs a literal "Contact Information: Name, email" shape or it falls back to the first ordinary-looking email on the page; and the description only ever grows, because the patch keeps whichever of old and new is longer.'],tables:[[{header:!0,cells:["Table","What is written"]},{header:!1,cells:["bids","upsert on portal key plus source bid id"]},{header:!1,cells:["bids.cluster_id","the cross-portal grouping"]},{header:!1,cells:["bids (patch)","contact_name, contact_email, description from the Cloudflare pass"]},{header:!1,cells:["bid_page_text","the public page text, per cluster"]},{header:!1,cells:["portals, sweep_runs, clusters","run bookkeeping"]},{header:!1,cells:["bid_documents","never for this portal"]}]]},{label:"The duplicate this stage cannot fix",paths:[],blocks:[],notes:[`The same Bonfire opportunity is on the board six times, from four different sources. "FEMA Debris Clearing and Removal Services DCRS" appears as bonfire-ports (due 2026-07-09, buyer "Broward County (incl. Port Everglades)"), as bidnet (due 06/30/2026, buyer blank), as bonfire-pro (due 2026-06-30, buyer "BPRO Electronic Procurement System") and as three napc rows. The automatic matcher refuses every pair: the blank-buyer bidnet row falls through to the date test and the dates differ, and bonfire-pro has both a different buyer and a different date, so it fails both tests. bonfire-pro's buyer is the string "BPRO Electronic Procurement System". That is the name of the software, not the name of an agency. On its own it blocks the buyer test against every other source. The bonfire-ports and bonfire-pro pair is the clearest same-source duplicate in the whole system, and only a human-confirmed AI merge can join them.`,"The overlap sheet, generated 2026-07-24 and so a few days before this run, records one pair for this portal: bonfire-ports and demandstar share 9 normalized titles."],tables:[]}],notes:[],then:"read the pack, write the requirements, try the merge again"},{n:"11",title:"Requirements from page text alone, then a second try at merging",who:"2.87 requirements extraction · 2.875 second dedup pass",summary:[`Normally this stage reads the bid's documents. This portal has none. The attachments sit under a Supporting Documentation section that needs a Bonfire member login, and they have never been pulled on this slug. Document coverage is zero and always has been. So its clusters ride on the page text captured at stage 10, or they get a neutral no-material row so the board never shows "not extracted yet".`,"Then dedup runs a second time. The contact and the real scope have just been filled in, and the requirements pass may have corrected a close date. That changes which pairs are comparable. This is the pass most likely to finally join bonfire-ports to its bonfire-pro twin, if a date gets fixed."],cells:[{label:"Out",paths:[{path:"data/portals/requirements-manifest.json · requirements-output.json",size:null},{path:"supabase bid_requirements + bid_enrichment",size:null},{path:"data/portals/llm-dedup-candidates.json",size:"the second-pass residue"}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"12",title:"The tail",who:"2.88 watch + digests + sentinel · 2.89 bid packs · 2.9 / 2.95 operator boards",summary:["Change detection, the emails, the run health check, the per-bid markdown packs, and the boards the operator actually looks at. Most of it applies to this portal with one or two caveats each."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Step","What it does for bonfire-ports"]},{header:!1,cells:["Watch v2 source re-capture",'Off. The registry says watch: "none". It runs for the sibling slug bonfire-pro instead, on the very same pages.']},{header:!1,cells:["List-level change signals","diffs tonight's snapshot against the last one"]},{header:!1,cells:["New-bid, watch and contract digests","written to data/portals/*.md, but sending is a silent no-op until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel","checks the portal finished each phase, writes data/portals/sentinel.json"]},{header:!1,cells:["Bid packs (2.89)","a bonfire-ports bid contributes page-bonfire-ports.md and no docs folder, because it has no captured documents"]},{header:!1,cells:["Monitor board (2.9)",'state for this slug is hardcoded "multi", and "multi" is not in the core-state list, so every bonfire-ports row is tagged out of core even though Broward is FL and DFW is TX']},{header:!1,cells:["Overview page (2.95)","built daily while this portal runs weekly, so on six days out of seven it shows as stale or not run, which looks like a failure and is not"]},{header:!1,cells:["Scorecard (4.99)","reads the database, not this portal's stats file"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","What it costs","Seen where"]},{header:!1,cells:["solicitation_no is null on both board cards","The snapshot carries the real number in a field called ref_number (WWOD0727261000, BLD2131859B1). The fixture builder copies solicitation_no off the verdict row, and a verdict row for this portal has no such field, so the card lands null. The second dedup key, the one that matches on normalized solicitation number plus state, can therefore never fire for this portal.","scripts/dump_yes_for_portalpro.py:391; the key at scripts/publish_to_supabase.py:252-254; fixture vs bids/all-bids.json"]},{header:!1,cells:["The card's description is the AI's reasoning","On both rows description is byte-identical to ai_reasoning. The operator reads a judgement and thinks it is the notice. It happens because the day folder holds no scope text at all.","checked on both fixture rows"]},{header:!1,cells:["Contact is null on disk and 100% on the runbook","Both are true at different layers. The Cloudflare pass patches the database directly and never writes back to the snapshot. Nothing on the runbook page says which layer it is quoting.","PORTAL.md health snapshot vs bids/all-bids.json"]},{header:!1,cells:["PORTAL.md models the wrong pipeline",'Its "the files that actually exist" list names only the eight bonfire-pro extended/ scripts. It never mentions run_daily.py or the bonfire engine, which is what this slug actually runs. Anyone reading it would build the wrong mental model. It is still marked DRAFT from 14 July.',"data/bonfire-ports/PORTAL.md:32-40"]},{header:!1,cells:["0 of 40 descriptions, 0 of 40 _detail_ok","The detail page is Cloudflare-challenged, so the pull is list only and the judge scores a title and a buyer name. Every verdict this portal produces carries thin_description_login_gated.","counted across bids/all-bids.json"]},{header:!1,cells:["stats.json.endpoint is always empty","The compile step looks for a config key named entity_url; this config uses tenants. The report's Source line prints blank every single run. The real address survives only in bids/index.json.","stats.json and report.md of 2026-07-28"]},{header:!1,cells:["new-bids.json is not the new bids","It is the full 40-row snapshot, same 20,454 bytes as bids/all-bids.json. A house-wide naming convention that misleads on sight.","byte sizes in the inspect file"]},{header:!1,cells:["Documents: zero, forever, by design of the site","Attachments need a Bonfire member login. Never pulled on this slug. Every cluster here rides on page text alone.","data/bonfire-ports/README.md:20"]},{header:!1,cells:["The universe is two tenants","Georgia Ports Authority is on SAP Ariba, not Bonfire. Port Everglades has no subdomain of its own. The real Bonfire universe — 2,626 open opportunities on this same night — is only reachable through the logged-in bonfire-pro path.","data/bonfire-ports/config.json notes"]},{header:!1,cells:["bid_id = subdomain plus project id","Rename a tenant subdomain in the config and every bid is re-keyed. The next run would treat the entire board as new, re-triage everything and re-publish it.","engines/bonfire.py, id shape visible on every row"]},{header:!1,cells:["A same-day re-run finds nothing new","The previous-archive lookup includes today, so the second run of a day compares today against itself. And if the previous triage file cannot be read, the code returns empty and every bid looks new, a silent full re-triage at full cost.","open folders/_lib/platform_sweep.py:51-56 and :67-71"]},{header:!1,cells:["The sweep skill promises an enrichment that does not exist","Phase 4 tells the child agent to enrich the OPENs. The bonfire engine defines no detail fetcher, so the call returns 0 every time. The skill reads as if scope arrives in-sweep. It does not.","stage 4 above; open folders/_lib/platform_sweep.py:144-146, and engines/bonfire.py defines only pull"]},{header:!1,cells:["The board still shows two YES bids that closed in early July","The engine's own carry-forward dropped them the moment they left the snapshot, so the archive shows 0 YES since 10 July. The fixture builder walks every day folder and keeps every bid ever judged YES, so they stay on the operator's board with close dates of 9 and 10 July.","archive INDEX.md vs the 2 fixture rows"]},{header:!1,cells:["Another sweep's 211 MB of files live in this portal's folder","Tidying them into data/bonfire-pro/runs/ would silently break the Bonfire page-text capture, which globs that exact path for its project-id lookup. Three of those files have no writer in the repo at all.","page_text_public_capture.py:90; folder listing"]},{header:!1,cells:["The monitor tags every row out of core",'State for this slug is hardcoded "multi", and "multi" is not in the core-state list, even though Broward is FL and DFW is TX.',"build_portal_metrics.py:42"]},{header:!1,cells:["The registry understates what touches this portal",'enrich_passes lists only "bonfire-ports c+d", but the shared page-text capture names bonfire-ports explicitly as a global pass. Open question: is the registry field meant to list global passes at all?',"page_text_public_capture.py:47"]},{header:!1,cells:["The model doc's enrichment stage lists an output that never happens",'It shows bids/all-bids.json as an output of the Cloudflare pass, marked "no code evidence". The disk agrees it is spurious: 0 of 40 descriptions and 0 of 40 _detail_ok after every run to date.',"docs/portal-dataflow/bonfire-ports.md stage 16"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every JSON record above was read from the named file on disk, never typed as an example; every count traces to daily/2026-07-28/stats.json, runs/_funnel.json, bids/index.json, a row count or a byte size in docs/portal-dataflow/pedia-inspect/bonfire-ports.json. Long strings are cut with a trailing ellipsis, never reworded. Baseline map: docs/portal-dataflow/bonfire-ports.md, evidence-cited to file and line, but written against the 20 July run and therefore one run behind on every number. Companion pages: Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every JSON record above was read from the named file on disk, never typed as an example; every count traces to daily/2026-07-28/stats.json, runs/_funnel.json, bids/index.json, a row count or a byte size in docs/portal-dataflow/pedia-inspect/bonfire-ports.json. Long strings are cut with a trailing ellipsis, never reworded. Baseline map: docs/portal-dataflow/bonfire-ports.md, evidence-cited to file and line, but written against the 20 July run and therefore one run behind on every number. Companion pages: Portal pedia · 02 (DemandStar).",p="docs/portal-dataflow/pedia-bonfire-ports.html",c={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:p};export{c as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,p as source_page,l as stages,t as title};
