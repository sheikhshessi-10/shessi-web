const e="demandstar-pro",t="DemandStar Pro (login): what happens to a bid, stage by stage",a="Portal pedia · 15",s="DemandStar Pro: the night nothing came out the other end",n="This is the logged-in half of DemandStar. We sign in with the paid LGS account and hit the national search, which shows syndicated bids the free per-agency crawl cannot see. Every stage below is from the run of 28 July 2026, with a real record from the real file at each step. That night the portal pulled 360 bids, sent 4 to the scorer, and ended with zero worth bidding.",r=[{value:"360",label:"pulled tonight"},{value:"253",label:"already known"},{value:"107",label:"new to triage"},{value:"4",label:"triage says open"},{value:"4",label:"judged no"},{value:"0",label:"yes and maybe"}],i=`Every number above is a field in data/demandstar-pro/daily/2026-07-28/stats.json (474 bytes). Careful with the 253: the file calls it carryover_count, but the code that writes it does len(mapped) - len(new_uniques) (compile_report.py:84), and new_uniques drops a bid if it is in either of two stores (dedup_new.py:31). So 253 means "already held by the free DemandStar sweep or already seen by this login", not "verdicts carried over" and not even "seen before by this login". Counted on disk: 244 of the 253 were already in the free sweep's file, 124 were in this login's own seen-list, and 115 were in both — which is why those two figures overshoot 253. 103 of the 107 new bids were skipped on title, buyer and state.`,o=["Bid A · 544234 · Central WTP SCADA Upgrade, City of Plantation, Florida. Dies at triage.","Bid B · 544096 · AM27-6 Crouse Bench Aerial Herbicide. Travels furthest and still dies, as a NO at score 22."],d=[{n:"0",title:"Is this portal due tonight?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest date folder under data/demandstar-pro/daily/. The registry says run it every 1 day. If the newest folder is older than that, the slug gets printed and the orchestrator picks it up.","Nothing is written here. If the slug is not printed, the portal simply does not run that day, and no file records that it did not."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the offline mirror of the cadence"},{path:"data/demandstar-pro/daily/",size:"22 date folders, newest 2026-07-28"}],blocks:[],notes:["Cadence is really edited in the PortalPro Matrix (Supabase portals.cadence_days); the JSON file is the copy on disk. Evidence: scripts/portal_due.py:3-5, :22, :31."],tables:[]},{label:"The registry row, read off disk",paths:[],blocks:[`{
 "slug": "demandstar-pro",
 "label": "DemandStar Pro (login)",
 "engine": "",
 "batch": "portals",
 "cadence_days": 1,
 "authed": true,
 "enrich_passes": [],
 "watch": "v2-recipe",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Keep carry_forward in mind. Stage 10 shows it does not do what its name says."],tables:[]}],notes:[],then:"the orchestrator starts a child agent"},{n:"1",title:"Hand the whole run to a child agent",who:"Agent reading .claude/skills/demandstar-pro/SKILL.md",summary:["This portal has no run_daily.py and no scripts folder of its own. It is an eight-step runbook written in a skill file (Phase 0 through Phase 7), and an agent walks it step by step. Every script it calls lives under data/demandstar/scripts/extended/, which is the free DemandStar sweep's folder.","It runs last, in the final batch, on purpose. Step 3 subtracts everything the free sweep already holds, so the free sweep has to finish first."],cells:[{label:"In → Out",paths:[{path:".claude/skills/demandstar-pro/SKILL.md",size:"15,127 bytes · PHASE 0 preflight → PHASE 7 compile"},{path:"a running child agent",size:"no file written at this step"}],blocks:[],notes:["What breaks it. If this child starts before the free DemandStar sweep has refreshed data/demandstar/bids/all-bids.json, step 3 subtracts against a stale list and re-triages bids we already have. Evidence: .claude/skills/portals/SKILL.md:196."],tables:[]}],notes:[],then:"first question: do we still have a valid key?"},{n:"2",title:"Is the saved login key still good?",who:"data/demandstar/scripts/extended/check_token.py",summary:["One test call to the search endpoint using the key we saved last time. Exit 0 means keep it. Exit 2 means log in again. The whole point is to avoid a needless login on a real paid account.","This step writes nothing to disk. It prints one line and exits, so the archive holds no proof of which way it went. The next stage does, though."],cells:[{label:"In",paths:[{path:"data/auth/demandstar-token.txt",size:"735 bytes · one raw key string"},{path:"https://api.demandstar.com/contents/content/v1/bids/search",size:"one probe call"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"stdout",size:"TOKEN OK or TOKEN INVALID"}],blocks:[],notes:["Exit code 0 skips the login. Exit code 2 runs it. Evidence: check_token.py:7, :18, :20."],tables:[]}],notes:[],then:"on this night, the key was not good enough"},{n:"3",title:"Log in and grab a fresh key",who:"data/demandstar/scripts/extended/login.py",summary:["A stealth headless browser solves the Cloudflare check, fills the username and password boxes, then listens to the calls the page makes after login and keeps the longest bearer key it hears. That key is saved to a text file for the rest of the run.","This is a real paid LGS account, so detection rules apply. If Cloudflare does not clear, the run stops. Nobody hand-solves a challenge on this account."],cells:[{label:"In → Out",paths:[{path:"creds.get_login('demandstar-pro')",size:"user and password from the credential store"},{path:"data/auth/login-debug.png",size:"1,155,788 bytes · written 17:24 on 28 Jul"},{path:"data/auth/demandstar-token.txt",size:"735 bytes · rewritten 17:26 on 28 Jul"}],blocks:[],notes:[],tables:[]},{label:"How we know it ran that night",paths:[],blocks:[],notes:['The failure that hurts most. If no bearer key is heard, the script prints "!!! NO TOKEN CAPTURED" and every later step dies trying to read the key file. Evidence: login.py:98, :101.',"The screenshot file is stamped 17:24:06 and the key file 17:26:02 on 28 July, both ahead of the pull files at 17:26:43. Both are written only by login.py (login.py:59 and login.py:98). So the saved key had gone stale and a fresh login happened."],tables:[]}],notes:[],then:"now pull the national list"},{n:"4",title:"Pull the national search",who:"data/demandstar/scripts/extended/pull.py --mode daily",summary:["Pages the logged-in search newest-first, twice: once for Active bids, once for Open ones. Anything not Active or Open is dropped. Each row is then flattened into our own field names. Listing bids is free; only opening a bid costs against the account.","360 bids came back. 160 of them were syndicated Extended-Network rows, which is the whole reason this logged-in run exists. 92 of the 360 carried no state at all."],cells:[{label:"In → Out",paths:[{path:"data/auth/demandstar-token.txt",size:"the key from stage 3"},{path:"data/demandstar/runs/extended/all-raw-2026-07-28.json",size:"258,060 bytes · 360 rows"},{path:"data/demandstar/runs/extended/all-mapped-2026-07-28.json",size:"161,966 bytes · 360 rows"}],blocks:[`{
 "source_external_id": "544096",
 "title": "AM27-6 Crouse Bench Aerial Herbicide",
 "identifier": "RFQ-US.246517",
 "agency": "U3P",
 "state": null,
 "county": null,
 "status": "Active",
 "due_date": "2026-08-05",
 "broadcast_date": "2026-07-27",
 "is_external": true,
 "source": "demandstar-pro",
 "bidUrl": "https://www.demandstar.com/app/
 suppliers/bids/544096"
}`],notes:[],tables:[]},{label:"Real raw record Bid B",paths:[],blocks:[`{
 "bidId": 544096,
 "bidName": "AM27-6 Crouse Bench Aerial
 Herbicide",
 "bidIdentifier": "RFQ-US.246517",
 "agency": "U3P",
 "broadCastDate": "2026-07-27T20:00:00",
 "dueDate": "2026-08-05T20:00:00",
 "city": "",
 "state": null,
 "county": null,
 "postalCode": null,
 "planholders": "#",
 "watches": "#",
 "internalStatus": "BR",
 "status": "Active",
 "statusType": "AC",
 "mi": 2625603,
 "isExternalBid": true,
 "planholdersCount": 0,
 "watchersCount": 0
}`],notes:[`"agency": "U3P" is not a buyer. It is DemandStar's label for a syndicated feed. 16 of tonight's 107 new bids carry it. The real buyer is hidden in the scope text, and stage 8 shows who ends up guessing it.`],tables:[]}],notes:["The number that looks like a cap and is not. The API reports a total near 1,000. That is the count of every Active row it knows about, not a limit we are failing to beat. Sorting the search a different way only dredges up closed archive rows, which the live filter throws away. Evidence: pull.py:83-90, and the flattener at pull.py:92-98. Repeated throttling stops the run for the day (pull.py:50)."],then:"subtract everything we already have"},{n:"5",title:"Take away what we already knew",who:"data/demandstar/scripts/extended/dedup_new.py",summary:["Two subtractions. First, every bid the free DemandStar sweep already holds, from a 67,232-row file. Second, every bid this logged-in run has seen on any earlier day. At this point in the night that seen-list held 3,814 ids; stage 9 rewrites the same file and it now sits at 4,050. What is left is genuinely new.","360 minus those two lists leaves 107. Of those 107, 100 were Extended-Network bids and only 7 were direct. That ratio is the argument for paying for this login at all."],cells:[{label:"In",paths:[{path:"runs/extended/all-mapped-2026-07-28.json",size:"360 rows"},{path:"data/demandstar/bids/all-bids.json",size:"48.1 MB · 67,232 rows"},{path:"runs/extended/seen-bids.json",size:"3,814 ids when read here, all strings · 4,050 on disk today, after stage 9"},{path:"runs/extended/new-uniques-2026-07-28.json",size:"46,567 bytes · 107 rows"},{path:"runs/extended/triage-candidates-2026-07-28.json",size:"19,394 bytes · 107 rows"}],blocks:[],notes:[],tables:[]},{label:"The two tracers as triage sees them Bid ABid B",paths:[],blocks:[`{
 "idx": 0,
 "title": "Central WTP SCADA Upgrade",
 "buyer": "City of Plantation -
 Procurement Department",
 "state": "FL",
 "id": "544234",
 "ext": false
}`,`{
 "idx": 64,
 "title": "AM27-6 Crouse Bench Aerial
 Herbicide",
 "buyer": "U3P",
 "state": null,
 "id": "544096",
 "ext": true
}`],notes:["Six fields. No description exists yet, so this is everything the first AI pass will get."],tables:[]}],notes:['A deliberate safety choice lives here. The seen-list is not updated at this step. It is only updated at the very end, after triage and scoring both finish, so a crash mid-run can never mark a bid as "seen" without it ever being read. Evidence: dedup_new.py:7-8, :20, :22-28, :31, :34-37.'],then:"107 titles go to the first AI pass"},{n:"6",title:"Pass 1: open it or skip it",who:"max-triage · AI (read-only; the child agent writes the file)",summary:["Each new bid is read on its title, buyer and state. Nothing else exists yet. The default answer is SKIP. Removal, hauling, vegetation and right-of-way work get OPEN.","Result: 103 SKIP, 4 OPEN. Bid A dies here, on one line of reasoning, for a total cost of one title read."],cells:[{label:"In → Out",paths:[{path:"runs/extended/triage-candidates-2026-07-28.json",size:"107 rows"},{path:"runs/extended/triage-verdicts-2026-07-28.json",size:"12,091 bytes · 107 rows"}],blocks:[`544174 demolition / structure removal is core
 LGS work - judge on real scope
 [dispatcher override of Pass-1 SKIP]
544166 site grading + landscaping - land-clearing
 adjacent work type
 [dispatcher override of Pass-1 SKIP]
544134 wetland restoration may carry clearing/
 removal scope - verify on scope
 [dispatcher override of Pass-1 SKIP]
544096 aerial herbicide = vegetation management,
 core LGS work type
 [dispatcher override of Pass-1 SKIP]`],notes:[],tables:[]},{label:"Real records Bid A, thrown outBid B, opened",paths:[],blocks:[`{
 "idx": 0,
 "id": "544234",
 "decision": "SKIP",
 "reason": "SCADA upgrade, water utility
 infrastructure"
}`,`{
 "idx": 64,
 "id": "544096",
 "decision": "OPEN",
 "reason": "aerial herbicide = vegetation
 management, core LGS work type
 [dispatcher override of Pass-1 SKIP]"
}`],notes:[],tables:[]}],notes:["Read that override text carefully. All four OPENs, and only those four, carry the phrase [dispatcher override of Pass-1 SKIP]. The text itself claims the AI's first answer was SKIP and something changed it to OPEN. There is no separate Pass-1 file on disk for this run to check that against, so the override exists only as words inside the final reason. Being unable to see the original answer is itself the finding: on this night, every bid that reached the scorer got there by a hand override that leaves no auditable trail."],then:"only the 4 OPENs get their detail opened"},{n:"7",title:"Go get real detail, for four bids only",who:"data/demandstar/scripts/extended/enrich_opens.py",summary:["For each OPEN bid one detail call is made, adding scope of work, contact and the outside link. Only OPENs, spaced 4 to 8 seconds apart, because opening a bid detail counts against a hard per-account view limit.","All four were syndicated, all four were distributed by Bonfire, and all four have the same honest closing line in their description: the real packet was not pulled."],cells:[{label:"In → Out",paths:[{path:"runs/extended/triage-verdicts-2026-07-28.json",size:"the 4 OPENs"},{path:"data/auth/demandstar-authbody.json",size:"1,574 bytes"},{path:"runs/extended/judge-input-2026-07-28.json",size:"11,584 bytes · 4 rows"}],blocks:[`544174 enrich_status=ok joliet.bonfirehub.com
544166 enrich_status=ok utah.bonfirehub.com
544134 enrich_status=ok utah.bonfirehub.com
544096 enrich_status=ok utah.bonfirehub.com`],notes:["The moment the run can stop itself. If DemandStar answers with visitLimitExceeded, the loop breaks straight away and the bid is stamped view_cap_hit. Evidence: enrich_opens.py:44-46; only OPENs are enriched (:30) and each one waits 4-8 seconds (:68)."],tables:[]},{label:"Real record Bid B",paths:[],blocks:[`{
 "source_external_id": "544096",
 "title": "AM27-6 Crouse Bench Aerial
 Herbicide",
 "agency": "U3P",
 "state": null,
 "due_date": "2026-08-05",
 "is_external": true,
 "scopeOfWork": "Issuing Procurement Unit: State
 of Utah Division of Purchasing \\\\nConducting
 Procurement Unit: Division of Wildlife
 Resources \\\\n\\\\nThe purpose of this Request for
 Quotes (RFQ) is to enter into a contract or
 purchase order with the responsive and
 responsible vendor that submits the lowest
 cost to provide: aerial herbicide of 372
 Acres in Daggett County. …",
 "bid_type": "RFQ",
 "bid_number": "US.246517",
 "contact_name": "",
 "contact_info": "",
 "distributed_by": "Bonfire",
 "external_agency_url": "utah.bonfirehub.com",
 "external_id": 246517,
 "enrich_status": "ok",
 "description": "--- SCOPE OF WORK (DemandStar) ---
 … --- EXTERNAL SOURCE ---
 Full RFP + documents on utah.bonfirehub.com
 (externalId 246517) — NOT pulled"
}`],notes:["Two traps in one record. The scope text carries literal backslash-n instead of real line breaks, and the contact fields are empty strings, not missing keys."],tables:[]}],notes:["The hop nobody takes. For a syndicated bid, DemandStar holds a summary and the real request lives on the buyer's own site, usually Bonfire. That second hop is not automatic, and the description says so in plain text every time. The scorer in the next stage is judging a summary, not the real request. Evidence: enrich_opens.py:62-66."],then:"four bids reach the scorer"},{n:"8",title:"Pass 2: yes, maybe or no, with a score",who:"max-bid-judge · AI (read-only; the child agent writes the file)",summary:["Each of the four is scored against the Max persona using the scope text rather than the title. The answers that night: 0 yes, 0 maybe, 4 no, at scores 10, 15, 15 and 22.","Bid B scored highest of the four and still lost. Aerial herbicide over 372 acres is a licensed-aircraft spraying job, not crews with saws and trucks. Vegetation in name, not in work."],cells:[{label:"In → Out",paths:[{path:"runs/extended/judge-input-2026-07-28.json",size:"4 rows"},{path:"runs/extended/judge-verdicts-2026-07-28.json",size:"2,681 bytes · 4 rows"}],blocks:[],notes:['The scorer filled in facts the feed did not have. The row it was handed says "agency": "U3P" and "state": null. The verdict it wrote back says "agency": "Utah Division of Wildlife Resources" and "state": "UT". Both are almost certainly right, and both are the AI reading them out of the scope paragraph. Downstream, nothing marks them as inferred rather than fetched.',"A quiet way to report a false zero. If this file is missing when the archive is written, the next stage falls back to an empty list and the day reports 0 yes, 0 maybe, 0 no with no error at all. This night the zero is real, and the file is here to prove it. Evidence: compile_report.py:16-17."],tables:[]},{label:"Real record Bid B, NO at 22",paths:[],blocks:[`{
 "id": "544096",
 "identifier": "RFQ-US.246517",
 "title": "AM27-6 Crouse Bench Aerial
 Herbicide",
 "agency": "Utah Division of Wildlife
 Resources",
 "state": "UT",
 "due_date": "2026-08-05",
 "link": "https://www.demandstar.com/app/
 suppliers/bids/544096",
 "would_lgs_bid": "no",
 "score": 22,
 "primary_reason": "Aerial herbicide spraying over
 372 acres is a licensed-aircraft pesticide
 job, not tree trimming, ROW clearing, or
 debris removal - vegetation-adjacent in name
 only, not the work LGS actually fields crews
 for.",
 "red_flags": [
 "aerial_application_not_lgs_trade",
 "vegetation_adjacent_not_core"
 ],
 "external_source": "utah.bonfirehub.com"
}`],notes:[],tables:[]}],notes:[],then:"write the archive and close the memory"},{n:"9",title:"The archive, and the memory that closes last",who:"data/demandstar/scripts/extended/compile_report.py",summary:["All 360 bid ids pulled tonight are folded into the seen-list, which goes from 3,814 to 4,050 ids (236 of tonight's 360 were new to it). Then the run report is written, and finally the standard five-file folder under this portal's own slug, so the rest of the pipeline treats it like any other portal.","This is also where field names change again. id becomes bid_id, agency becomes buyer, link becomes detail_url, and a new bid_key appears."],cells:[{label:"The folder · data/demandstar-pro/daily/2026-07-28/",paths:[],blocks:[`{
 "source_external_id": "544234",
 "title": "Central WTP SCADA Upgrade",
 "identifier": "ITB-051-26-0-2026/AM",
 "agency": "City of Plantation -
 Procurement Department",
 "state": "FL",
 "county": "Broward County",
 "status": "Active",
 "due_date": "2026-09-01",
 "broadcast_date": "2026-07-28",
 "is_external": false,
 "source": "demandstar-pro",
 "bidUrl": "https://www.demandstar.com/app/
 suppliers/bids/544234",
 "bid_id": "544234",
 "buyer": "City of Plantation -
 Procurement Department"
}`],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","107 rows, tonight's new set","53,034 B"]},{header:!1,cells:["triage.json","107 Pass 1 decisions","12,091 B"]},{header:!1,cells:["verdicts.json","4 rows, all NO","2,811 B"]},{header:!1,cells:["stats.json","the funnel counts","474 B"]},{header:!1,cells:["report.md","human summary","456 B"]}]]},{label:"Bid B, remapped into verdicts.json Bid B",paths:[],blocks:[`{
 "bid_id": "544096",
 "title": "AM27-6 Crouse Bench Aerial
 Herbicide",
 "buyer": "Utah Division of Wildlife
 Resources",
 "state": "UT",
 "would_lgs_bid": "no",
 "score": 22,
 "category": "",
 "primary_reason": "Aerial herbicide spraying over
 372 acres is a licensed-aircraft pesticide
 job, not tree trimming, ROW clearing, or
 debris removal …",
 "red_flags": [
 "aerial_application_not_lgs_trade",
 "vegetation_adjacent_not_core"
 ],
 "due_date": "2026-08-05",
 "detail_url": "https://www.demandstar.com/app/
 suppliers/bids/544096",
 "external_source": "utah.bonfirehub.com",
 "bid_key": "demandstar-pro:544096"
}`],notes:['A stale sentence, written fresh every night. The rich run report at runs/extended/report-2026-07-28.md (517 bytes) still says "Standalone; not published to Supabase/PortalPro". That has not been true for a long time. The board fixture carries 44 cards from this portal, and its own last-run date is 2026-07-28. The sentence is hard-coded at compile_report.py:33 and the file is rewritten every night at :48. The field renames above are :64-70; the seen-list update is :22-27.'],tables:[]}],notes:[],then:"the portal's own work is done, the shared machinery takes over"},{n:"10",title:"Carry forward: this portal is not in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`On other portals, this step rescues yesterday's answers for bids that fell out of one night's pull, so a still-open bid does not vanish from the board. It only runs on portals whose registry entry says carry_forward: "orchestrator".`,'This portal says "engine-internal". In plain words: the shared script skips it, because the portal is supposed to handle its own carrying. It does not carry verdicts. It only remembers bid ids, in the seen-list from stage 5.'],cells:[{label:"What actually happens for this slug",paths:[],blocks:[],notes:['An open question, honestly. The label says "engine-internal" but no verdict carrying happens anywhere for this slug. The carryover_count of 253 in stats.json is bid-level dedup, not verdicts. Either the label is wrong or the behaviour is. This is written up in docs/portal-dataflow/demandstar-pro.md under Open questions and is still unanswered.'],tables:[[{header:!1,cells:["Shared carry-forward script","never touches this portal (carry_forward_verdicts.py:241 via portal_registry.py:103-108)"]},{header:!1,cells:["Inside the sweep","bid-level memory only: seen-bids.json, 3,814 ids read, 4,050 written back"]},{header:!1,cells:["verdicts.json for tonight","written from tonight's scoring alone, 4 rows, nothing merged in"]},{header:!1,cells:["Why older YES still show on the board","the fixture builder reads every date folder at once (build_yes_excel.py:131, :151-173), not because anything carried forward"]}]]}],notes:[],then:"the ledger, the report rewrite, the board fixtures"},{n:"11",title:"Ledger, report rewrite, board fixtures",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The ledger walks every date folder and keeps one row per bid, splitting still-open from closed. The report rewriter overwrites the report.md the sweep just wrote with the shared house layout. The fixture dumper collects every YES this portal has ever produced into the file the board reads.","Tonight the report rewrite ran at 22:37, five minutes after the archive was written, and it had nothing to put in the YES or MAYBE sections."],cells:[{label:"The whole rewritten report, verbatim · 456 bytes",paths:[],blocks:[`# demandstar-pro — 2026-07-28

**Source:** common-production-api-global...
/contents/content/v1/bids/search · engine
\`demandstar-authn-search\` · state FL

- Snapshot: **360** open bids
- Carryover: 253 · NEW today: 107
- Triage: 4 OPEN / 103 SKIP
- Scored: **0 YES / 0 MAYBE / 4 NO**

## YES — Max would bid

_none_

## MAYBE — operator judgment

_none_

---
_Standardized report · regenerated
2026-07-28T22:37:26+00:00_`],notes:[`"state FL" is wrong and provable. This feed is national. 92 of tonight's 360 rows carry no state at all, and all four scored bids had state: null in the feed. There is no state field in stats.json. The renderer takes the state from a per-portal config.json, and this portal has none, so it falls through to the state on the very first row of the snapshot it loaded. That snapshot is new-bids.json (there is no bids/all-bids.json to prefer), and its row 0 is bid 544234, City of Plantation, FL. One arbitrary row names the whole national feed. Evidence: standardize_daily_reports.py:175, :181-183, :190.`],tables:[]},{label:"A real card this portal put on the board",paths:[],blocks:[`{
 "id": "34c60dc20c61a381",
 "portal": "demandstar-pro",
 "portal_label": "DemandStar Pro (login)",
 "source_bid_id": "524152",
 "title": "Electric Utility Right-of-Way
 Vegetation Maintenance Services",
 "buyer": "Clay Electric Cooperative",
 "state": "FL",
 "solicitation_no": null,
 "federal": false,
 "score": 97,
 "verdict": "yes",
 "ai_reasoning": "Electric coop ROW vegetation
 maintenance — 70 feeders, 4,323 circuit miles,
 14 counties, 24 months. Exact Cat 2 utility
 ROW work at massive scale.",
 "description": "Electric coop ROW vegetation
 maintenance — 70 feeders, 4,323 circuit miles,
 14 counties, 24 months. Exact Cat 2 utility
 ROW work at massive scale.",
 "due_date": "2026-06-26",
 "contact_name": null,
 "contact_email": null,
 "first_seen": "2026-06-20",
 "has_documents": false
}`],notes:["Not from tonight. This is a June bid, still sitting in the fixture. Look at description: it is a copy of ai_reasoning. The card has no real description, no contact, no documents."],tables:[]}],notes:["Why those cards are so thin. The fixture builder tries to overlay richer data from data/demandstar-pro/bids/all-bids.json. That file does not exist. The portal folder holds only PORTAL.md and daily/. So the overlay does nothing and every published card carries just the thin list row. Evidence: build_yes_excel.py:175-187, the overlay guarded by if ap.is_file() at :181-182. Tonight added zero cards, because tonight had zero YES: the fixture holds 44 demandstar-pro cards out of 1,470 total, and its recorded last run for this portal is 2026-07-28."],then:"bids stop being portal-shaped here"},{n:"12",title:"Onto the shared board, and merged with its twin",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Only YES rows are pushed. They become bids in the shared database, then get clustered with every other portal's bids so one real solicitation shows as one card. For this portal that usually means merging with the free DemandStar copy of the same bid, and often a Bonfire copy too.","Tonight pushed nothing new, because tonight produced no YES. The 44 existing cards stay as they are."],cells:[{label:"What this portal contributes to the join",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Rows pushed","YES only. NO and SKIP stay in the on-disk archive forever (dump_yes_for_portalpro.py:133-134; the two federal feeds are the only ones that also push MAYBE)"]},{header:!1,cells:["Blank-state problem","92 of tonight's 360 rows had no state. Blank-state rows would only ever be compared against other blank-state rows"]},{header:!1,cells:["The fix already in place","the pair generator adds an explicit blank-against-stated pairing using due date (llm_dedup_candidates.py:269-278 — the comment there names demandstar-pro as the reason it exists)"]},{header:!1,cells:["Tables written","portals (publish_to_supabase.py:1075), bids (:1110, plus the cluster_id patch at :710), clusters (:709), decision_events (:765), sweep_runs (:1130)"]}]]}],notes:[],then:"the board tries to fill what the portal could not"},{n:"13",title:"Page text, documents, requirements",who:"2.85 tail run_enrichment_phase.py · 2.87 extract_doc_text.py → requirements-extractor → apply_requirements.py",summary:["The registry gives this portal no enrichment pass of its own. What does cover it is the shared public page-text grab, which opens the free anonymous detail page for every live card and saves the text. That happens publicly on purpose, so it never competes with the one authenticated login the account can afford.","Documents are a wall. DemandStar charges $5 a bid for the package, even on the paid login. So the system records a reason instead of pretending, and requirements usually come from a sibling portal in the same cluster."],cells:[{label:"Walls, and how they are recorded instead of hidden",paths:[],blocks:[],notes:["Page text is captured from https://www.demandstar.com/app/limited/bids/{id}/details and written to bid_page_text with captured_by='public:page_text_public_capture'. Evidence: page_text_public_capture.py:78-79, :107-109, :127-130 and enrichers.py:107-110."],tables:[[{header:!0,cells:["What we cannot get","What gets written instead"]},{header:!1,cells:["Bid documents",'gap reason requires_payment, with the line "the pro login widens the UNIVERSE, not the files" (gap_reasons.py:73-75)']},{header:!1,cells:["The real request for a syndicated bid","the Bonfire link is kept in external_source; nothing follows it"]},{header:!1,cells:["Requirements for a bid with no material","a neutral no_material row, so the board never shows a blank"]},{header:!1,cells:["Requirements that do exist","usually inherited from a merged sibling copy of the same solicitation — extraction works per cluster, and a multi-portal cluster keeps every portal's captured page (extract_doc_text.py:591-596)"]}]]}],notes:[],then:"now that blanks are filled, compare again"},{n:"14",title:"Second look at duplicates",who:"2.875 · scripts/llm_dedup_candidates.py, then judge and apply only if pairs exist",summary:["Enrichment has just filled in buyers and due dates that were blank in the morning. Two cards that could not be compared then can be compared now, so the pairing runs a second time.","This matters here more than almost anywhere else. This portal's syndicated rows arrive with a blank state, the placeholder buyer U3P, and a one-line scope. They only become comparable after enrichment."],cells:[{label:"In → Out",paths:[{path:"the cluster and bid tables, plus past merge decisions",size:"llm_dedup_candidates.py:107-108, and :13 for the adjudications"},{path:"data/portals/llm-dedup-candidates.json",size:"llm_dedup_candidates.py:16, written at :311"},{path:"data/portals/llm-dedup-merges.json",size:"written by the apply step"}],blocks:[],notes:["If the pair count is zero the run stops here. Re-running the apply step on a stale merges file is the mistake this rule exists to prevent."],tables:[]}],notes:[],then:"what changed since last time, and did the run finish?"},{n:"15",title:"Watch, emails, and the run check",who:"2.88 · enrich_engine/run_v2.py + watch_v2.py · scripts/bid_watch.py · scripts/pipeline_sentinel.py",summary:["The watcher logs in again, reopens each watched bid's page, clicks Show More, saves the text, and compares today's page against the stored one. If the page moved, it raises an update. Then four operator emails are built, and the sentinel checks every portal actually produced every file it should have.","Two things to know here. The watcher is running in shadow, and it did not run on the anchor night at all."],cells:[{label:"Shadow mode, straight from the file",paths:[],blocks:[`{
 "_comment": "Portals promoted to Enrichment
 Engine v2 (--mode apply). OPERATOR-EDITED
 ONLY. A portal is added here only after it
 wins the 3-day shadow comparison (spec 8.3).
 Removing a portal instantly reverts it to
 the v1 script, no code change.",
 "promoted": []
}`],notes:["enrich_engine/PROMOTED.json. The list is empty, so this portal writes page text and disk files but never touches the bid, document or enrichment tables (capture.py:99-101)."],tables:[]},{label:"What is on disk, and what is missing",paths:[],blocks:[],notes:[`Do not trust this watcher's document alerts. The orchestrator skill records it plainly: this recipe under-captures documents, gets zero, and can raise noisy "new document" rows (.claude/skills/portals/SKILL.md:409). A missing login form raises a plain error rather than a bot-detection flag, on purpose, so the bot signal stays worth trusting (recipes/demandstar_pro.py:87).`],tables:[[{header:!1,cells:["data/portals/v2/pages/demandstar-pro/","78 files: 44 page-text files but only 34 link files, so 10 captures saved text with no links beside it"]},{header:!1,cells:["Newest capture","2026-07-24, four days before the anchor run"]},{header:!1,cells:["Newest shadow record","v2/shadow/demandstar-pro/2026-07-24.json"]},{header:!1,cells:["So on 28 July","the authenticated re-capture did not run. No file for that date exists"]},{header:!1,cells:["Documents in the watch recipe",'shape is "none", expects_docs is false, because of the $5 charge (recipes/demandstar_pro.py:39-40)']},{header:!1,cells:["Operator emails","silent until RESEND_API_KEY is set in data/auth/resend.env"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Documents cost $5 a bid, even on the paid login","no document bytes are ever fetched. The gap reason requires_payment is written instead of a blank. Requirements come from a merged sibling portal or not at all"]},{header:!1,cells:["Syndicated bids carry a one-line summary; the real request lives on Bonfire",'the description literally ends "NOT pulled". All four bids scored on 28 July were judged on a summary, not a request']},{header:!1,cells:['"agency": "U3P" is a feed label, not a buyer, and 92 of 360 rows have state: null',"the scorer fills both in from the scope paragraph. Real buyer names and states on this portal's cards can be AI readings, and nothing marks them as such"]},{header:!1,cells:["No data/demandstar-pro/bids/all-bids.json exists","the enrichment overlay in the fixture builder does nothing, so every published card has no contact and a description that is just the AI's own sentence"]},{header:!1,cells:['carry_forward: "engine-internal", but nothing carries verdicts','only bid ids are remembered. Older YES stay visible only because the fixture builder re-reads all 22 date folders each time. Open question: should the label be "orchestrator"?']},{header:!1,cells:["carryover_count counts bids, not verdicts — and it merges two different stores",`reading 253 as "verdicts carried over" is wrong every single day. It is "in the free sweep's file or in this login's seen-list": tonight 244 of the 253 were the free sweep's, 124 were this login's own, 115 were both`]},{header:!1,cells:["Report header says state FL","the feed is national. With no config.json for this portal, the renderer copies the state off row 0 of new-bids.json — tonight that was one Florida bid. There is no state field in stats.json to back it"]},{header:!1,cells:["Bid ids change spelling at every hop: bidId number, id string, source_external_id, bid_id, bid_key","every join across these files has to normalise. Nothing warns on a mismatch"]},{header:!1,cells:['scopeOfWork holds literal backslash-n, and contacts arrive as "" not null','anything testing "is the contact missing" with a null check reads empty strings as present']},{header:!1,cells:["If judge-verdicts-{date}.json is missing, the archive falls back to an empty list","a failed scoring step and a real zero look identical in the report. On 28 July the file exists, so the zero is real"]},{header:!1,cells:["Watch v2 runs in shadow (promoted: []) and last captured on 2026-07-24","no authenticated re-capture happened on the anchor night, and even when it runs it writes page text only"]},{header:!1,cells:['The run report still says "Standalone; not published to Supabase/PortalPro"',"stale text. The board fixture holds 44 cards from this portal. The shared rewrite at 2.7 overwrites the visible report, so the operator never sees the wrong line, but the source line is still there"]},{header:!1,cells:["data/demandstar-pro/PORTAL.md is a draft dated 2026-07-14",'it says batch standalone and engine demandstar-pro; the registry says batch portals and engine "". It reports 18 archive days and last swept 2026-07-13; disk has 22 folders, newest 2026-07-28. Its field map is all TODO. The skill file is the real runbook']},{header:!1,cells:["Opening a bid detail counts against an account view cap","if visitLimitExceeded flips, enrichment stops mid-list and the rest go to the scorer with thin text"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk, not written by hand. Every count traces to stats.json, a row count, or a file listing. No bid was judged YES or MAYBE on the anchor night, so no surviving bid is shown, and none was invented to fill the gap. Baseline map: docs/portal-dataflow/demandstar-pro.md, evidence-cited to file and line. Companion page: Portal pedia · 02 (the free DemandStar sweep)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk, not written by hand. Every count traces to stats.json, a row count, or a file listing. No bid was judged YES or MAYBE on the anchor night, so no surviving bid is shown, and none was invented to fill the gap. Baseline map: docs/portal-dataflow/demandstar-pro.md, evidence-cited to file and line. Companion page: Portal pedia · 02 (the free DemandStar sweep).",c="docs/portal-dataflow/pedia-demandstar-pro.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:r,funnel_note:i,legend:o,stages:d,sections:l,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,r as funnel,i as funnel_note,s as headline,n as lede,o as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
