const e="napc",t="NAPC: what happens to a bid, stage by stage",a="Portal pedia · 30",s="NAPC: what happens to a bid, across 113 look-alike websites",n="NAPC runs a network of near-identical bid sites. We fetch 113 of them, keep the free teaser, and never see the real document. Every stage below carries a real record from the files on disk. All data is from the run of 28 July 2026. The night's real work was 30 bids, and the ledger it feeds shows 1,014.",r=[{value:"1,490",label:"in snapshot"},{value:"149",label:"carried over"},{value:"1,341",label:"new to triage"},{value:"40",label:"triage says open"},{value:"30",label:"judged tonight"},{value:"11",label:"yes"},{value:"11",label:"maybe"},{value:"8",label:"no"}],i="Sources: data/napc/runs/_funnel.json (193 bytes) for the first three cells, data/napc/daily/2026-07-28/stats.json (2,141 bytes) for triage.open, and data/napc/runs/_new_judge_2026-07-28.json (24.2 KB, 30 rows) for the three verdict cells. The 40 OPENs are 30 bids new tonight plus 10 that were opened on an earlier day and already had a score, which is why the judge saw 30 and not 40. Counted straight off data/napc/daily/2026-07-28/triage.json: 40 OPEN, of which 10 carry carried_over_from. Two files agree on the three verdict cells: the same 11 / 11 / 8 falls out of the archived data/napc/daily/2026-07-28/verdicts.json when it is narrowed to those 30 newly-opened bids.",o=["Bid A · 4a9396d7ec670bf9 · Maritime Satellite Antenna, Hawaii. In tonight's listing, SKIP decided on an earlier day.","Bid B · 6efab12878a59529 · Disaster Debris Removal, Florida. YES at 95, and not in tonight's listing at all.","Bid C · 262535b9c271b3b1 · On-Call Tree Trimming, South Carolina. YES at 88. The one bid that ran the whole night."],d=[{n:"0",title:"Is NAPC due tonight?",who:"scripts/portal_due.py --batch portals",summary:["One question, one answer. The gate looks at the newest dated folder under data/napc/daily/. NAPC's cadence is one day, so it is due unless it already ran today.","Nothing is written. The slug is printed on standard output and the orchestrator picks it up."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the portal list"},{path:"data/napc/daily/*/",size:"44 dated folders on record"}],blocks:[],notes:[],tables:[]},{label:"Real record, whole · data/portals/registry.json",paths:[],blocks:[`{
 "slug": "napc",
 "label": "NAPC",
 "engine": "",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "orchestrator"
}`],notes:["Three of these matter later: no login, no enrichment pass, no watch recipe. The last one, carry_forward, turns out to describe a stage that does nothing here. See stage 9."],tables:[]}],notes:[],then:"the slug goes to the orchestrator"},{n:"1",title:"Hand it to a child agent",who:"Agent(general-purpose) with the /napc-sweep prompt",summary:["The orchestrator does not run NAPC itself. It starts a child agent, hands it the NAPC sweep instructions, and lets the child run every phase. NAPC goes out in Batch A with four other hand-built portals.","NAPC is not one of the login-gated portals that start early. It is an ordinary Batch A child, and if it fails the batch is noted and the run carries on."],cells:[{label:"In",paths:[{path:".claude/skills/napc-sweep/SKILL.md",size:"the runbook the child reads"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"(the agent's return value)",size:"one paragraph of prose"}],blocks:[],notes:["Everything durable is written to disk by the child. The return value is a report, not data."],tables:[]}],notes:[],then:"113 websites, 24 at a time, no login anywhere"},{n:"2",title:"Pull",who:"data/napc/scripts/pull_bids.py",summary:["Plain web requests to 113 sites, 24 threads, 25 second timeout, certificate checking turned off because several NAPC certificates are broken. It walks the page text for the date, the title and the one-line scope, then folds duplicates across sites into one row.",'Buyer and due date are written blank on purpose. NAPC hides both behind paid registration, so the code writes the literal "?" for buyer and an empty string for due date, with the reason in a comment at pull_bids.py:160-167.'],cells:[{label:"In → Out",paths:[{path:"data/napc/config/portals.json",size:"the site list; one site, fedbids.link, is excluded"},{path:"data/napc/bids/by-portal/{host}.json",size:"113 files, one per site"},{path:"data/napc/bids/all-bids.json",size:"1.18 MB · 1,490 rows · 15 fields"},{path:"data/napc/bids/index.json",size:"296 bytes"}],blocks:[`{
 "source": "napc",
 "started_at": "2026-07-28T18:16:34.359683+00:00",
 "finished_at": "2026-07-28T18:17:57.054272+00:00",
 "elapsed_s": 82.7,
 "portals_attempted": 113,
 "portals_with_bids": 106,
 "portals_with_errors": 5,
 "raw_bid_count": 2114,
 "deduped_bid_count": 1490
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "4a9396d7ec670bf9",
 "host": "hawaiibids.net",
 "portal_kind": "state",
 "portal_state": "HI",
 "portal_topic": null,
 "portal_priority": "maybe",
 "date_added": "07/23/26",
 "title": "Maritime Satellite TVHD Antenna -
 USS Wayne E. Meyer (DDG108)
 (Request for Quotes)",
 "scope": "Project includes purcahase of Maritime
 Satellite Antenna System; 1 EA Waterproof
 IP68 N Male to N Male Low Loss Cable, …",
 "buyer": "?",
 "due_date": "",
 "due_date_iso": "",
 "seen_on_portals": ["hawaiibids.net"]
}`,`{
 "bid_id": "262535b9c271b3b1",
 "host": "southcarolinabids.com",
 "portal_state": "SC",
 "portal_priority": "maybe",
 "date_added": "07/28/26",
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "scope": "Provide on-call tree trimming,
 removal & stump grinding services.",
 "buyer": "?",
 "due_date": "",
 "seen_on_portals": ["southcarolinabids.com"]
}`],notes:["The one-line scope is the whole evidence base. There is no detail page fetch for NAPC, so this teaser is all the judge will ever see."],tables:[]}],notes:["Only the newest page of each site is ever read. The code paginates only when a listing page comes back full, and the check counts new titles rather than rows. The home page is fetched first and already carries the same rows, so the second page returns nothing new and the loop stops. Measured on this run across the 113 per-site files: pages_hit was 2 for 108 sites, 1 for one, and 0 for four. Never 3. No site returned more than 20 bids and 100 sites returned exactly 20. Five sites errored: caribbeanbids.com (404), diversitysupport.net (500), elevators.link and mediabiz.link (connection failed), negociosamericas.com (403). Two more, flooring.work and nativebiz.link, answered fine with zero bids."],then:"which of these did we already decide on?"},{n:"3",title:"The cross-day diff",who:"data/napc/scripts/prep_bids.py",summary:["NAPC's memory is the last archive folder. The script opens the newest prior triage.json and matches on bid_id. A bid we already decided on keeps its old OPEN or SKIP for free. Only the unmatched ones go to the AI.","The prior folder used tonight was 2026-07-24, four days back, holding 1,512 decisions. Of tonight's 1,490 bids, 149 matched and 1,341 did not. Ninety per cent of the listing looked brand new."],cells:[{label:"In → Out",paths:[{path:"data/napc/bids/all-bids.json",size:"1,490 rows"},{path:"data/napc/daily/2026-07-24/triage.json",size:"1,512 prior decisions"},{path:"data/napc/runs/triage-input.json",size:"0.60 MB · 1,341 rows"},{path:"data/napc/runs/triage-carryover.json",size:"24.7 KB · 149 rows"},{path:"data/napc/runs/_funnel.json",size:"193 bytes"}],blocks:[`{
 "snapshot_total": 1490,
 "triage_input_count": 1341,
 "carryover_count": 149,
 "keyword_passing": 1341,
 "new_since_last_archive": 1341,
 "prior_archive_verdicts_loaded": 1512
}`],notes:["keyword_passing equals triage_input_count because there is no keyword gate. Every new bid goes to the AI."],tables:[]},{label:"Real record Bid A · carried, free",paths:[],blocks:[`{
 "idx": 29,
 "bid_id": "4a9396d7ec670bf9",
 "decision": "SKIP",
 "reason": "federal parts commodity RFQ",
 "carried_over_from": true
}`,`{
 "idx": 780,
 "bid_id": "262535b9c271b3b1",
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "scope": "Provide on-call tree trimming,
 removal & stump grinding services.",
 "state": "SC",
 "portal_priority": "maybe",
 "portal_topic": null,
 "date_added": "07/28/26",
 "seen_on": "southcarolinabids.com"
}`],notes:["Bid B has no record at this stage. It is not in tonight's snapshot, so it is neither carried nor sent."],tables:[]}],notes:["Why the diff barely bites. A bid's key is a hash of site, title and posted date (pull_bids.py:146). Change any of the three and the same bid gets a new key. Over the four days between the two archives, 188 of tonight's 1,490 titles also appear in the 24 July snapshot, but only 149 bid keys do. That gap of 39 is the re-keying: same bid, new key, counted as new. The 20-row ceiling from stage 2 does the rest, because each site's visible page turns over almost completely."],then:"the script tells the agent whether there is work"},{n:"4",title:"The exit-code gate",who:"data/napc/scripts/run_daily.py",summary:["One small script runs the pull, then the diff, prints the funnel, and exits with a number that tells the agent what to do next. Exit 2 means there are new bids and the agent should carry on. Exit 0 means there were none, so it wrote empty verdict files and compiled from carryover alone. Exit 1 means the pull or the diff broke, and the last 1,500 characters of the failing step's log are printed.","Tonight it exited 2, with 1,341 waiting."],cells:[{label:"In",paths:[{path:"data/napc/runs/_funnel.json",size:"read for triage_input_count"},{path:"data/napc/runs/triage-verdicts.json",size:"an empty list"},{path:"data/napc/runs/judge-verdicts.json",size:"an empty list"}],blocks:[],notes:[],tables:[]},{label:"The three exits",paths:[],blocks:[],notes:["Only two files in data/napc/runs/ are written by this stage, and only on the quiet path."],tables:[[{header:!1,cells:["0","no new bids; the archive was already compiled from carryover"]},{header:!1,cells:["2","new bids pending; the agent runs triage next (tonight)"]},{header:!1,cells:["1","the pull or the diff failed"]}]]}],notes:[],then:"1,341 titles are read by the AI, in six batches"},{n:"5",title:"Triage: the cheap first look",who:"max-triage · AI, dispatched per batch by the child agent",summary:["The agent splits the new bids into files of about 250 and asks the AI for one word per bid: OPEN or SKIP, from the title and the one-line scope. The default is SKIP. A bid only opens on a literal LGS work verb.","Tonight: six batch files holding exactly 1,341 rows, and 1,341 decisions back. Thirty opened."],cells:[{label:"In → Out",paths:[{path:"data/napc/runs/triage-input.json",size:"1,341 rows"},{path:"data/napc/runs/triage-batches/batch-00…05.json",size:"250·250·250·250·250·91 = 1,341"},{path:"data/napc/runs/triage-verdicts.json",size:"0.18 MB · 1,341 rows"}],blocks:[],notes:["Nothing in code checks this. The verdict file is written by an agent, not by a script. No Python asserts one row per input bid. Tonight it happens to be exact, 1,341 in and 1,341 out, and that is a fact about tonight rather than a guarantee."],tables:[]},{label:"Real record Bid C · opened",paths:[],blocks:[`{
 "idx": 780,
 "bid_id": "262535b9c271b3b1",
 "decision": "OPEN",
 "reason": "Cat 2 tree trimming/removal/
 stump grinding"
}`],notes:["Bid A is not here. Its SKIP was decided on 24 July and rides in the carryover file instead, which is the whole point of stage 3. Bid B is not here either."],tables:[[{header:!1,cells:["opened tonight, from the AI","30"]},{header:!1,cells:["opened earlier, carried in","10"]}]]}],notes:[],then:"the 30 new OPENs are packed for the judge"},{n:"6",title:"Build the judge's input",who:"inline python in the napc-sweep runbook",summary:["A few lines of Python pick the bids this run triaged OPEN and glue the teaser into one description block. The 10 carried OPENs are left out because they were scored on an earlier day.","There is no detail page fetch anywhere in NAPC. The teaser is the evidence. Every judge score on this portal is made from a title and one sentence."],cells:[{label:"In → Out",paths:[{path:"data/napc/bids/all-bids.json",size:"for the scope text"},{path:"data/napc/runs/triage-verdicts.json",size:"to find the OPENs"},{path:"data/napc/runs/judge-input-enriched.json",size:"24.7 KB · 30 rows"}],blocks:[],notes:["Checked against the archive: the 30 ids in this file are exactly the 30 bids triaged OPEN tonight that do not carry carried_over_from."],tables:[]},{label:"Real record Bid C",paths:[],blocks:[`{
 "idx": 780,
 "bid_id": "262535b9c271b3b1",
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "scope": "Provide on-call tree trimming,
 removal & stump grinding services.",
 "state": "SC",
 "portal_topic": null,
 "portal_priority": "maybe",
 "date_added": "07/28/26",
 "seen_on_portals": ["southcarolinabids.com"],
 "description_full": "Title: On-Call Tree Trimming,
 Removal & Stump Grinding Services\\n\\nScope
 (NAPC teaser):\\nProvide on-call tree trimming,
 removal & stump grinding services.\\n\\nState:
 SC\\nPortal topic: state\\nDate added: 07/28/26"
}`],notes:["That description_full is the entire packet the judge receives. It is the title and the scope, restated."],tables:[]}],notes:[],then:"the AI scores 30 bids, then the answers are folded into a file that never shrinks"},{n:"7",title:"The judge, and the file that only grows",who:"max-bid-judge · AI, then a merge into runs/judge-verdicts.json",summary:["Thirty bids get a yes, maybe or no, a score out of 100, a category, the reasoning, and two lists of signals. Tonight: 11 yes, 11 maybe, 8 no.","Then the merge. The new answers are laid on top of runs/judge-verdicts.json without overwriting anything already in it. That merge, not any later phase, is what actually carries NAPC's scores across days. It is also why the file holds 1,014 rows on a night when 30 bids were judged."],cells:[{label:"In → Out",paths:[{path:"data/napc/runs/judge-input-enriched.json",size:"30 rows"},{path:"data/napc/runs/_new_judge_2026-07-28.json",size:"24.2 KB · 30 rows · tonight's raw answers"},{path:"data/napc/runs/judge-verdicts.json",size:"1.02 MB · 1,014 rows after the merge"}],blocks:[],notes:["A file the map does not know about. _new_judge_2026-07-28.json was written by this run and is not named anywhere in the NAPC runbook. It is the agent's own scratch copy of tonight's answers. It is also the only file on disk that says plainly what tonight actually scored, which is why this page's funnel reads it."],tables:[]},{label:"Real record, whole Bid C · YES, 88",paths:[],blocks:[`{
 "idx": 780,
 "bid_id": "262535b9c271b3b1",
 "would_lgs_bid": "yes",
 "score": 88,
 "category": "Category 4 - On-Call Tree Services",
 "primary_reason": "Title is a near-exact match to
 multiple LGS won contracts ('On-Call Tree
 Trimming Services', '...Removal, and Stump
 Grinding').",
 "service_match": "core",
 "scale_match": "above_floor",
 "buyer_match": "core",
 "red_flags": ["out_of_core_state_SC"],
 "fit_signals": [
 "on-call tree trimming/removal/stump grinding
 is a verbatim Category 4 pattern"
 ],
 "kansas_city_risk": false,
 "thin_description_pull_full_bid": true,
 "elaboration": "Default yes on title strength
 alone per the operational thin-description
 rule."
}`],notes:["thin_description_pull_full_bid: true is the operator's cue to go register at NAPC and pull the real document. On this portal that flag is close to permanent, because the teaser is all there is."],tables:[]}],notes:[],then:"everything is copied into tonight's dated folder"},{n:"8",title:"Compile the archive, and count honestly",who:"data/napc/scripts/compile_insights.py",summary:["Carryover and new triage are merged into one set of 1,490 decisions. The snapshot and the whole judge file are copied into daily/2026-07-28/. Then the counts are written.","Before writing, a safety check tries to tie every verdict row back to a real bid in tonight's snapshot. A row it can tie gets a durable bid_key and loses its position number. A row it cannot tie is kept untouched and counted. Tonight it could tie 40 and could not tie 974."],cells:[{label:"Out · data/napc/daily/2026-07-28/",paths:[],blocks:[`{
 "snapshot_total": 1490,
 "new_since_last_archive": 1341,
 "triage": {"open": 40, "skip": 1450, "total": 1490},
 "scoring": {"yes": 309, "maybe": 261,
 "no": 444, "total": 1014},
 "pass2_streams": {"new_this_snapshot": 40,
 "carried_forward_still_open": 974,
 "opens_awaiting_verdict": 0},
 "verdicts_unresolved": 974,
 "generated_at": "2026-07-28T18:42:46.921987+00:00"
}`],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","1,490 rows, the snapshot copied whole","1.18 MB"]},{header:!1,cells:["triage.json","1,490 decisions, 149 of them carried","0.20 MB"]},{header:!1,cells:["verdicts.json","1,014 rows, the judge file copied whole","1.06 MB"]},{header:!1,cells:["stats.json","the counts","2,141 bytes"]},{header:!1,cells:["report.md","the human summary","124 KB"]}]]},{label:"Real record, the keys the check touched Bid C · tied to a bid",paths:[],blocks:[`{
 "bid_id": "262535b9c271b3b1",
 "would_lgs_bid": "yes",
 "score": 88,
 "bid_key": "napc:262535b9c271b3b1",
 "_first_judged": "2026-07-28"
}`,`{
 "idx": 187,
 "bid_id": "6efab12878a59529",
 "would_lgs_bid": "yes",
 "score": 95,
 "category": "Cat 1 disaster debris removal &
 recovery",
 "primary_reason": "Verbatim Cat 1 — disaster debris
 removal and recovery RFP. FL core state,
 exact LGS shape.",
 "title": "Disaster Debris Removal and
 Recovery (RFP)",
 "scope": "Provide disaster debris removal &
 recovery services.",
 "state": "FL",
 "seen_on_portals": ["floridabids.net",
 "environmentalbids.link"],
 "verdict": "yes",
 "lgs_score": 95,
 "_first_judged": "2026-07-28"
}`],notes:["Two tells. It kept idx: 187 and got no bid_key, so the check refused it. And it carries the answer twice, under would_lgs_bid/score and again under verdict/lgs_score. That second naming is a legacy spelling that live NAPC rows still carry."],tables:[]}],notes:[`974 refused is not 974 broken. The check exists because NAPC verdict rows used to be matched by position, and a stale position points at the wrong bid. The comment in scripts/normalize.py:427 names this portal directly: "that is not hypothetical, it is what napc's archived verdicts show (948 of 967 disagree with the bid at their own index)." So the check refuses to guess rather than guessing wrong. Nothing is dropped, the count is published in stats.json, and the rows still join downstream on their own bid_id. On this portal it will refuse most rows every night, because most rows describe bids that have rotated off the listing.`,"The judge does not send a title back. Bid C's archived verdict has no title, state or scope at all. The report fills those in from the snapshot after verdicts.json is written, deliberately, so the archive keeps exactly what the judge returned. Bid B has them because it was judged on an older path that echoed them."],then:"the portal's own night is over; the shared machinery starts"},{n:"9",title:"Carry forward: registered, and it does nothing here",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:["The registry says NAPC uses the shared safety net that rescues yesterday's scores. It runs. It rescues nothing, because stage 7 already merged every prior score into the judge file and stage 8 copied the lot into tonight's folder.","It is not harmful. It checks before it acts and finds everything already present. But the registry value oversells what this phase does for NAPC."],cells:[{label:"Real record · data/napc/daily/2026-07-28/_carryforward_audit.json · 429 bytes",paths:[],blocks:[`{
 "portal": "napc",
 "ok": true,
 "skipped": false,
 "today": "2026-07-28",
 "prior_date_used": "2026-07-24",
 "today_new_judged": 1014,
 "carried_forward": 0,
 "carried_forward_not_in_today_snapshot": 0,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 984,
 "dropped_closed_award": 0,
 "final_total": 1014,
 "final_yes": 309,
 "final_maybe": 261,
 "final_no": 444,
 "max_age_days": 90
}`],notes:[`Two things follow from carried_forward: 0. First, the 90 day age cap that would eventually retire a stale score never fires on this portal, because the cap only applies on the carry path. Nothing else retires a NAPC verdict either, since the judge file is never pruned. Second, this phase stamps _first_judged onto any row that does not already have one, and NAPC's copied-forward rows never have one. So every one of tonight's 1,014 rows is stamped "2026-07-28", including Bid B, whose real first judgment sits in data/napc/daily/2026-05-25/verdicts.json. The stamp is wrong by 64 days and it is currently harmless, because the only reader that would act on it is the age cap that never runs here.`],tables:[]}],notes:[],then:"the ledger, the report and the board fixtures are rebuilt"},{n:"10",title:"Ledger, report, board fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared scripts turn the dated folder into things people read. The ledger walks every NAPC archive ever written and dedupes. The report writer throws away the NAPC-shaped report and re-renders it in the layout every portal shares. The fixture dump builds the cards PortalPro displays.","All three inherit NAPC's two blanks. Rows render with an empty buyer cell and an empty close cell, because there is nothing to put there."],cells:[{label:"What each produced",paths:[],blocks:[],notes:['Nothing NAPC ever gets archived. The ledger splits live from finished by close date, and NAPC has no close dates. So all 570 sit in the live list forever and the archived list is empty. The 261 MAYBE verdicts never appear at all: the fixture takes only "yes", and all 309 NAPC cards are "yes". Zero of the 309 have a buyer, zero have a due date.'],tables:[[{header:!0,cells:["Output","NAPC's share"]},{header:!1,cells:["data/portals/cumulative-yes.json","570 live, 0 archived"]},{header:!1,cells:["data/napc/daily/2026-07-28/report.md","124 KB, rewritten in the shared layout"]},{header:!1,cells:["PortalPro/src/fixtures/portal-bids.json","309 of 1,470 cards"]},{header:!1,cells:["PortalPro/src/fixtures/activity-matrix.json","one cell per NAPC day"]}]]},{label:"Real record Bid B in the ledger",paths:[],blocks:[`{
 "portal": "napc",
 "bid_id": "6efab12878a59529",
 "title": "Disaster Debris Removal and
 Recovery (RFP)",
 "buyer": "?",
 "state": "FL",
 "score": 95,
 "verdict": "yes",
 "category": "Cat 1 disaster debris removal &
 recovery",
 "flags": ["thin_description_pull_full_bid"],
 "close_date": "",
 "first_seen": "2026-05-25",
 "last_seen": "2026-07-28",
 "runs_seen": 43,
 "_first_judged": null
}`],notes:["The ledger gets it right. It dates the bid from the first archive folder it appeared in, 25 May, and has seen it on 43 runs. Its _first_judged is null because the 25 May archive predates that field. Tonight's archive says 2026-07-28 for the same bid. Two files, same bid, different stories."],tables:[]}],notes:[],then:"bids stop being NAPC files and become rows on the shared board"},{n:"11",title:"Onto the shared board, and into clusters",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → apply_llm_dedup.py → enrichment",summary:["The YES cards are pushed into the shared bids table and grouped with matching bids from other portals, so one job advertised in three places becomes one row for the operator.",`NAPC is marked an aggregator, and the grouping code throws away any buyer that is blank or "?". So NAPC can never name a group's buyer. That is correct here. It has no buyer to give.`],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"309 napc cards"},{path:"data/napc/daily/2026-07-28/stats.json",size:"the run counts"},{path:"supabase.bids · supabase.clusters · supabase.sweep_runs",size:"upsert, then a cluster id patched back"}],blocks:[],notes:[`The unstable key costs real money here. A bid's id changes when its posted date or winning site changes, so the shared table cannot hold a dedup decision about a NAPC bid from one day to the next. The pairing has to be re-judged. A blank buyer also splits a NAPC bid into a group of its own until a language model draws a "same" line to bridge it, and a blank due date means a NAPC-only group carries no deadline.`],tables:[]},{label:"Real card Bid C on the board",paths:[],blocks:[`{
 "id": "708ff186c5f67337",
 "portal": "napc",
 "portal_label": "NAPC",
 "source_bid_id": "262535b9c271b3b1",
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "buyer": "?",
 "state": "SC",
 "solicitation_no": null,
 "federal": false,
 "score": 88,
 "verdict": "yes",
 "description": "Provide on-call tree trimming,
 removal & stump grinding services.",
 "due_date": "",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": ["out_of_core_state_SC"],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:['Buyer "?", due date empty, no contact, no documents. That card is the honest shape of a NAPC bid on the board, and it is why the operator is told to go pull the real document.'],tables:[]}],notes:[],then:"the board tries to read the documents, and finds a paywall"},{n:"12",title:"Documents and requirements: the wall, written down",who:"2.87 · extract_doc_text.py · requirements-extractor · publish_doc_gaps.py",summary:["This phase reads each group's documents and pulls out what a bidder must do. A NAPC group has no documents, so instead of leaving a blank the system writes a reason: NAPC charges for them.","Two walls are registered for this portal, both under the same code."],cells:[{label:"Real records · scripts/gap_reasons.py:41-45 · published to supabase.portal_field_walls",paths:[],blocks:[`("napc", "documents"): ("requires_payment",
 "NAPC publishes public teasers only — the full RFP and documents are behind "
 "NAPC's paid vendor registration."),
("napc", "contact"): ("requires_payment",
 "The buyer contact is behind NAPC's paid vendor registration."),`],notes:["One thing here does not add up, and disk cannot settle it. If documents are behind a paywall, no NAPC card should have any. Twenty-five of the 309 do. The flag is set by looking the bid up in the shared document table at scripts/dump_yes_for_portalpro.py:419, so those rows exist somewhere in the board database. One of them is 7262e9df20c343e2, a TxDOT tree and brush contract from texasbids.net. Where those documents came from is not answerable from the files in this repo. It is recorded here as an open question, not explained away."],tables:[]}],notes:[],then:"anything that changed gets re-grouped"},{n:"13",title:"The second dedup pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["After enrichment fills in buyers and deadlines, pairs whose evidence changed are re-checked. NAPC gains nothing from this pass. Its registry entry lists no enrichment pass, and there is no NAPC handler in the enrichment code, so no NAPC bid's buyer or deadline ever changes and its evidence never moves.","The pass runs. For this portal it is a repeat of the first one."],cells:[{label:"In → Out",paths:[{path:"supabase.clusters · supabase.dedup_adjudications",size:"pairs whose evidence changed"},{path:"data/portals/llm-dedup-candidates.json",size:"the pairs to re-judge"}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed since last time, and did every portal finish?"},{n:"14",title:"Watch, mail, and the health check",who:"2.88 · watch_list_signals.py · new_bids_email.py · pipeline_sentinel.py",summary:["The operator gets an email of tonight's new YES and MAYBE groups and of any change on a tracked bid. Then a check confirms every portal actually finished every phase.","NAPC's watch mode is none. There is nothing to watch: a NAPC listing row carries no status and no addendum counter, so there is no signal to compare against yesterday."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["List-change watcher","nothing to do here. No status or addendum field exists on a NAPC row"]},{header:!1,cells:["Page-text re-capture","not wired for NAPC; the teaser is the page"]},{header:!1,cells:["New-bid and deadline emails","silently do nothing until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Health check","reads data/napc/daily/2026-07-28/stats.json and verdicts.json, writes data/portals/sentinel.json; exits 1 if any portal is red"]}]]}],notes:[],then:null}],l=[{heading:"What closes the night",tables:[[{header:!0,cells:["Phase","What it does with NAPC","Where it lands"]},{header:!1,cells:["2.89 bid packs","renders one folder per keyed group; a NAPC-only pack is a title and a one-line scope, no documents","data/bidpacks/{pack_key}/, data/bidpacks/packs-index.json"]},{header:!1,cells:["2.9-2.96 boards","reads data/napc/daily/*/stats.json into the portal-by-day matrix and the overlap sheet","data/portals/metrics.json, monitor.html, overview.html"]},{header:!1,cells:["P3 roll-up","the orchestrator reads tonight's stats, verdicts and triage straight off disk and folds NAPC into one cross-portal summary","data/portals/daily/2026-07-28/roll-up.md"]}]],paragraphs:[]},{heading:"Where the map is out of date",tables:[[{header:!0,cells:["What the map says","What is on disk"]},{header:!1,cells:["Stage 9 describes compile as a merge and a count, with no safety check","The whole tie-back check is missing from the map. compile_insights.py imports it at line 15, calls it at line 44, and publishes verdicts_unresolved at line 95. It refused 974 rows tonight. This is the largest gap between map and code."]},{header:!1,cells:["Two failure notes say prep_bids.py and compile_insights.py use a bare local date and cannot honour a pinned run date","Both now import rundate.today_local at prep_bids.py:28 and :32, and at compile_insights.py:16 and :22, with a comment naming the midnight-crossing bug they fixed. Those two notes are stale, and the map's line citations for compile are shifted by the added code."]},{header:!1,cells:["Volume figures throughout: 1,512 unique, 1,377 new, 19 judged, 984 verdicts","Those are the 24 July run. This page is anchored to 28 July: 1,490 unique, 1,341 new, 30 judged, 1,014 verdicts. The shape holds. The numbers do not."]}]],paragraphs:["The stage model at docs/portal-dataflow/napc.md is the baseline for this page. Three parts of it no longer match the files. The files win."]},{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Pagination never fires. Twenty bids per site is the ceiling.","Measured again this run across the 113 per-site files: pages read was 2 on 108 sites, 1 on one, 0 on four, never 3; 100 sites returned exactly 20 and none returned more. Whatever is on page two of a NAPC site does not exist for us."]},{header:!1,cells:["A bid's key is a hash of site, title and posted date.","Bump the date or win the deduplication on a different site and the same bid re-keys and looks new. Over the four days to 28 July, 188 titles survived but only 149 keys. The shared board also cannot hold a dedup decision on a NAPC bid across days."]},{header:!1,cells:['Buyer is the literal "?" and due date is "", hardcoded.',"Both are behind NAPC's paid registration. All 1,490 snapshot rows and all 309 board cards carry them empty. NAPC can never name a group's buyer, and a NAPC-only group has no deadline."]},{header:!1,cells:["No due date means nothing can ever finish.","The cumulative ledger splits live from finished by close date, so all 570 NAPC YES bids sit in the live list and the archived list holds zero."]},{header:!1,cells:["The judge file is never pruned.",`1,014 verdicts on file, 30 judged tonight, 974 for bids not in tonight's listing. Anyone reading scoring.yes: 309 as "tonight's YES count" is reading a standing ledger.`]},{header:!1,cells:["974 of 1,014 verdicts cannot be tied to a bid in tonight's snapshot.","Expected, published in stats.json as verdicts_unresolved, and nothing is dropped. It is the honest cost of a ledger that outlives the listing."]},{header:!1,cells:["_first_judged says today, on every row, every night.","Bid B is stamped 2026-07-28 and was actually first judged on 2026-05-25. Harmless right now, because the only code that acts on it is the 90 day age cap inside carry-forward, and carry-forward carries nothing here. It would silently defeat that cap if the carry path ever engaged."]},{header:!1,cells:["MAYBE never reaches the board.",'261 maybe verdicts tonight. The fixture takes only "yes", so all 309 NAPC cards are yes and the maybes are invisible to the operator.']},{header:!1,cells:["Verdict rows carry two spellings of the same answer.","Older rows hold would_lgs_bid/score/primary_reason and again verdict/lgs_score/reasoning. Readers handle both. Which step wrote the legacy pair into runs/ is still unattributed."]},{header:!1,cells:["Twenty-five of 309 board cards say they have documents.","Against a registered wall of requires_payment. Real rows in the shared document table, source unexplained by anything in this repo. Open."]},{header:!1,cells:["data/napc/runs/ is mostly debris.","Around a hundred files there have no writer in any script or runbook: hand-repaired agent output, dated snapshots, backup copies, one-off helper scripts. Checked by modification date across every file and subfolder, this run wrote exactly seven files at the top level of runs/ plus the six triage batch files. Nothing else in that folder, of any type, was touched. Reading any of it as current is a mistake."]},{header:!1,cells:["The teaser is the only evidence, at every stage.","No detail page fetch, no enrichment pass, no watch recipe. Every score on this portal comes from a title and one sentence, which is why thin_description_pull_full_bid is close to permanent and the operator's next step is always to go get the real document."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to stats.json, _funnel.json, tonight's judge output in _new_judge_2026-07-28.json, a row count, or a byte size. Baseline map: docs/portal-dataflow/napc.md, cited to file and line, and corrected above where the files disagree with it. Companion pages: Portal pedia · 01 (BidNet), 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to stats.json, _funnel.json, tonight's judge output in _new_judge_2026-07-28.json, a row count, or a byte size. Baseline map: docs/portal-dataflow/napc.md, cited to file and line, and corrected above where the files disagree with it. Companion pages: Portal pedia · 01 (BidNet), 02 (DemandStar).",c="docs/portal-dataflow/pedia-napc.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:r,funnel_note:i,legend:o,stages:d,sections:l,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,r as funnel,i as funnel_note,s as headline,n as lede,o as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
