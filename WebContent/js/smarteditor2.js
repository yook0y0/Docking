/**    * SmartEditor2 NHN_Library:SE2.3.10.O11036:SmartEditor2.0-OpenSource    * @version 11036    */    var nSE2Version = 11036;if(typeof window.nhn=='undefined') window.nhn = {};

/**
 * @fileOverview This file contains a function that takes care of various operations related to find and replace
 * @name N_FindReplace.js
 */
nhn.FindReplace = jindo.$Class({
	sKeyword : "",
	window : null,
	document : null,
	bBrowserSupported : false,

	// true if End Of Contents is reached during last execution of find
	bEOC : false,
	
	$init : function(win){
		this.sInlineContainer = "SPAN|B|U|I|S|STRIKE";
		this.rxInlineContainer = new RegExp("^("+this.sInlineContainer+")$");

		this.window = win;
		this.document = this.window.document;

		if(this.document.domain != this.document.location.hostname){
			var oAgentInfo = jindo.$Agent();
			var oNavigatorInfo = oAgentInfo.navigator();

			if(oNavigatorInfo.firefox && oNavigatorInfo.version < 3){
				this.bBrowserSupported = false;
				this.find = function(){return 3};
				return;
			}
		}

		this.bBrowserSupported = true;
	},

	/**
	 * ÇØ´ç³ëµåÀÇ ´ÙÀ½ element¸¦ Ã£´Â´Ù.
	 * Ã£À» ¼ö ¾ø°Å³ª body ÀÌ¸é body¸¦ ¸®ÅÏ 
	 */
	_findNextElement : function(elNode){
		if(!elNode || elNode.tagName == "BODY"){
			return null;
		}
		var elNext = elNode.nextSibling;
		if(elNext){
			return (elNext.nodeType == 1 ? elNext : this._findNextElement(elNext));
		}else{
			return this._findNextElement(elNode.parentNode);
		}
	},

	// 0: found
	// 1: not found
	// 2: keyword required
	// 3: browser not supported
	find : function(sKeyword, bCaseMatch, bBackwards, bWholeWord){
		var bSearchResult, bFreshSearch;

		this.window.focus();
		if(!sKeyword) return 2;

		// try find starting from current cursor position
		this.bEOC = false;
		bSearchResult = this.findNext(sKeyword, bCaseMatch, bBackwards, bWholeWord);
		if(bSearchResult) return 0;

		// end of the contents could have been reached so search again from the beginning
		this.bEOC = true;
		bSearchResult = this.findNew(sKeyword, bCaseMatch, bBackwards, bWholeWord);

		if(bSearchResult) return 0;
		
		return 1;
	},
	
	findNew : function (sKeyword, bCaseMatch, bBackwards, bWholeWord){
		this.findReset();
		return this.findNext(sKeyword, bCaseMatch, bBackwards, bWholeWord);
	},
	
	findNext : function(sKeyword, bCaseMatch, bBackwards, bWholeWord){
		var bSearchResult;
		bCaseMatch = bCaseMatch || false;
		bWholeWord = bWholeWord || false;
		bBackwards = bBackwards || false;

		if(this.window.find){
			var bWrapAround = false;
			return this.window.find(sKeyword, bCaseMatch, bBackwards, bWrapAround, bWholeWord);
		}
		
		// IE solution
		if(this.document.body.createTextRange){
			try{
				var iOption = 0;
				if(bBackwards) iOption += 1;
				if(bWholeWord) iOption += 2;
				if(bCaseMatch) iOption += 4;
				
				this.window.focus();
				if(this.document.selection){
					this._range = this.document.selection.createRangeCollection().item(0);
					this._range.collapse(false);
				}else{	// [SMARTEDITORSUS-1528] IE11ÀÎ °æ¿ì
					this._range = this.document.body.createTextRange();
					var elNext = this._findNextElement(this.window.getSelection().focusNode);
					if(elNext){
						this._range.moveToElementText(elNext);
					}
				}
				bSearchResult = this._range.findText(sKeyword, 1, iOption);
	
				this._range.select();
				
				return bSearchResult;
			}catch(e){
				return false;
			}
		}
		
		return false;
	},
	
	findReset : function() {
		if (this.window.find){
			this.window.getSelection().removeAllRanges();
			return;
		}

		// IE solution
		if(this.document.body.createTextRange){
			if(this.document.selection){
				this._range = this.document.body.createTextRange();
				this._range.collapse(true);
				this._range.select();
			}else if(this.window.getSelection){ // [SMARTEDITORSUS-1528] IE11ÀÎ °æ¿ì
				var oSelection = this.window.getSelection();
				oSelection.removeAllRanges();
				oSelection.selectAllChildren(this.document.body);
				oSelection.collapseToStart();
			}
		}
	},
	
	// 0: replaced & next word found
	// 1: replaced & next word not found
	// 2: not replaced & next word found
	// 3: not replaced & next word not found
	// 4: sOriginalWord required
	replace : function(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord){
		return this._replace(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord);
	},

	/**
	 * [SMARTEDITORSUS-1591] Å©·Ò¿¡¼­ replaceAll ½Ã selection À» »õ·Î ¸¸µé¸é Ã¹¹øÂ° ´Ü¾î°¡ »èÁ¦µÇÁö ¾Ê°í ³²´Â ¹®Á¦°¡ ÀÖ¾î¼­ 
	 * selection °´Ã¼¸¦ ¹Þ¾Æ¼­ »ç¿ëÇÒ ¼ö ÀÖµµ·Ï private ¸Þ¼­µå Ãß°¡
	 * TODO: ±Ùº»ÀûÀ¸·Î HuskyRange ¸¦ ¸®ÆÑÅä¸µÇÒ ÇÊ¿ä°¡ ÀÖÀ½
	 */
	_replace : function(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord, oSelection){
		if(!sOriginalWord) return 4;

		oSelection = oSelection || new nhn.HuskyRange(this.window);
		oSelection.setFromSelection();
		
		bCaseMatch = bCaseMatch || false;
		var bMatch, selectedText = oSelection.toString();
		if(bCaseMatch)
			bMatch = (selectedText == sOriginalWord);
		else
			bMatch = (selectedText.toLowerCase() == sOriginalWord.toLowerCase());
		
		if(!bMatch)
			return this.find(sOriginalWord, bCaseMatch, bBackwards, bWholeWord)+2;
		
		if(typeof Replacement == "function"){
			// the returned oSelection must contain the replacement 
			oSelection = Replacement(oSelection);
		}else{
			oSelection.pasteText(Replacement);
		}
		
		// force it to find the NEXT occurance of sOriginalWord
		oSelection.select();
		
		return this.find(sOriginalWord, bCaseMatch, bBackwards, bWholeWord);
	},

	// returns number of replaced words
	// -1 : if original word is not given
	replaceAll : function(sOriginalWord, Replacement, bCaseMatch, bWholeWord){
		if(!sOriginalWord) return -1;
		
		var bBackwards = false;

		var iReplaceResult;
		var iResult = 0;
		var win = this.window;

		if(this.find(sOriginalWord, bCaseMatch, bBackwards, bWholeWord) !== 0){
			return iResult;
		}
		
		var oSelection = new nhn.HuskyRange(this.window);
		oSelection.setFromSelection();

		// ½ÃÀÛÁ¡ÀÇ ºÏ¸¶Å©°¡ Áö¿öÁö¸é¼­ ½ÃÀÛÁ¡À» Áö³ª¼­ replace°¡ µÇ´Â Çö»ó ¹æÁö¿ë
		// Ã¹ ´Ü¾î ¾ÕÂÊ¿¡ Æ¯¼ö ¹®ÀÚ »ðÀÔ ÇØ¼­, replace¿Í ÇÔ²² ºÏ¸¶Å©°¡ »ç¶óÁö´Â °Í ¹æÁö
		oSelection.collapseToStart();
		var oTmpNode = this.window.document.createElement("SPAN");
		oTmpNode.innerHTML = unescape("%uFEFF");
		oSelection.insertNode(oTmpNode);
		oSelection.select();
		var sBookmark = oSelection.placeStringBookmark();
		
		this.bEOC = false;
		while(!this.bEOC){
			iReplaceResult = this._replace(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord, oSelection);
			if(iReplaceResult == 0 || iReplaceResult == 1){
				iResult++;
			}
		}

		var startingPointReached = function(){
			var oCurSelection = new nhn.HuskyRange(win);
			oCurSelection.setFromSelection();

			oSelection.moveToBookmark(sBookmark);
			var pos = oSelection.compareBoundaryPoints(nhn.W3CDOMRange.START_TO_END, oCurSelection);

			if(pos == 1) return false;
			return true;
		};

		iReplaceResult = 0;
		this.bEOC = false;
		while(!startingPointReached() && iReplaceResult == 0 && !this.bEOC){
			iReplaceResult = this._replace(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord, oSelection);
			if(iReplaceResult == 0 || iReplaceResult == 1){
				iResult++;
			}
		}
		
		oSelection.moveToBookmark(sBookmark);
		oSelection.deleteContents();	// [SMARTEDITORSUS-1591] Å©·Ò¿¡¼­ Ã¹¹øÂ° ´Ü¾î°¡ »èÁ¦µÇÁö ¾Ê´Â °æ¿ì°¡ ÀÖÀ¸¹Ç·Î select()¸Þ¼­µå´ë½Å deleteContents() ¸Þ¼­µå¸¦ È£ÃâÇÑ´Ù.
		oSelection.removeStringBookmark(sBookmark);

		// setTimeout ¾øÀÌ ¹Ù·Î Áö¿ì¸é IE8 ºê¶ó¿ìÀú°¡ ºó¹øÇÏ°Ô Á×¾î¹ö¸²
		setTimeout(function(){
			oTmpNode.parentNode.removeChild(oTmpNode);
		}, 0);
		
		return iResult;
	},

	_isBlankTextNode : function(oNode){
		if(oNode.nodeType == 3 && oNode.nodeValue == ""){return true;}
		return false;
	},

	_getNextNode : function(elNode, bDisconnected){
		if(!elNode || elNode.tagName == "BODY"){
			return {elNextNode: null, bDisconnected: false};
		}

		if(elNode.nextSibling){
			elNode = elNode.nextSibling;
			while(elNode.firstChild){
				if(elNode.tagName && !this.rxInlineContainer.test(elNode.tagName)){
					bDisconnected = true;
				}
				elNode = elNode.firstChild;
			}
			return {elNextNode: elNode, bDisconnected: bDisconnected};
		}
		
		return this._getNextNode(nhn.DOMFix.parentNode(elNode), bDisconnected);
	},

	_getNextTextNode : function(elNode, bDisconnected){
		var htNextNode, elNode;
		while(true){
			htNextNode = this._getNextNode(elNode, bDisconnected);
			elNode = htNextNode.elNextNode;
			bDisconnected = htNextNode.bDisconnected;

			if(elNode && elNode.nodeType != 3 && !this.rxInlineContainer.test(elNode.tagName)){
				bDisconnected = true;
			}
			
			if(!elNode || (elNode.nodeType==3 && !this._isBlankTextNode(elNode))){
				break;
			}
		}
	
		return {elNextText: elNode, bDisconnected: bDisconnected};
	},
	
	_getFirstTextNode : function(){
		// ¹®¼­¿¡¼­ Á¦ÀÏ ¾ÕÂÊ¿¡ À§Ä¡ÇÑ ¾Æ¹« ³ëµå Ã£±â
		var elFirstNode = this.document.body.firstChild;
		while(!!elFirstNode && elFirstNode.firstChild){
			elFirstNode = elFirstNode.firstChild;
		}
		
		// ¹®¼­¿¡ ¾Æ¹« ³ëµåµµ ¾øÀ½
		if(!elFirstNode){
			return null;
		}
		
		// Ã³À½ ³ëµå°¡ ÅØ½ºÆ® ³ëµå°¡ ¾Æ´Ï°Å³ª bogus ³ëµå¶ó¸é ´ÙÀ½ ÅØ½ºÆ® ³ëµå¸¦ Ã£À½
		if(elFirstNode.nodeType != 3 || this._isBlankTextNode(elFirstNode)){
			var htTmp = this._getNextTextNode(elFirstNode, false);
			elFirstNode = htTmp.elNextText;
		}
		
		return elFirstNode;
	},
	
	_addToTextMap : function(elNode, aTexts, aElTexts, nLen){
		var nStartPos = aTexts[nLen].length;
		for(var i=0, nTo=elNode.nodeValue.length; i<nTo; i++){
			aElTexts[nLen][nStartPos+i] = [elNode, i];
		}
		aTexts[nLen] += elNode.nodeValue;
	},
	
	_createTextMap : function(){
		var aTexts = [];
		var aElTexts = [];
		var nLen=-1;
		
		var elNode = this._getFirstTextNode();
		var htNextNode = {elNextText: elNode, bDisconnected: true};
		while(elNode){
			if(htNextNode.bDisconnected){
				nLen++;
				
				aTexts[nLen] = "";
				aElTexts[nLen] = [];
			}
			this._addToTextMap(htNextNode.elNextText, aTexts, aElTexts, nLen);
			
			htNextNode = this._getNextTextNode(elNode, false);
			elNode = htNextNode.elNextText;
		}

		return {aTexts: aTexts, aElTexts: aElTexts};
	},
	
	replaceAll_js : function(sOriginalWord, Replacement, bCaseMatch, bWholeWord){
		try{
			var t0 = new Date();
			
			var htTmp = this._createTextMap();
			
			var t1 = new Date();
			var aTexts = htTmp.aTexts;
			var aElTexts = htTmp.aElTexts;
	
//			console.log(sOriginalWord);
//			console.log(aTexts);
//			console.log(aElTexts);

			var nMatchCnt = 0;
			
			var nOriginLen = sOriginalWord.length;

			// ´Ü¾î ÇÑ°³¾¿ ºñ±³
			for(var i=0, niLen=aTexts.length; i<niLen; i++){
				var sText = aTexts[i];
				// ´Ü¾î ¾È¿¡ ÇÑ±ÛÀÚ¾¿ ºñ±³
				//for(var j=0, njLen=sText.length - nOriginLen; j<njLen; j++){
				for(var j=sText.length-nOriginLen; j>=0; j--){
					var sTmp = sText.substring(j, j+nOriginLen);
					if(bWholeWord && 
						(j > 0 && sText.charAt(j-1).match(/[a-zA-Z°¡-ÆR]/))
					){
						continue;
					}

					if(sTmp == sOriginalWord){
						nMatchCnt++;

						var oSelection = new nhn.HuskyRange(this.window);
						// ¸¶Áö¸· ±ÛÀÚÀÇ µÞºÎºÐ Ã³¸®
						var elContainer, nOffset;
						if(j+nOriginLen < aElTexts[i].length){
							elContainer = aElTexts[i][j+nOriginLen][0];
							nOffset = aElTexts[i][j+nOriginLen][1];
						}else{
							elContainer = aElTexts[i][j+nOriginLen-1][0];
							nOffset = aElTexts[i][j+nOriginLen-1][1]+1;
						}
						oSelection.setEnd(elContainer, nOffset, true, true);
						oSelection.setStart(aElTexts[i][j][0], aElTexts[i][j][1], true);
						
						if(typeof Replacement == "function"){
							// the returned oSelection must contain the replacement 
							oSelection = Replacement(oSelection);
						}else{
							oSelection.pasteText(Replacement);
						}

						j -= nOriginLen;
					}
					continue;
				}
			}
			/*
			var t2 = new Date();
			console.log("OK");
			console.log(sOriginalWord);
			console.log("MC:"+(t1-t0));
			console.log("RP:"+(t2-t1));
			*/

			return nMatchCnt;
		}catch(e){
			/*
			console.log("ERROR");
			console.log(sOriginalWord);
			console.log(new Date()-t0);
			*/
			return nMatchCnt;
		}
	}
});
// "padding", "backgroundcolor", "border", "borderTop", "borderRight", "borderBottom", "borderLeft", "color", "textAlign", "fontWeight"
nhn.husky.SE2M_TableTemplate = [
	{},
/*
	// 0
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		htTableStyle : {
			border				: "1px dashed #666666",
			borderRight			: "0",
			borderBottom		: "0"
		},
		aRowStyle : [
			{
				padding				: "3px 0 2px 0",
				border				: "1px dashed #666666",
				borderTop			: "0",
				borderLeft			: "0"
			}
		]
	},
	
	// 1
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		htTableStyle : {
			border				: "1px solid #c7c7c7",
			borderRight			: "0",
			borderBottom		: "0"
		},
		aRowStyle : [
			{
				padding				: "3px 0 2px 0",
				border				: "1px solid #c7c7c7",
				borderTop			: "0",
				borderLeft			: "0"
			}
		]
	},
	
	// 2
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			border				: "1px solid #c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "2px 0 1px 0",
				border				: "1px solid #c7c7c7"
			}
		]
	},
	
	// 3
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			border				: "1px double #c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "1px 0 0",
				border				: "3px double #c7c7c7"
			}
		]
	},

	// 4
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			borderWidth			: "2px 1px 1px 2px",
			borderStyle			: "solid",
			borderColor			: "#c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "2px 0 0",
				borderWidth			: "1px 2px 2px 1px",
				borderStyle			: "solid",
				borderColor			: "#c7c7c7"
			}
		]
	},

	// 5
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			borderWidth			: "1px 2px 2px 1px",
			borderStyle			: "solid",
			borderColor			: "#c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "1px 0 0",
				borderWidth			: "2px 1px 1px 2px",
				borderStyle			: "solid",
				borderColor			: "#c7c7c7"
			}
		]
	},
*/
	// Black theme ======================================================
	
	// 6
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#666666"
			}
		]
	},

	// 7
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#666666"
			},
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#f3f3f3",
				color				: "#666666"
			}
		]
	},

	// 8
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		htTableStyle : {
			backgroundColor		: "#ffffff",
			borderTop			: "1px solid #c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #c7c7c7",
				backgroundColor		: "#ffffff",
				color				: "#666666"
			},
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #c7c7c7",
				backgroundColor		: "#f3f3f3",
				color				: "#666666"
			}
		]
	},

	// 9
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		htTableStyle : {
			border				: "1px solid #c7c7c7"
		},
		ht1stRowStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#f3f3f3",
			color				: "#666666",
			borderRight			: "1px solid #e7e7e7",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				borderTop			: "1px solid #e7e7e7",
				borderRight			: "1px solid #e7e7e7",
				color				: "#666666"
			}
		]
	},

	// 10
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#c7c7c7"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#f8f8f8",
				color				: "#666666"
			},
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ebebeb",
				color				: "#666666"
			}
		]
	},

	// 11
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		ht1stRowStyle : {
			padding				: "3px 4px 2px",
			borderTop			: "1px solid #000000",
			borderBottom		: "1px solid #000000",
			backgroundColor		: "#333333",
			color				: "#ffffff",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #ebebeb",
				backgroundColor		: "#ffffff",
				color				: "#666666"
			},
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #ebebeb",
				backgroundColor		: "#f8f8f8",
				color				: "#666666"
			}
		]
	},

	// 12
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#c7c7c7"
		},
		ht1stRowStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#333333",
			color				: "#ffffff",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		ht1stColumnStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#f8f8f8",
			color				: "#666666",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#666666"
			}
		]
	},

	// 13
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#c7c7c7"
		},
		ht1stColumnStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#333333",
			color				: "#ffffff",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#666666"
			}
		]
	},
	
	// Blue theme ======================================================
	
	// 14
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#a6bcd1"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#3d76ab"
			}
		]
	},

	// 15
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#a6bcd1"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#3d76ab"
			},
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#f6f8fa",
				color				: "#3d76ab"
			}
		]
	},

	// 16
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		htTableStyle : {
			backgroundColor		: "#ffffff",
			borderTop			: "1px solid #a6bcd1"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #a6bcd1",
				backgroundColor		: "#ffffff",
				color				: "#3d76ab"
			},
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #a6bcd1",
				backgroundColor		: "#f6f8fa",
				color				: "#3d76ab"
			}
		]
	},

	// 17
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		htTableStyle : {
			border				: "1px solid #a6bcd1"
		},
		ht1stRowStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#f6f8fa",
			color				: "#3d76ab",
			borderRight			: "1px solid #e1eef7",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				borderTop			: "1px solid #e1eef7",
				borderRight			: "1px solid #e1eef7",
				color				: "#3d76ab"
			}
		]
	},

	// 18
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#a6bcd1"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#fafbfc",
				color				: "#3d76ab"
			},
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#e6ecf2",
				color				: "#3d76ab"
			}
		]
	},

	// 19
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "0"
		},
		ht1stRowStyle : {
			padding				: "3px 4px 2px",
			borderTop			: "1px solid #466997",
			borderBottom		: "1px solid #466997",
			backgroundColor		: "#6284ab",
			color				: "#ffffff",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #ebebeb",
				backgroundColor		: "#ffffff",
				color				: "#3d76ab"
			},
			{
				padding				: "3px 4px 2px",
				borderBottom		: "1px solid #ebebeb",
				backgroundColor		: "#f6f8fa",
				color				: "#3d76ab"
			}
		]
	},

	// 20
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#a6bcd1"
		},
		ht1stRowStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#6284ab",
			color				: "#ffffff",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		ht1stColumnStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#f6f8fa",
			color				: "#3d76ab",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#3d76ab"
			}
		]
	},

	// 21
	{
		htTableProperty : {
			border		: "0",
			cellPadding	: "0",
			cellSpacing	: "1"
		},
		htTableStyle : {
			backgroundColor		: "#a6bcd1"
		},
		ht1stColumnStyle : {
			padding				: "3px 4px 2px",
			backgroundColor		: "#6284ab",
			color				: "#ffffff",
			textAlign			: "left",
			fontWeight			: "normal"
		},
		aRowStyle : [
			{
				padding				: "3px 4px 2px",
				backgroundColor		: "#ffffff",
				color				: "#3d76ab"
			}
		]
	}
];
if(typeof window.nhn=='undefined'){window.nhn = {};}
if (!nhn.husky){nhn.husky = {};}

nhn.husky.oMockDebugger = {
	log_MessageStart: function() {},
	log_MessageEnd: function() {},
	log_MessageStepStart: function() {},
	log_MessageStepEnd: function() {},
	log_CallHandlerStart: function() {},
	log_CallHandlerEnd: function() {},
	handleException: function() {},
	setApp: function() {}
};

 //{
 /**
 * @fileOverview This file contains Husky framework core
 * @name HuskyCore.js
 */
nhn.husky.HuskyCore = jindo.$Class({
	name : "HuskyCore",
	aCallerStack : null,

	$init : function(htOptions){
		this.htOptions = htOptions||{};

		if( this.htOptions.oDebugger ){
			if( !nhn.husky.HuskyCore._cores ) {
				nhn.husky.HuskyCore._cores = [];
				nhn.husky.HuskyCore.getCore = function() { 
					return nhn.husky.HuskyCore._cores; 
				};
			}
			nhn.husky.HuskyCore._cores.push(this);
			this.htOptions.oDebugger.setApp(this);
		}

		// To prevent processing a Husky message before all the plugins are registered and ready,
		// Queue up all the messages here until the application's status is changed to READY
		this.messageQueue = [];

		this.oMessageMap = {};
		this.oDisabledMessage = {};
		this.aPlugins = [];

		this.appStatus = nhn.husky.APP_STATUS.NOT_READY;
		
		this.aCallerStack = [];
		
		this._fnWaitForPluginReady = jindo.$Fn(this._waitForPluginReady, this).bind();
		
		// Register the core as a plugin so it can receive messages
		this.registerPlugin(this);
	},
	
	setDebugger: function(oDebugger) {
		this.htOptions.oDebugger = oDebugger;
		oDebugger.setApp(this);
	},
	
	exec : function(msg, args, oEvent){
		// If the application is not yet ready just queue the message
		if(this.appStatus == nhn.husky.APP_STATUS.NOT_READY){
			this.messageQueue[this.messageQueue.length] = {'msg':msg, 'args':args, 'event':oEvent};
			return true;
		}

		this.exec = this._exec;
		this.exec(msg, args, oEvent);
	},

	delayedExec : function(msg, args, nDelay, oEvent){
		var fExec = jindo.$Fn(this.exec, this).bind(msg, args, oEvent);
		setTimeout(fExec, nDelay);
	},

	_exec : function(msg, args, oEvent){
		return (this._exec = this.htOptions.oDebugger?this._execWithDebugger:this._execWithoutDebugger).call(this, msg, args, oEvent);
	},
	_execWithDebugger : function(msg, args, oEvent){
		this.htOptions.oDebugger.log_MessageStart(msg, args);
		var bResult = this._doExec(msg, args, oEvent);
		this.htOptions.oDebugger.log_MessageEnd(msg, args);
		return bResult;
	},
	_execWithoutDebugger : function(msg, args, oEvent){
		return this._doExec(msg, args, oEvent);
	},
	_doExec : function(msg, args, oEvent){
		var bContinue = false;

		if(!this.oDisabledMessage[msg]){
			var allArgs = [];
			if(args && args.length){
				var iLen = args.length;
				for(var i=0; i<iLen; i++){allArgs[i] = args[i];}
			}
			if(oEvent){allArgs[allArgs.length] = oEvent;}

			bContinue = this._execMsgStep("BEFORE", msg, allArgs);
			if(bContinue){bContinue = this._execMsgStep("ON", msg, allArgs);}
			if(bContinue){bContinue = this._execMsgStep("AFTER", msg, allArgs);}
		}

		return bContinue;
	},

	
	registerPlugin : function(oPlugin){
		if(!oPlugin){throw("An error occured in registerPlugin(): invalid plug-in");}

		oPlugin.nIdx = this.aPlugins.length;
		oPlugin.oApp = this;
		this.aPlugins[oPlugin.nIdx] = oPlugin;

		// If the plugin does not specify that it takes time to be ready, change the stauts to READY right away
		if(oPlugin.status != nhn.husky.PLUGIN_STATUS.NOT_READY){oPlugin.status = nhn.husky.PLUGIN_STATUS.READY;}

		// If run() function had been called already, need to recreate the message map
		if(this.appStatus != nhn.husky.APP_STATUS.NOT_READY){
			for(var funcName in oPlugin){
				if(funcName.match(/^\$(LOCAL|BEFORE|ON|AFTER)_/)){
					this.addToMessageMap(funcName, oPlugin);
				}
			}
		}

		this.exec("MSG_PLUGIN_REGISTERED", [oPlugin]);

		return oPlugin.nIdx;
	},

	disableMessage : function(sMessage, bDisable){this.oDisabledMessage[sMessage] = bDisable;},

	registerBrowserEvent : function(obj, sEvent, sMessage, aParams, nDelay){
		aParams = aParams || [];
		var func = (nDelay)?jindo.$Fn(this.delayedExec, this).bind(sMessage, aParams, nDelay):jindo.$Fn(this.exec, this).bind(sMessage, aParams);
		return jindo.$Fn(func, this).attach(obj, sEvent);
	},

	run : function(htOptions){
		this.htRunOptions = htOptions || {};

		// Change the status from NOT_READY to let exec to process all the way
		this._changeAppStatus(nhn.husky.APP_STATUS.WAITING_FOR_PLUGINS_READY);

		// Process all the messages in the queue
		var iQueueLength = this.messageQueue.length;
		for(var i=0; i<iQueueLength; i++){
			var curMsgAndArgs = this.messageQueue[i];
			this.exec(curMsgAndArgs.msg, curMsgAndArgs.args, curMsgAndArgs.event);
		}

		this._fnWaitForPluginReady();
	},

	acceptLocalBeforeFirstAgain : function(oPlugin, bAccept){
		// LOCAL_BEFORE_FIRST will be fired again if oPlugin._husky_bRun == false
		oPlugin._husky_bRun = !bAccept;
	},
	
	// Use this also to update the mapping
	createMessageMap : function(sMsgHandler){
		this.oMessageMap[sMsgHandler] = [];

		var nLen = this.aPlugins.length;
		for(var i=0; i<nLen; i++){this._doAddToMessageMap(sMsgHandler, this.aPlugins[i]);}
	},
	
	addToMessageMap : function(sMsgHandler, oPlugin){
		// cannot "ADD" unless the map is already created.
		// the message will be added automatically to the mapping when it is first passed anyways, so do not add now
		if(!this.oMessageMap[sMsgHandler]){return;}

		this._doAddToMessageMap(sMsgHandler, oPlugin);
	},

	_changeAppStatus : function(appStatus){
		this.appStatus = appStatus;

		// Initiate MSG_APP_READY if the application's status is being switched to READY
		if(this.appStatus == nhn.husky.APP_STATUS.READY){this.exec("MSG_APP_READY");}
	},

	
	_execMsgStep : function(sMsgStep, sMsg, args){
		return (this._execMsgStep = this.htOptions.oDebugger?this._execMsgStepWithDebugger:this._execMsgStepWithoutDebugger).call(this, sMsgStep, sMsg, args);
	},
	_execMsgStepWithDebugger : function(sMsgStep, sMsg, args){
		this.htOptions.oDebugger.log_MessageStepStart(sMsgStep, sMsg, args);
		var bStatus = this._execMsgHandler("$"+sMsgStep+"_"+sMsg, args);
		this.htOptions.oDebugger.log_MessageStepEnd(sMsgStep, sMsg, args);
		return bStatus;
	},
	_execMsgStepWithoutDebugger : function(sMsgStep, sMsg, args){
		return this._execMsgHandler ("$"+sMsgStep+"_"+sMsg, args);
	},
	_execMsgHandler : function(sMsgHandler, args){
		var i;
		if(!this.oMessageMap[sMsgHandler]){
			this.createMessageMap(sMsgHandler);
		}

		var aPlugins = this.oMessageMap[sMsgHandler];
		var iNumOfPlugins = aPlugins.length;
		
		if(iNumOfPlugins === 0){return true;}

		var bResult = true;

		// two similar codes were written twice due to the performace.
		if(sMsgHandler.match(/^\$(BEFORE|ON|AFTER)_MSG_APP_READY$/)){
			for(i=0; i<iNumOfPlugins; i++){
				if(this._execHandler(aPlugins[i], sMsgHandler, args) === false){
					bResult = false;
					break;
				}
			}
		}else{
			for(i=0; i<iNumOfPlugins; i++){
				if(!aPlugins[i]._husky_bRun){
					aPlugins[i]._husky_bRun = true;
					if(typeof aPlugins[i].$LOCAL_BEFORE_FIRST == "function" && this._execHandler(aPlugins[i], "$LOCAL_BEFORE_FIRST", [sMsgHandler, args]) === false){continue;}
				}

				if(typeof aPlugins[i].$LOCAL_BEFORE_ALL == "function"){
					if(this._execHandler(aPlugins[i], "$LOCAL_BEFORE_ALL", [sMsgHandler, args]) === false){continue;}
				}

				if(this._execHandler(aPlugins[i], sMsgHandler, args) === false){
					bResult = false;
					break;
				}
			}
		}
		
		return bResult;
	},

	
	_execHandler : function(oPlugin, sHandler, args){
		return	(this._execHandler = this.htOptions.oDebugger?this._execHandlerWithDebugger:this._execHandlerWithoutDebugger).call(this, oPlugin, sHandler, args);
	},
	_execHandlerWithDebugger : function(oPlugin, sHandler, args){
		this.htOptions.oDebugger.log_CallHandlerStart(oPlugin, sHandler, args);
		var bResult;
		try{
			this.aCallerStack.push(oPlugin);
			bResult = oPlugin[sHandler].apply(oPlugin, args);
			this.aCallerStack.pop();
		}catch(e){
			this.htOptions.oDebugger.handleException(e);
			bResult = false;
		}
		this.htOptions.oDebugger.log_CallHandlerEnd(oPlugin, sHandler, args);
		return bResult;
	},
	_execHandlerWithoutDebugger : function(oPlugin, sHandler, args){
		this.aCallerStack.push(oPlugin);
		var bResult = oPlugin[sHandler].apply(oPlugin, args);
		this.aCallerStack.pop();

		return bResult;
	},


	_doAddToMessageMap : function(sMsgHandler, oPlugin){
		if(typeof oPlugin[sMsgHandler] != "function"){return;}

		var aMap = this.oMessageMap[sMsgHandler];
		// do not add if the plugin is already in the mapping
		for(var i=0, iLen=aMap.length; i<iLen; i++){
			if(this.oMessageMap[sMsgHandler][i] == oPlugin){return;}
		}
		this.oMessageMap[sMsgHandler][i] = oPlugin;
	},

	_waitForPluginReady : function(){
		var bAllReady = true;
		for(var i=0; i<this.aPlugins.length; i++){
			if(this.aPlugins[i].status == nhn.husky.PLUGIN_STATUS.NOT_READY){
				bAllReady = false;
				break;
			}
		}
		if(bAllReady){
			this._changeAppStatus(nhn.husky.APP_STATUS.READY);
		}else{
			setTimeout(this._fnWaitForPluginReady, 100);
		}
	}
});
//}

nhn.husky.APP_STATUS = {
	'NOT_READY' : 0,
	'WAITING_FOR_PLUGINS_READY' : 1,
	'READY' : 2
};

nhn.husky.PLUGIN_STATUS = {
	'NOT_READY' : 0,
	'READY' : 1
};
if(typeof window.nhn=='undefined'){window.nhn = {};}

nhn.CurrentSelection_IE = function(){
	this.getCommonAncestorContainer = function(){
		try{
			this._oSelection = this._document.selection;
			if(this._oSelection.type == "Control"){
				return this._oSelection.createRange().item(0);
			}else{
				return this._oSelection.createRangeCollection().item(0).parentElement();
			}
		}catch(e){
			return this._document.body;
		}
	};
	
	this.isCollapsed = function(){
		this._oSelection = this._document.selection;

		return this._oSelection.type == "None";
	};
};

nhn.CurrentSelection_FF = function(){
	this.getCommonAncestorContainer = function(){
		return this._getSelection().commonAncestorContainer;
	};
	
	this.isCollapsed = function(){
		var oSelection = this._window.getSelection();
		
		if(oSelection.rangeCount<1){ return true; }
		return oSelection.getRangeAt(0).collapsed;
	};
	
	this._getSelection = function(){
		try{
			return this._window.getSelection().getRangeAt(0);
		}catch(e){
			return this._document.createRange();
		}
	};
};

nhn.CurrentSelection = new (jindo.$Class({
	$init : function(){
		var oAgentInfo = jindo.$Agent().navigator();
		if(oAgentInfo.ie && document.selection){
			nhn.CurrentSelection_IE.apply(this);
		}else{
			nhn.CurrentSelection_FF.apply(this);
		}
	},
	
	setWindow : function(oWin){
		this._window = oWin;
		this._document = oWin.document;
	}
}))();

/**
 * @fileOverview This file contains a cross-browser implementation of W3C's DOM Range
 * @name W3CDOMRange.js
 */
nhn.W3CDOMRange = jindo.$Class({
	$init : function(win){
		this.reset(win);
	},
	
	reset : function(win){
		this._window = win;
		this._document = this._window.document;

		this.collapsed = true;
		this.commonAncestorContainer = this._document.body;
		this.endContainer = this._document.body;
		this.endOffset = 0;
		this.startContainer = this._document.body;
		this.startOffset = 0;

		this.oBrowserSelection = new nhn.BrowserSelection(this._window);
		this.selectionLoaded = this.oBrowserSelection.selectionLoaded;
	},

	cloneContents : function(){
		var oClonedContents = this._document.createDocumentFragment();
		var oTmpContainer = this._document.createDocumentFragment();

		var aNodes = this._getNodesInRange();

		if(aNodes.length < 1){return oClonedContents;}

		var oClonedContainers = this._constructClonedTree(aNodes, oTmpContainer);

		// oTopContainer = aNodes[aNodes.length-1].parentNode and this is not part of the initial array and only those child nodes should be cloned
		var oTopContainer = oTmpContainer.firstChild;

		if(oTopContainer){
			var elCurNode = oTopContainer.firstChild;
			var elNextNode;

			while(elCurNode){
				elNextNode = elCurNode.nextSibling;
				oClonedContents.appendChild(elCurNode);
				elCurNode = elNextNode;
			}
		}

		oClonedContainers = this._splitTextEndNodes({oStartContainer: oClonedContainers.oStartContainer, iStartOffset: this.startOffset, 
													oEndContainer: oClonedContainers.oEndContainer, iEndOffset: this.endOffset});

		if(oClonedContainers.oStartContainer && oClonedContainers.oStartContainer.previousSibling){
			nhn.DOMFix.parentNode(oClonedContainers.oStartContainer).removeChild(oClonedContainers.oStartContainer.previousSibling);
		}

		if(oClonedContainers.oEndContainer && oClonedContainers.oEndContainer.nextSibling){
			nhn.DOMFix.parentNode(oClonedContainers.oEndContainer).removeChild(oClonedContainers.oEndContainer.nextSibling);
		}

		return oClonedContents;
	},

	_constructClonedTree : function(aNodes, oClonedParentNode){
		var oClonedStartContainer = null;
		var oClonedEndContainer = null;

		var oStartContainer = this.startContainer;
		var oEndContainer = this.endContainer;

		var _recurConstructClonedTree = function(aAllNodes, iCurIdx, oClonedParentNode){

			if(iCurIdx < 0){return iCurIdx;}

			var iChildIdx = iCurIdx-1;

			var oCurNodeCloneWithChildren = aAllNodes[iCurIdx].cloneNode(false);

			if(aAllNodes[iCurIdx] == oStartContainer){oClonedStartContainer = oCurNodeCloneWithChildren;}
			if(aAllNodes[iCurIdx] == oEndContainer){oClonedEndContainer = oCurNodeCloneWithChildren;}

			while(iChildIdx >= 0 && nhn.DOMFix.parentNode(aAllNodes[iChildIdx]) == aAllNodes[iCurIdx]){
				iChildIdx = this._recurConstructClonedTree(aAllNodes, iChildIdx, oCurNodeCloneWithChildren);
			}

			// this may trigger an error message in IE when an erroneous script is inserted
			oClonedParentNode.insertBefore(oCurNodeCloneWithChildren, oClonedParentNode.firstChild);

			return iChildIdx;
		};
		this._recurConstructClonedTree = _recurConstructClonedTree;
		aNodes[aNodes.length] = nhn.DOMFix.parentNode(aNodes[aNodes.length-1]);
		this._recurConstructClonedTree(aNodes, aNodes.length-1, oClonedParentNode);

		return {oStartContainer: oClonedStartContainer, oEndContainer: oClonedEndContainer};
	},

	cloneRange : function(){
		return this._copyRange(new nhn.W3CDOMRange(this._window));
	},

	_copyRange : function(oClonedRange){
		oClonedRange.collapsed = this.collapsed;
		oClonedRange.commonAncestorContainer = this.commonAncestorContainer;
		oClonedRange.endContainer = this.endContainer;
		oClonedRange.endOffset = this.endOffset;
		oClonedRange.startContainer = this.startContainer;
		oClonedRange.startOffset = this.startOffset;
		oClonedRange._document = this._document;
		
		return oClonedRange;
	},

	collapse : function(toStart){
		if(toStart){
			this.endContainer = this.startContainer;
			this.endOffset = this.startOffset;
		}else{
			this.startContainer = this.endContainer;
			this.startOffset = this.endOffset;
		}

		this._updateRangeInfo();
	},

	compareBoundaryPoints : function(how, sourceRange){
		switch(how){
			case nhn.W3CDOMRange.START_TO_START:
				return this._compareEndPoint(this.startContainer, this.startOffset, sourceRange.startContainer, sourceRange.startOffset);
			case nhn.W3CDOMRange.START_TO_END:
				return this._compareEndPoint(this.endContainer, this.endOffset, sourceRange.startContainer, sourceRange.startOffset);
			case nhn.W3CDOMRange.END_TO_END:
				return this._compareEndPoint(this.endContainer, this.endOffset, sourceRange.endContainer, sourceRange.endOffset);
			case nhn.W3CDOMRange.END_TO_START:
				return this._compareEndPoint(this.startContainer, this.startOffset, sourceRange.endContainer, sourceRange.endOffset);
		}
	},

	_findBody : function(oNode){
		if(!oNode){return null;}
		while(oNode){
			if(oNode.tagName == "BODY"){return oNode;}
			oNode = nhn.DOMFix.parentNode(oNode);
		}
		return null;
	},

	_compareEndPoint : function(oContainerA, iOffsetA, oContainerB, iOffsetB){
		return this.oBrowserSelection.compareEndPoints(oContainerA, iOffsetA, oContainerB, iOffsetB);
		
		var iIdxA, iIdxB;

		if(!oContainerA || this._findBody(oContainerA) != this._document.body){
			oContainerA = this._document.body;
			iOffsetA = 0;
		}

		if(!oContainerB || this._findBody(oContainerB) != this._document.body){
			oContainerB = this._document.body;
			iOffsetB = 0;
		}

		var compareIdx = function(iIdxA, iIdxB){
			// iIdxX == -1 when the node is the commonAncestorNode
			// if iIdxA == -1
			// -> [[<nodeA>...<nodeB></nodeB>]]...</nodeA>
			// if iIdxB == -1
			// -> <nodeB>...[[<nodeA></nodeA>...</nodeB>]]
			if(iIdxB == -1){iIdxB = iIdxA+1;}
			if(iIdxA < iIdxB){return -1;}
			if(iIdxA == iIdxB){return 0;}
			return 1;
		};

		var oCommonAncestor = this._getCommonAncestorContainer(oContainerA, oContainerB);

		// ================================================================================================================================================
		//  Move up both containers so that both containers are direct child nodes of the common ancestor node. From there, just compare the offset
		// Add 0.5 for each contaienrs that has "moved up" since the actual node is wrapped by 1 or more parent nodes and therefore its position is somewhere between idx & idx+1
		// <COMMON_ANCESTOR>NODE1<P>NODE2</P>NODE3</COMMON_ANCESTOR>
		// The position of NODE2 in COMMON_ANCESTOR is somewhere between after NODE1(idx1) and before NODE3(idx2), so we let that be 1.5

		// container node A in common ancestor container
		var oNodeA = oContainerA;
		var oTmpNode = null;
		if(oNodeA != oCommonAncestor){
			while((oTmpNode = nhn.DOMFix.parentNode(oNodeA)) != oCommonAncestor){oNodeA = oTmpNode;}
			
			iIdxA = this._getPosIdx(oNodeA)+0.5;
		}else{
			iIdxA = iOffsetA;
		}
		
		// container node B in common ancestor container
		var oNodeB = oContainerB;
		if(oNodeB != oCommonAncestor){
			while((oTmpNode = nhn.DOMFix.parentNode(oNodeB)) != oCommonAncestor){oNodeB = oTmpNode;}
			
			iIdxB = this._getPosIdx(oNodeB)+0.5;
		}else{
			iIdxB = iOffsetB;
		}

		return compareIdx(iIdxA, iIdxB);
	},

	_getCommonAncestorContainer : function(oNode1, oNode2){
		oNode1 = oNode1 || this.startContainer;
		oNode2 = oNode2 || this.endContainer;
		
		var oComparingNode = oNode2;

		while(oNode1){
			while(oComparingNode){
				if(oNode1 == oComparingNode){return oNode1;}
				oComparingNode = nhn.DOMFix.parentNode(oComparingNode);
			}
			oComparingNode = oNode2;
			oNode1 = nhn.DOMFix.parentNode(oNode1);
		}

		return this._document.body;
	},

	deleteContents : function(){
		if(this.collapsed){return;}

		this._splitTextEndNodesOfTheRange();

		var aNodes = this._getNodesInRange();

		if(aNodes.length < 1){return;}
		var oPrevNode = aNodes[0].previousSibling;

		while(oPrevNode && this._isBlankTextNode(oPrevNode)){oPrevNode = oPrevNode.previousSibling;}

		var oNewStartContainer, iNewOffset = -1;
		if(!oPrevNode){
			oNewStartContainer = nhn.DOMFix.parentNode(aNodes[0]);
			iNewOffset = 0;
		}

		for(var i=0; i<aNodes.length; i++){
			var oNode = aNodes[i];

			if(!oNode.firstChild || this._isAllChildBlankText(oNode)){
				if(oNewStartContainer == oNode){
					iNewOffset = this._getPosIdx(oNewStartContainer);
					oNewStartContainer = nhn.DOMFix.parentNode(oNode);
				}
				nhn.DOMFix.parentNode(oNode).removeChild(oNode);
			}else{
				// move the starting point to out of the parent container if the starting point of parent container is meant to be removed
				// [<span>A]B</span>
				// -> []<span>B</span>
				// without these lines, the result would yeild to
				// -> <span>[]B</span>
				if(oNewStartContainer == oNode && iNewOffset === 0){
					iNewOffset = this._getPosIdx(oNewStartContainer);
					oNewStartContainer = nhn.DOMFix.parentNode(oNode);
				}
			}
		}

		if(!oPrevNode){
			this.setStart(oNewStartContainer, iNewOffset, true, true);
		}else{
			if(oPrevNode.tagName == "BODY"){
				this.setStartBefore(oPrevNode, true);
			}else{
				this.setStartAfter(oPrevNode, true);
			}
		}

		this.collapse(true);
	},

	extractContents : function(){
		var oClonedContents = this.cloneContents();
		this.deleteContents();
		return oClonedContents;
	},

	getInsertBeforeNodes : function(){
		var oFirstNode = null;

		var oParentContainer;

		if(this.startContainer.nodeType == "3"){
			oParentContainer = nhn.DOMFix.parentNode(this.startContainer);
			if(this.startContainer.nodeValue.length <= this.startOffset){
				oFirstNode = this.startContainer.nextSibling;
			}else{
				oFirstNode = this.startContainer.splitText(this.startOffset);
			}
		}else{
			oParentContainer = this.startContainer;
			oFirstNode = nhn.DOMFix.childNodes(this.startContainer)[this.startOffset];
		}

		if(!oFirstNode || !nhn.DOMFix.parentNode(oFirstNode)){oFirstNode = null;}
		
		return {elParent: oParentContainer, elBefore: oFirstNode};
	},
	
	insertNode : function(newNode){
		var oInsertBefore = this.getInsertBeforeNodes();

		oInsertBefore.elParent.insertBefore(newNode, oInsertBefore.elBefore);

		this.setStartBefore(newNode);
	},

	selectNode : function(refNode){
		this.reset(this._window);

		this.setStartBefore(refNode);
		this.setEndAfter(refNode);
	},

	selectNodeContents : function(refNode){
		this.reset(this._window);
		
		this.setStart(refNode, 0, true);
		this.setEnd(refNode, nhn.DOMFix.childNodes(refNode).length);
	},

	_endsNodeValidation : function(oNode, iOffset){
		if(!oNode || this._findBody(oNode) != this._document.body){throw new Error("INVALID_NODE_TYPE_ERR oNode is not part of current document");}

		if(oNode.nodeType == 3){
			if(iOffset > oNode.nodeValue.length){iOffset = oNode.nodeValue.length;}
		}else{
			if(iOffset > nhn.DOMFix.childNodes(oNode).length){iOffset = nhn.DOMFix.childNodes(oNode).length;}
		}

		return iOffset;
	},
	

	setEnd : function(refNode, offset, bSafe, bNoUpdate){
		if(!bSafe){offset = this._endsNodeValidation(refNode, offset);}

		this.endContainer = refNode;
		this.endOffset = offset;
		
		if(!bNoUpdate){
			if(!this.startContainer || this._compareEndPoint(this.startContainer, this.startOffset, this.endContainer, this.endOffset) != -1){
				this.collapse(false);
			}else{
				this._updateRangeInfo();
			}
		}
	},

	setEndAfter : function(refNode, bNoUpdate){
		if(!refNode){throw new Error("INVALID_NODE_TYPE_ERR in setEndAfter");}

		if(refNode.tagName == "BODY"){
			this.setEnd(refNode, nhn.DOMFix.childNodes(refNode).length, true, bNoUpdate);
			return;
		}
		this.setEnd(nhn.DOMFix.parentNode(refNode), this._getPosIdx(refNode)+1, true, bNoUpdate);
	},

	setEndBefore : function(refNode, bNoUpdate){
		if(!refNode){throw new Error("INVALID_NODE_TYPE_ERR in setEndBefore");}

		if(refNode.tagName == "BODY"){
			this.setEnd(refNode, 0, true, bNoUpdate);
			return;
		}

		this.setEnd(nhn.DOMFix.parentNode(refNode), this._getPosIdx(refNode), true, bNoUpdate);
	},

	setStart : function(refNode, offset, bSafe, bNoUpdate){
		if(!bSafe){offset = this._endsNodeValidation(refNode, offset);}

		this.startContainer = refNode;
		this.startOffset = offset;

		if(!bNoUpdate){
			if(!this.endContainer || this._compareEndPoint(this.startContainer, this.startOffset, this.endContainer, this.endOffset) != -1){
				this.collapse(true);
			}else{
				this._updateRangeInfo();
			}
		}
	},

	setStartAfter : function(refNode, bNoUpdate){
		if(!refNode){throw new Error("INVALID_NODE_TYPE_ERR in setStartAfter");}

		if(refNode.tagName == "BODY"){
			this.setStart(refNode, nhn.DOMFix.childNodes(refNode).length, true, bNoUpdate);
			return;
		}

		this.setStart(nhn.DOMFix.parentNode(refNode), this._getPosIdx(refNode)+1, true, bNoUpdate);
	},

	setStartBefore : function(refNode, bNoUpdate){
		if(!refNode){throw new Error("INVALID_NODE_TYPE_ERR in setStartBefore");}

		if(refNode.tagName == "BODY"){
			this.setStart(refNode, 0, true, bNoUpdate);
			return;
		}
		this.setStart(nhn.DOMFix.parentNode(refNode), this._getPosIdx(refNode), true, bNoUpdate);
	},

	surroundContents : function(newParent){
		newParent.appendChild(this.extractContents());
		this.insertNode(newParent);
		this.selectNode(newParent);
	},

	toString : function(){
		var oTmpContainer = this._document.createElement("DIV");
		oTmpContainer.appendChild(this.cloneContents());

		return oTmpContainer.textContent || oTmpContainer.innerText || "";
	},
	
	// this.oBrowserSelection.getCommonAncestorContainer which uses browser's built-in API runs faster but may return an incorrect value.
	// Call this function to fix the problem.
	//
	// In IE, the built-in API would return an incorrect value when,
	// 1. commonAncestorContainer is not selectable
	// AND
	// 2. The selected area will look the same when its child node is selected
	// eg)
	// when <P><SPAN>TEST</SPAN></p> is selected, <SPAN>TEST</SPAN> will be returned as commonAncestorContainer
	fixCommonAncestorContainer : function(){
		if(!jindo.$Agent().navigator().ie){
			return;
		}
		
		this.commonAncestorContainer = this._getCommonAncestorContainer();
	},

	_isBlankTextNode : function(oNode){
		if(oNode.nodeType == 3 && oNode.nodeValue == ""){return true;}
		return false;
	},
	
	_isAllChildBlankText : function(elNode){
		for(var i=0, nLen=elNode.childNodes.length; i<nLen; i++){
			if(!this._isBlankTextNode(elNode.childNodes[i])){return false;}
		}
		return true;
	},
	
	_getPosIdx : function(refNode){
		var idx = 0;
		for(var node = refNode.previousSibling; node; node = node.previousSibling){idx++;}

		return idx;
	},

	_updateRangeInfo : function(){
		if(!this.startContainer){
			this.reset(this._window);
			return;
		}

		// isCollapsed may not function correctly when the cursor is located,
		// (below a table) AND (at the end of the document where there's no P tag or anything else to actually hold the cursor)
		this.collapsed = this.oBrowserSelection.isCollapsed(this) || (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
//		this.collapsed = this._isCollapsed(this.startContainer, this.startOffset, this.endContainer, this.endOffset);
		this.commonAncestorContainer = this.oBrowserSelection.getCommonAncestorContainer(this);
//		this.commonAncestorContainer = this._getCommonAncestorContainer(this.startContainer, this.endContainer);
	},
	
	_isCollapsed : function(oStartContainer, iStartOffset, oEndContainer, iEndOffset){
		var bCollapsed = false;

		if(oStartContainer == oEndContainer && iStartOffset == iEndOffset){
			bCollapsed = true;
		}else{
			var oActualStartNode = this._getActualStartNode(oStartContainer, iStartOffset);
			var oActualEndNode = this._getActualEndNode(oEndContainer, iEndOffset);

			// Take the parent nodes on the same level for easier comparison when they're next to each other
			// eg) From
			//	<A>
			//		<B>
			//			<C>
			//			</C>
			//		</B>
			//		<D>
			//			<E>
			//				<F>
			//				</F>
			//			</E>
			//		</D>
			//	</A>
			//	, it's easier to compare the position of B and D rather than C and F because they are siblings
			//
			// If the range were collapsed, oActualEndNode will precede oActualStartNode by doing this
			oActualStartNode = this._getNextNode(this._getPrevNode(oActualStartNode));
			oActualEndNode = this._getPrevNode(this._getNextNode(oActualEndNode));

			if(oActualStartNode && oActualEndNode && oActualEndNode.tagName != "BODY" && 
				(this._getNextNode(oActualEndNode) == oActualStartNode || (oActualEndNode == oActualStartNode && this._isBlankTextNode(oActualEndNode)))
			){
				bCollapsed = true;
			}
		}
		
		return bCollapsed;
	},

	_splitTextEndNodesOfTheRange : function(){
		var oEndPoints = this._splitTextEndNodes({oStartContainer: this.startContainer, iStartOffset: this.startOffset, 
													oEndContainer: this.endContainer, iEndOffset: this.endOffset});

		this.startContainer = oEndPoints.oStartContainer;
		this.startOffset = oEndPoints.iStartOffset;

		this.endContainer = oEndPoints.oEndContainer;
		this.endOffset = oEndPoints.iEndOffset;
	},

	_splitTextEndNodes : function(oEndPoints){
		oEndPoints = this._splitStartTextNode(oEndPoints);
		oEndPoints = this._splitEndTextNode(oEndPoints);

		return oEndPoints;
	},

	_splitStartTextNode : function(oEndPoints){
		var oStartContainer = oEndPoints.oStartContainer;
		var iStartOffset = oEndPoints.iStartOffset;

		var oEndContainer = oEndPoints.oEndContainer;
		var iEndOffset = oEndPoints.iEndOffset;

		if(!oStartContainer){return oEndPoints;}
		if(oStartContainer.nodeType != 3){return oEndPoints;}
		if(iStartOffset === 0){return oEndPoints;}

		if(oStartContainer.nodeValue.length <= iStartOffset){return oEndPoints;}

		var oLastPart = oStartContainer.splitText(iStartOffset);

		if(oStartContainer == oEndContainer){
			iEndOffset -= iStartOffset;
			oEndContainer = oLastPart;
		}
		oStartContainer = oLastPart;
		iStartOffset = 0;

		return {oStartContainer: oStartContainer, iStartOffset: iStartOffset, oEndContainer: oEndContainer, iEndOffset: iEndOffset};
	},

	_splitEndTextNode : function(oEndPoints){
		var oStartContainer = oEndPoints.oStartContainer;
		var iStartOffset = oEndPoints.iStartOffset;

		var oEndContainer = oEndPoints.oEndContainer;
		var iEndOffset = oEndPoints.iEndOffset;

		if(!oEndContainer){return oEndPoints;}
		if(oEndContainer.nodeType != 3){return oEndPoints;}

		if(iEndOffset >= oEndContainer.nodeValue.length){return oEndPoints;}
		if(iEndOffset === 0){return oEndPoints;}

		oEndContainer.splitText(iEndOffset);

		return {oStartContainer: oStartContainer, iStartOffset: iStartOffset, oEndContainer: oEndContainer, iEndOffset: iEndOffset};
	},
	
	_getNodesInRange : function(){
		if(this.collapsed){return [];}

		var oStartNode = this._getActualStartNode(this.startContainer, this.startOffset);
		var oEndNode = this._getActualEndNode(this.endContainer, this.endOffset);

		return this._getNodesBetween(oStartNode, oEndNode);
	},

	_getActualStartNode : function(oStartContainer, iStartOffset){
		var oStartNode = oStartContainer;

		if(oStartContainer.nodeType == 3){
			if(iStartOffset >= oStartContainer.nodeValue.length){
				oStartNode = this._getNextNode(oStartContainer);
				if(oStartNode.tagName == "BODY"){oStartNode = null;}
			}else{
				oStartNode = oStartContainer;
			}
		}else{
			if(iStartOffset < nhn.DOMFix.childNodes(oStartContainer).length){
				oStartNode = nhn.DOMFix.childNodes(oStartContainer)[iStartOffset];
			}else{
				oStartNode = this._getNextNode(oStartContainer);
				if(oStartNode.tagName == "BODY"){oStartNode = null;}
			}
		}

		return oStartNode;
	},

	_getActualEndNode : function(oEndContainer, iEndOffset){
		var oEndNode = oEndContainer;

		if(iEndOffset === 0){
			oEndNode = this._getPrevNode(oEndContainer);
			if(oEndNode.tagName == "BODY"){oEndNode = null;}
		}else if(oEndContainer.nodeType == 3){
			oEndNode = oEndContainer;
		}else{
			oEndNode = nhn.DOMFix.childNodes(oEndContainer)[iEndOffset-1];
		}

		return oEndNode;
	},

	_getNextNode : function(oNode){
		if(!oNode || oNode.tagName == "BODY"){return this._document.body;}

		if(oNode.nextSibling){return oNode.nextSibling;}
		
		return this._getNextNode(nhn.DOMFix.parentNode(oNode));
	},

	_getPrevNode : function(oNode){
		if(!oNode || oNode.tagName == "BODY"){return this._document.body;}

		if(oNode.previousSibling){return oNode.previousSibling;}
		
		return this._getPrevNode(nhn.DOMFix.parentNode(oNode));
	},

	// includes partially selected
	// for <div id="a"><div id="b"></div></div><div id="c"></div>, _getNodesBetween(b, c) will yield to b, "a" and c
	_getNodesBetween : function(oStartNode, oEndNode){
		var aNodesBetween = [];
		this._nNodesBetweenLen = 0;

		if(!oStartNode || !oEndNode){return aNodesBetween;}

		// IE may throw an exception on "oCurNode = oCurNode.nextSibling;" when oCurNode is 'invalid', not null or undefined but somehow 'invalid'.
		// It happened during browser's build-in UNDO with control range selected(table).
		try{
			this._recurGetNextNodesUntil(oStartNode, oEndNode, aNodesBetween);
		}catch(e){
			return [];
		}
		
		return aNodesBetween;
	},

	_recurGetNextNodesUntil : function(oNode, oEndNode, aNodesBetween){
		if(!oNode){return false;}

		if(!this._recurGetChildNodesUntil(oNode, oEndNode, aNodesBetween)){return false;}

		var oNextToChk = oNode.nextSibling;
		
		while(!oNextToChk){
			if(!(oNode = nhn.DOMFix.parentNode(oNode))){return false;}

			aNodesBetween[this._nNodesBetweenLen++] = oNode;

			if(oNode == oEndNode){return false;}

			oNextToChk = oNode.nextSibling;
		}

		return this._recurGetNextNodesUntil(oNextToChk, oEndNode, aNodesBetween);
	},

	_recurGetChildNodesUntil : function(oNode, oEndNode, aNodesBetween){
		if(!oNode){return false;}

		var bEndFound = false;
		var oCurNode = oNode;
		if(oCurNode.firstChild){
			oCurNode = oCurNode.firstChild;
			while(oCurNode){
				if(!this._recurGetChildNodesUntil(oCurNode, oEndNode, aNodesBetween)){
					bEndFound = true;
					break;
				}
				oCurNode = oCurNode.nextSibling;
			}
		}
		aNodesBetween[this._nNodesBetweenLen++] = oNode;

		if(bEndFound){return false;}
		if(oNode == oEndNode){return false;}

		return true;
	}
});

nhn.W3CDOMRange.START_TO_START = 0;
nhn.W3CDOMRange.START_TO_END = 1;
nhn.W3CDOMRange.END_TO_END = 2;
nhn.W3CDOMRange.END_TO_START = 3;


/**
 * @fileOverview This file contains a cross-browser function that implements all of the W3C's DOM Range specification and some more
 * @name HuskyRange.js
 */
nhn.HuskyRange = jindo.$Class({
	setWindow : function(win){
		this.reset(win || window);
	},

	$init : function(win){
		this.HUSKY_BOOMARK_START_ID_PREFIX = "husky_bookmark_start_";
		this.HUSKY_BOOMARK_END_ID_PREFIX = "husky_bookmark_end_";

		this.sBlockElement = "P|DIV|LI|H[1-6]|PRE";
		this.sBlockContainer = "BODY|TABLE|TH|TR|TD|UL|OL|BLOCKQUOTE|FORM";

		this.rxBlockElement = new RegExp("^("+this.sBlockElement+")$");
		this.rxBlockContainer = new RegExp("^("+this.sBlockContainer+")$");
		this.rxLineBreaker = new RegExp("^("+this.sBlockElement+"|"+this.sBlockContainer+")$");

		this.setWindow(win);
	},

	select : function(){
		try{
			this.oBrowserSelection.selectRange(this);
		}catch(e){}
	},

	setFromSelection : function(iNum){
		this.setRange(this.oBrowserSelection.getRangeAt(iNum), true);
	},

	setRange : function(oW3CRange, bSafe){
		this.reset(this._window);

		this.setStart(oW3CRange.startContainer, oW3CRange.startOffset, bSafe, true);
		this.setEnd(oW3CRange.endContainer, oW3CRange.endOffset, bSafe);
	},

	setEndNodes : function(oSNode, oENode){
		this.reset(this._window);

		this.setEndAfter(oENode, true);
		this.setStartBefore(oSNode);
	},
	
	splitTextAtBothEnds : function(){
		this._splitTextEndNodesOfTheRange();
	},

	getStartNode : function(){
		if(this.collapsed){
			if(this.startContainer.nodeType == 3){
				if(this.startOffset === 0){return null;}
				if(this.startContainer.nodeValue.length <= this.startOffset){return null;}
				return this.startContainer;
			}
			return null;
		}
		
		if(this.startContainer.nodeType == 3){
			if(this.startOffset >= this.startContainer.nodeValue.length){return this._getNextNode(this.startContainer);}
			return this.startContainer;
		}else{
			if(this.startOffset >= nhn.DOMFix.childNodes(this.startContainer).length){return this._getNextNode(this.startContainer);}
			return nhn.DOMFix.childNodes(this.startContainer)[this.startOffset];
		}
	},
	
	getEndNode : function(){
		if(this.collapsed){return this.getStartNode();}
		
		if(this.endContainer.nodeType == 3){
			if(this.endOffset === 0){return this._getPrevNode(this.endContainer);}
			return this.endContainer;
		}else{
			if(this.endOffset === 0){return this._getPrevNode(this.endContainer);}
			return nhn.DOMFix.childNodes(this.endContainer)[this.endOffset-1];
		}
	},

	getNodeAroundRange : function(bBefore, bStrict){
		if(!this.collapsed){return this.getStartNode();}

		if(this.startContainer && this.startContainer.nodeType == 3){return this.startContainer;}
		//if(this.collapsed && this.startContainer && this.startContainer.nodeType == 3) return this.startContainer;
		//if(!this.collapsed || (this.startContainer && this.startContainer.nodeType == 3)) return this.getStartNode();

		var oBeforeRange, oAfterRange, oResult;

		if(this.startOffset >= nhn.DOMFix.childNodes(this.startContainer).length){
			oAfterRange = this._getNextNode(this.startContainer);
		}else{
			oAfterRange = nhn.DOMFix.childNodes(this.startContainer)[this.startOffset];
		}

		if(this.endOffset === 0){
			oBeforeRange = this._getPrevNode(this.endContainer);
		}else{
			oBeforeRange = nhn.DOMFix.childNodes(this.endContainer)[this.endOffset-1];
		}

		if(bBefore){
			oResult = oBeforeRange;
			if(!oResult && !bStrict){oResult = oAfterRange;}
		}else{
			oResult = oAfterRange;
			if(!oResult && !bStrict){oResult = oBeforeRange;}
		}

		return oResult;
	},

	_getXPath : function(elNode){
		var sXPath = "";
		
		while(elNode && elNode.nodeType == 1){
			sXPath = "/" + elNode.tagName+"["+this._getPosIdx4XPath(elNode)+"]" + sXPath;
			elNode = nhn.DOMFix.parentNode(elNode);
		}
		
		return sXPath;
	},
	
	_getPosIdx4XPath : function(refNode){
		var idx = 0;
		for(var node = refNode.previousSibling; node; node = node.previousSibling){
			if(node.tagName == refNode.tagName){idx++;}
		}

		return idx;
	},
	
	// this was written specifically for XPath Bookmark and it may not perform correctly for general purposes
	_evaluateXPath : function(sXPath, oDoc){
		sXPath = sXPath.substring(1, sXPath.length-1);
		var aXPath = sXPath.split(/\//);
		var elNode = oDoc.body;

		for(var i=2; i<aXPath.length && elNode; i++){
			aXPath[i].match(/([^\[]+)\[(\d+)/i);
			var sTagName = RegExp.$1;
			var nIdx = RegExp.$2;

			var aAllNodes = nhn.DOMFix.childNodes(elNode);
			var aNodes = [];
			var nLength = aAllNodes.length;
			var nCount = 0;
			for(var ii=0; ii<nLength; ii++){
				if(aAllNodes[ii].tagName == sTagName){aNodes[nCount++] = aAllNodes[ii];}
			}

			if(aNodes.length < nIdx){
				elNode = null;
			}else{
				elNode = aNodes[nIdx];
			}
		}

		return elNode;
	},

	_evaluateXPathBookmark : function(oBookmark){
		var sXPath = oBookmark["sXPath"];
		var nTextNodeIdx = oBookmark["nTextNodeIdx"];
		var nOffset = oBookmark["nOffset"];

		var elContainer = this._evaluateXPath(sXPath, this._document);

		if(nTextNodeIdx > -1 && elContainer){
			var aChildNodes = nhn.DOMFix.childNodes(elContainer);
			var elNode = null;
			
			var nIdx = nTextNodeIdx;
			var nOffsetLeft = nOffset;
			
			while((elNode = aChildNodes[nIdx]) && elNode.nodeType == 3 && elNode.nodeValue.length < nOffsetLeft){
				nOffsetLeft -= elNode.nodeValue.length;
				nIdx++;
			}
			
			elContainer = nhn.DOMFix.childNodes(elContainer)[nIdx];
			nOffset = nOffsetLeft;
		}

		if(!elContainer){
			elContainer = this._document.body;
			nOffset = 0;
		}
		return {elContainer: elContainer, nOffset: nOffset};
	},
	
	// this was written specifically for XPath Bookmark and it may not perform correctly for general purposes
	getXPathBookmark : function(){
		var nTextNodeIdx1 = -1;
		var htEndPt1 = {elContainer: this.startContainer, nOffset: this.startOffset};
		var elNode1 = this.startContainer;
		if(elNode1.nodeType == 3){
			htEndPt1 = this._getFixedStartTextNode();
			nTextNodeIdx1 = this._getPosIdx(htEndPt1.elContainer);
			elNode1 = nhn.DOMFix.parentNode(elNode1);
		}
		var sXPathNode1 = this._getXPath(elNode1);
		var oBookmark1 = {sXPath:sXPathNode1, nTextNodeIdx:nTextNodeIdx1, nOffset: htEndPt1.nOffset};
		
		if(this.collapsed){
			var oBookmark2 = {sXPath:sXPathNode1, nTextNodeIdx:nTextNodeIdx1, nOffset: htEndPt1.nOffset};
		}else{
			var nTextNodeIdx2 = -1;
			var htEndPt2 = {elContainer: this.endContainer, nOffset: this.endOffset};
			var elNode2 = this.endContainer;
			if(elNode2.nodeType == 3){
				htEndPt2 = this._getFixedEndTextNode();
				nTextNodeIdx2 = this._getPosIdx(htEndPt2.elContainer);
				elNode2 = nhn.DOMFix.parentNode(elNode2);
			}
			var sXPathNode2 = this._getXPath(elNode2);
			var oBookmark2 = {sXPath:sXPathNode2, nTextNodeIdx:nTextNodeIdx2, nOffset: htEndPt2.nOffset};
		}
		return [oBookmark1, oBookmark2];
	},
	
	moveToXPathBookmark : function(aBookmark){
		if(!aBookmark){return false;}

		var oBookmarkInfo1 = this._evaluateXPathBookmark(aBookmark[0]);
		var oBookmarkInfo2 = this._evaluateXPathBookmark(aBookmark[1]);

		if(!oBookmarkInfo1["elContainer"] || !oBookmarkInfo2["elContainer"]){return;}

		this.startContainer = oBookmarkInfo1["elContainer"];
		this.startOffset = oBookmarkInfo1["nOffset"];

		this.endContainer = oBookmarkInfo2["elContainer"];
		this.endOffset = oBookmarkInfo2["nOffset"];
		
		return true;
	},
	
	_getFixedTextContainer : function(elNode, nOffset){
		while(elNode && elNode.nodeType == 3 && elNode.previousSibling && elNode.previousSibling.nodeType == 3){
			nOffset += elNode.previousSibling.nodeValue.length;
			elNode = elNode.previousSibling;
		}
		
		return {elContainer:elNode, nOffset:nOffset};
	},
	
	_getFixedStartTextNode : function(){
		return this._getFixedTextContainer(this.startContainer, this.startOffset);
	},
	
	_getFixedEndTextNode : function(){
		return this._getFixedTextContainer(this.endContainer, this.endOffset);
	},
	
	placeStringBookmark : function(){
		if(this.collapsed || jindo.$Agent().navigator().ie || jindo.$Agent().navigator().firefox){
			return this.placeStringBookmark_NonWebkit();
		}else{
			return this.placeStringBookmark_Webkit();
		}
	},

	placeStringBookmark_NonWebkit : function(){
		var sTmpId = (new Date()).getTime();

		var oInsertionPoint = this.cloneRange();
		oInsertionPoint.collapseToEnd();
		var oEndMarker = this._document.createElement("SPAN");
		oEndMarker.id = this.HUSKY_BOOMARK_END_ID_PREFIX+sTmpId;
		oInsertionPoint.insertNode(oEndMarker);

		var oInsertionPoint = this.cloneRange();
		oInsertionPoint.collapseToStart();
		var oStartMarker = this._document.createElement("SPAN");
		oStartMarker.id = this.HUSKY_BOOMARK_START_ID_PREFIX+sTmpId;
		oInsertionPoint.insertNode(oStartMarker);

		// IE¿¡¼­ ºó SPANÀÇ ¾ÕµÚ·Î Ä¿¼­°¡ ÀÌµ¿ÇÏÁö ¾Ê¾Æ ¹®Á¦°¡ ¹ß»ý ÇÒ ¼ö ÀÖ¾î, º¸ÀÌÁö ¾Ê´Â Æ¯¼ö ¹®ÀÚ¸¦ ÀÓ½Ã·Î ³Ö¾î ÁÜ.
		if(jindo.$Agent().navigator().ie){
			// SPANÀÇ À§Ä¡°¡ TD¿Í TD »çÀÌ¿¡ ÀÖÀ» °æ¿ì, ÅØ½ºÆ® »ðÀÔ ½Ã ¾Ë¼ö ¾ø´Â ¿À·ù°¡ ¹ß»ýÇÑ´Ù.
			// TD¿Í TD»çÀÌ¿¡¼­´Â ÅØ½ºÆ® »ðÀÔÀÌ ÇÊ¿ä ¾øÀ½À¸·Î ±×³É try/catch·Î Ã³¸®
			try{
				oStartMarker.innerHTML = unescape("%uFEFF");
			}catch(e){}
			
			try{
				oEndMarker.innerHTML = unescape("%uFEFF");
			}catch(e){}
		}
		this.moveToBookmark(sTmpId);

		return sTmpId;
	},
	
	placeStringBookmark_Webkit : function(){
		var sTmpId = (new Date()).getTime();

		var elInsertBefore, elInsertParent;

		// Do not insert the bookmarks between TDs as it will break the rendering in Chrome/Safari
		// -> modify the insertion position from [<td>abc</td>]<td>abc</td> to <td>[abc]</td><td>abc</td>
		var oInsertionPoint = this.cloneRange();
		oInsertionPoint.collapseToEnd();
		elInsertBefore = this._document.createTextNode("");
		oInsertionPoint.insertNode(elInsertBefore);
		elInsertParent = elInsertBefore.parentNode;
		if(elInsertBefore.previousSibling && elInsertBefore.previousSibling.tagName == "TD"){
			elInsertParent = elInsertBefore.previousSibling;
			elInsertBefore = null;
		}
		var oEndMarker = this._document.createElement("SPAN");
		oEndMarker.id = this.HUSKY_BOOMARK_END_ID_PREFIX+sTmpId;
		elInsertParent.insertBefore(oEndMarker, elInsertBefore);

		var oInsertionPoint = this.cloneRange();
		oInsertionPoint.collapseToStart();
		elInsertBefore = this._document.createTextNode("");
		oInsertionPoint.insertNode(elInsertBefore);
		elInsertParent = elInsertBefore.parentNode;
		if(elInsertBefore.nextSibling && elInsertBefore.nextSibling.tagName == "TD"){
			elInsertParent = elInsertBefore.nextSibling;
			elInsertBefore = elInsertParent.firstChild;
		}
		var oStartMarker = this._document.createElement("SPAN");
		oStartMarker.id = this.HUSKY_BOOMARK_START_ID_PREFIX+sTmpId;
		elInsertParent.insertBefore(oStartMarker, elInsertBefore);

		//elInsertBefore.parentNode.removeChild(elInsertBefore);
		
		this.moveToBookmark(sTmpId);

		return sTmpId;
	},

	cloneRange : function(){
		return this._copyRange(new nhn.HuskyRange(this._window));
	},

	moveToBookmark : function(vBookmark){
		if(typeof(vBookmark) != "object"){
			return this.moveToStringBookmark(vBookmark);
		}else{
			return this.moveToXPathBookmark(vBookmark);
		}
	},

	getStringBookmark : function(sBookmarkID, bEndBookmark){
		if(bEndBookmark){
			return this._document.getElementById(this.HUSKY_BOOMARK_END_ID_PREFIX+sBookmarkID);
		}else{
			return this._document.getElementById(this.HUSKY_BOOMARK_START_ID_PREFIX+sBookmarkID);
		}
	},
	
	moveToStringBookmark : function(sBookmarkID, bIncludeBookmark){
		var oStartMarker = this.getStringBookmark(sBookmarkID);
		var oEndMarker = this.getStringBookmark(sBookmarkID, true);

		if(!oStartMarker || !oEndMarker){return false;}

		this.reset(this._window);

		if(bIncludeBookmark){
			this.setEndAfter(oEndMarker);
			this.setStartBefore(oStartMarker);
		}else{
			this.setEndBefore(oEndMarker);
			this.setStartAfter(oStartMarker);
		}
		return true;
	},

	removeStringBookmark : function(sBookmarkID){
	/*
		var oStartMarker = this._document.getElementById(this.HUSKY_BOOMARK_START_ID_PREFIX+sBookmarkID);
		var oEndMarker = this._document.getElementById(this.HUSKY_BOOMARK_END_ID_PREFIX+sBookmarkID);

		if(oStartMarker) nhn.DOMFix.parentNode(oStartMarker).removeChild(oStartMarker);
		if(oEndMarker) nhn.DOMFix.parentNode(oEndMarker).removeChild(oEndMarker);
	*/
		this._removeAll(this.HUSKY_BOOMARK_START_ID_PREFIX+sBookmarkID);
		this._removeAll(this.HUSKY_BOOMARK_END_ID_PREFIX+sBookmarkID);
	},
	
	_removeAll : function(sID){
		var elNode;
		while((elNode = this._document.getElementById(sID))){
			nhn.DOMFix.parentNode(elNode).removeChild(elNode);
		}
	},

	collapseToStart : function(){
		this.collapse(true);
	},
	
	collapseToEnd : function(){
		this.collapse(false);
	},

	createAndInsertNode : function(sTagName){
		var tmpNode = this._document.createElement(sTagName);
		this.insertNode(tmpNode);
		return tmpNode;
	},

	getNodes : function(bSplitTextEndNodes, fnFilter){
		if(bSplitTextEndNodes){this._splitTextEndNodesOfTheRange();}

		var aAllNodes = this._getNodesInRange();
		var aFilteredNodes = [];

		if(!fnFilter){return aAllNodes;}

		for(var i=0; i<aAllNodes.length; i++){
			if(fnFilter(aAllNodes[i])){aFilteredNodes[aFilteredNodes.length] = aAllNodes[i];}
		}

		return aFilteredNodes;
	},

	getTextNodes : function(bSplitTextEndNodes){
		var txtFilter = function(oNode){
			if (oNode.nodeType == 3 && oNode.nodeValue != "\n" && oNode.nodeValue != ""){
				return true;
			}else{
				return false;
			}
		};

		return this.getNodes(bSplitTextEndNodes, txtFilter);
	},

	surroundContentsWithNewNode : function(sTagName){
		var oNewParent = this._document.createElement(sTagName);
		this.surroundContents(oNewParent);
		return oNewParent;
	},

	isRangeinRange : function(oAnoterRange, bIncludePartlySelected){
		var startToStart = this.compareBoundaryPoints(this.W3CDOMRange.START_TO_START, oAnoterRange);
		var startToEnd = this.compareBoundaryPoints(this.W3CDOMRange.START_TO_END, oAnoterRange);
		var endToStart = this.compareBoundaryPoints(this.W3CDOMRange.ND_TO_START, oAnoterRange);
		var endToEnd = this.compareBoundaryPoints(this.W3CDOMRange.END_TO_END, oAnoterRange);

		if(startToStart <= 0 && endToEnd >= 0){return true;}

		if(bIncludePartlySelected){
			if(startToEnd == 1){return false;}
			if(endToStart == -1){return false;}
			return true;
		}

		return false;
	},

	isNodeInRange : function(oNode, bIncludePartlySelected, bContentOnly){
		var oTmpRange = new nhn.HuskyRange(this._window);

		if(bContentOnly && oNode.firstChild){
			oTmpRange.setStartBefore(oNode.firstChild);
			oTmpRange.setEndAfter(oNode.lastChild);
		}else{
			oTmpRange.selectNode(oNode);
		}

		return this.isRangeInRange(oTmpRange, bIncludePartlySelected);
	},		

	pasteText : function(sText){
		this.pasteHTML(sText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/"/g, "&quot;"));
	},
	
	pasteHTML : function(sHTML){
		var oTmpDiv = this._document.createElement("DIV");
		oTmpDiv.innerHTML = sHTML;

		if(!oTmpDiv.firstChild){
			this.deleteContents();
			return;
		}
		
		var oFirstNode = oTmpDiv.firstChild;
		var oLastNode = oTmpDiv.lastChild;

		var clone = this.cloneRange();
		var sBM = clone.placeStringBookmark();

		this.collapseToStart();

		while(oTmpDiv.lastChild){this.insertNode(oTmpDiv.lastChild);}

		this.setEndNodes(oFirstNode, oLastNode);

		// delete the content later as deleting it first may mass up the insertion point
		// eg) <p>[A]BCD</p> ---paste O---> O<p>BCD</p>
		clone.moveToBookmark(sBM);
		clone.deleteContents();
		clone.removeStringBookmark(sBM);
	},
	
	toString : function(){
		this.toString = nhn.W3CDOMRange.prototype.toString;
		return this.toString();
	},
	
	toHTMLString : function(){
		var oTmpContainer = this._document.createElement("DIV");
		oTmpContainer.appendChild(this.cloneContents());

		return oTmpContainer.innerHTML;
	},

	findAncestorByTagName : function(sTagName){
		var oNode = this.commonAncestorContainer;
		while(oNode && oNode.tagName != sTagName){oNode = nhn.DOMFix.parentNode(oNode);}
		
		return oNode;
	},

	selectNodeContents : function(oNode){
		if(!oNode){return;}

		var oFirstNode = oNode.firstChild?oNode.firstChild:oNode;
		var oLastNode = oNode.lastChild?oNode.lastChild:oNode;

		this.reset(this._window);
		if(oFirstNode.nodeType == 3){
			this.setStart(oFirstNode, 0, true);
		}else{
			this.setStartBefore(oFirstNode);
		}
		
		if(oLastNode.nodeType == 3){
			this.setEnd(oLastNode, oLastNode.nodeValue.length, true);
		}else{
			this.setEndAfter(oLastNode);
		}
	},

	/**
	 * ³ëµåÀÇ Ãë¼Ò¼±/¹ØÁÙ Á¤º¸¸¦ È®ÀÎÇÑ´Ù
	 * °ü·Ã BTS [SMARTEDITORSUS-26]
	 * @param {Node} 	oNode	Ãë¼Ò¼±/¹ØÁÙÀ» È®ÀÎÇÒ ³ëµå
	 * @param {String}	sValue 	textDecoration Á¤º¸
	 * @see nhn.HuskyRange#_checkTextDecoration
	 */
	_hasTextDecoration : function(oNode, sValue){
		if(!oNode || !oNode.style){
			return false;
		}
		
		if(oNode.style.textDecoration.indexOf(sValue) > -1){
			return true;
		}
		
		if(sValue === "underline" && oNode.tagName === "U"){
			return true;
		}
		
		if(sValue === "line-through" && (oNode.tagName === "S" || oNode.tagName === "STRIKE")){
			return true;
		}
		
		return false;
	},
	
	/**
	 * ³ëµå¿¡ Ãë¼Ò¼±/¹ØÁÙÀ» Àû¿ëÇÑ´Ù
	 * °ü·Ã BTS [SMARTEDITORSUS-26]
	 * [FF] ³ëµåÀÇ Style ¿¡ textDecoration À» Ãß°¡ÇÑ´Ù
	 * [FF ¿Ü] U/STRIKE ÅÂ±×¸¦ Ãß°¡ÇÑ´Ù
	 * @param {Node} 	oNode	Ãë¼Ò¼±/¹ØÁÙÀ» Àû¿ëÇÒ ³ëµå
	 * @param {String}	sValue 	textDecoration Á¤º¸
	 * @see nhn.HuskyRange#_checkTextDecoration
	 */
	_setTextDecoration : function(oNode, sValue){
		if (jindo.$Agent().navigator().firefox) {	// FF
			oNode.style.textDecoration = (oNode.style.textDecoration) ? oNode.style.textDecoration + " " + sValue : sValue;
		}
		else{
			if(sValue === "underline"){
				oNode.innerHTML = "<U>" + oNode.innerHTML + "</U>"
			}else if(sValue === "line-through"){
				oNode.innerHTML = "<STRIKE>" + oNode.innerHTML + "</STRIKE>"
			}
		}
	},
		
	/**
	 * ÀÎÀÚ·Î Àü´Þ¹ÞÀº ³ëµå »óÀ§ÀÇ Ãë¼Ò¼±/¹ØÁÙ Á¤º¸¸¦ È®ÀÎÇÏ¿© ³ëµå¿¡ Àû¿ëÇÑ´Ù
	 * °ü·Ã BTS [SMARTEDITORSUS-26]
	 * @param {Node} oNode Ãë¼Ò¼±/¹ØÁÙÀ» Àû¿ëÇÒ ³ëµå
	 */
	_checkTextDecoration : function(oNode){
		if(oNode.tagName !== "SPAN"){
			return;	
		}
		
		var bUnderline = false,
			bLineThrough = false,
			sTextDecoration = "",
			oParentNode = null;
			oChildNode = oNode.firstChild;
		
		/* check child */
		while(oChildNode){
			if(oChildNode.nodeType === 1){
				bUnderline = (bUnderline || oChildNode.tagName === "U");
				bLineThrough = (bLineThrough || oChildNode.tagName === "S" || oChildNode.tagName === "STRIKE");
			}
			
			if(bUnderline && bLineThrough){
				return;
			}
			
			oChildNode = oChildNode.nextSibling;
		}
			
		oParentNode = nhn.DOMFix.parentNode(oNode);
		
		/* check parent */
		while(oParentNode && oParentNode.tagName !== "BODY"){
			if(oParentNode.nodeType !== 1){
				oParentNode = nhn.DOMFix.parentNode(oParentNode);
				continue;
			}
			
			if(!bUnderline && this._hasTextDecoration(oParentNode, "underline")){
				bUnderline = true;
				this._setTextDecoration(oNode, "underline");	// set underline
			}
			
			if(!bLineThrough && this._hasTextDecoration(oParentNode, "line-through")){
				bLineThrough = true;
				this._setTextDecoration(oNode, "line-through");	// set line-through
			}

			if(bUnderline && bLineThrough){
				return;
			}
			
			oParentNode = nhn.DOMFix.parentNode(oParentNode);
		}
	},

	/**
	 * Range¿¡ ¼ÓÇÑ ³ëµåµé¿¡ ½ºÅ¸ÀÏÀ» Àû¿ëÇÑ´Ù
	 * @param {Object} 	oStyle 					Àû¿ëÇÒ ½ºÅ¸ÀÏÀ» °¡Áö´Â Object (¿¹) ±Û²Ã »ö Àû¿ëÀÇ °æ¿ì { color : "#0075c8" }
	 * @param {Object} 	[oAttribute] 			Àû¿ëÇÒ ¼Ó¼ºÀ» °¡Áö´Â Object (¿¹) ¸ÂÃã¹ü °Ë»çÀÇ °æ¿ì { _sm2_spchk: "°­³²Äá", class: "se2_check_spell" }
	 * @param {String} 	[sNewSpanMarker] 		»õ·Î Ãß°¡µÈ SPAN ³ëµå¸¦ ³ªÁß¿¡ µû·Î Ã³¸®ÇØ¾ßÇÏ´Â °æ¿ì ¸¶Å·À» À§ÇØ »ç¿ëÇÏ´Â ¹®ÀÚ¿­
	 * @param {Boolean} [bIncludeLI] 			LI µµ ½ºÅ¸ÀÏ Àû¿ë¿¡ Æ÷ÇÔÇÒ °ÍÀÎÁöÀÇ ¿©ºÎ [COM-1051] _getStyleParentNodes ¸Þ¼­µå Âü°íÇÏ±â
	 * @param {Boolean} [bCheckTextDecoration] 	Ãë¼Ò¼±/¹ØÁÙ Ã³¸®¸¦ Àû¿ëÇÒ °ÍÀÎÁö ¿©ºÎ [SMARTEDITORSUS-26] _setTextDecoration ¸Þ¼­µå Âü°íÇÏ±â
	 */
	styleRange : function(oStyle, oAttribute, sNewSpanMarker, bIncludeLI, bCheckTextDecoration){
		var aStyleParents = this.aStyleParents = this._getStyleParentNodes(sNewSpanMarker, bIncludeLI);
		if(aStyleParents.length < 1){return;}

		var sName, sValue;

		for(var i=0; i<aStyleParents.length; i++){
			for(var x in oStyle){
				sName = x;
				sValue = oStyle[sName];

				if(typeof sValue != "string"){continue;}

				// [SMARTEDITORSUS-26] ±Û²Ã »öÀ» Àû¿ëÇÒ ¶§ Ãë¼Ò¼±/¹ØÁÙÀÇ »ö»óµµ Ã³¸®µÇµµ·Ï Ãß°¡
				if(bCheckTextDecoration && oStyle.color){
					this._checkTextDecoration(aStyleParents[i]);
				}
				
				aStyleParents[i].style[sName] = sValue;
			}

			if(!oAttribute){continue;}

			for(var x in oAttribute){
				sName = x;
				sValue = oAttribute[sName];

				if(typeof sValue != "string"){continue;}
				
				if(sName == "class"){
					jindo.$Element(aStyleParents[i]).addClass(sValue);
				}else{
					aStyleParents[i].setAttribute(sName, sValue);
				}
			}
		}

		this.reset(this._window);
		this.setStartBefore(aStyleParents[0]);
		this.setEndAfter(aStyleParents[aStyleParents.length-1]);
	},

	expandBothEnds : function(){
		this.expandStart();
		this.expandEnd();
	},
	
	expandStart : function(){
		if(this.startContainer.nodeType == 3 && this.startOffset !== 0){return;}

		var elActualStartNode = this._getActualStartNode(this.startContainer, this.startOffset);
		elActualStartNode = this._getPrevNode(elActualStartNode);
		
		if(elActualStartNode.tagName == "BODY"){
			this.setStartBefore(elActualStartNode);
		}else{
			this.setStartAfter(elActualStartNode);
		}
	},
	
	expandEnd : function(){
		if(this.endContainer.nodeType == 3 && this.endOffset < this.endContainer.nodeValue.length){return;}

		var elActualEndNode = this._getActualEndNode(this.endContainer, this.endOffset);
		elActualEndNode = this._getNextNode(elActualEndNode);
		
		if(elActualEndNode.tagName == "BODY"){
			this.setEndAfter(elActualEndNode);
		}else{
			this.setEndBefore(elActualEndNode);
		}
	},
	
	/**
	 * Style À» Àû¿ëÇÒ ³ëµå¸¦ °¡Á®¿Â´Ù
	 * @param {String}	[sNewSpanMarker]	»õ·Î Ãß°¡ÇÏ´Â SPAN ³ëµå¸¦ ¸¶Å·À» À§ÇØ »ç¿ëÇÏ´Â ¹®ÀÚ¿­
	 * @param {Boolean}	[bIncludeLI]		LI µµ ½ºÅ¸ÀÏ Àû¿ë¿¡ Æ÷ÇÔÇÒ °ÍÀÎÁöÀÇ ¿©ºÎ
	 * @return {Array}	Style À» Àû¿ëÇÒ ³ëµå ¹è¿­
	 */
	_getStyleParentNodes : function(sNewSpanMarker, bIncludeLI){
		this._splitTextEndNodesOfTheRange();

		var oSNode = this.getStartNode();
		var oENode = this.getEndNode();

		var aAllNodes = this._getNodesInRange();
		var aResult = [];
		var nResult = 0;

		var oNode, oTmpNode, iStartRelPos, iEndRelPos, oSpan;
		var nInitialLength = aAllNodes.length;
		var arAllBottomNodes = jindo.$A(aAllNodes).filter(function(v){return (!v.firstChild || (bIncludeLI && v.tagName=="LI"));});

		// [COM-1051] º»¹®³»¿ëÀ» ÇÑ ÁÙ¸¸ ÀÔ·ÂÇÏ°í ¹øÈ£ ¸Å±ä »óÅÂ¿¡¼­ ±ÛÀÚÅ©±â¸¦ º¯°æÇÏ¸é ¹øÈ£Å©±â´Â º¯ÇÏÁö ¾Ê´Â ¹®Á¦
		// ºÎ¸ð ³ëµå Áß LI °¡ ÀÖ°í, ÇØ´ç LI ÀÇ ¸ðµç ÀÚ½Ä ³ëµå°¡ ¼±ÅÃµÈ »óÅÂ¶ó¸é LI¿¡µµ ½ºÅ¸ÀÏÀ» Àû¿ëÇÏµµ·Ï Ã³¸®ÇÔ
		// --- Range ¿¡ LI °¡ Æ÷ÇÔµÇÁö ¾ÊÀº °æ¿ì, LI ¸¦ Æ÷ÇÔÇÏµµ·Ï Ã³¸®
		var elTmpNode = this.commonAncestorContainer;
		if(bIncludeLI){
			while(elTmpNode){
				if(elTmpNode.tagName == "LI"){
					if(this._isFullyContained(elTmpNode, arAllBottomNodes)){
						aResult[nResult++] = elTmpNode;
					}
					break;
				}
				
				elTmpNode = elTmpNode.parentNode;
			}
		}
		
		for(var i=0; i<nInitialLength; i++){
			oNode = aAllNodes[i];

			if(!oNode){continue;}
			
			// --- Range ¿¡ LI °¡ Æ÷ÇÔµÈ °æ¿ì¿¡ ´ëÇÑ LI È®ÀÎ
			if(bIncludeLI && oNode.tagName == "LI" && this._isFullyContained(oNode, arAllBottomNodes)){
				aResult[nResult++] = oNode;
				continue;
			}

			if(oNode.nodeType != 3){continue;}
			if(oNode.nodeValue == "" || oNode.nodeValue.match(/^(\r|\n)+$/)){continue;}

			var oParentNode = nhn.DOMFix.parentNode(oNode);

			// ºÎ¸ð ³ëµå°¡ SPAN ÀÎ °æ¿ì¿¡´Â »õ·Î¿î SPAN À» »ý¼ºÇÏÁö ¾Ê°í SPAN À» ¸®ÅÏ ¹è¿­¿¡ Ãß°¡ÇÔ
			if(oParentNode.tagName == "SPAN"){
				if(this._isFullyContained(oParentNode, arAllBottomNodes, oNode)){
					aResult[nResult++] = oParentNode;
					continue;
				}
			}

			oSpan = this._document.createElement("SPAN");
			oParentNode.insertBefore(oSpan, oNode);
			oSpan.appendChild(oNode);
			aResult[nResult++] = oSpan;
			
			if(sNewSpanMarker){oSpan.setAttribute(sNewSpanMarker, "true");}
		}

		this.setStartBefore(oSNode);
		this.setEndAfter(oENode);

		return aResult;
	},
	
	/**
	 * ÄÁÅ×ÀÌ³Ê ¿¤¸®¸ÕÆ®(elContainer)ÀÇ ¸ðµç ÀÚ½Ä³ëµå°¡ ³ëµå ¹è¿­(waAllNodes)¿¡ ¼ÓÇÏ´ÂÁö È®ÀÎÇÑ´Ù
	 * Ã¹ ¹øÂ° ÀÚ½Ä ³ëµå¿Í ¸¶Áö¸· ÀÚ½Ä ³ëµå°¡ ³ëµå ¹è¿­¿¡ ¼ÓÇÏ´ÂÁö¸¦ È®ÀÎÇÑ´Ù
	 * @param {Element}		elContainer	ÄÁÅ×ÀÌ³Ê ¿¤¸®¸ÕÆ®
	 * @param {jindo.$A}	waAllNodes	Node ÀÇ $A ¹è¿­
	 * @param {Node}		[oNode] ¼º´ÉÀ» À§ÇÑ ¿É¼Ç ³ëµå·Î ÄÁÅ×ÀÌ³ÊÀÇ Ã¹ ¹øÂ° È¤Àº ¸¶Áö¸· ÀÚ½Ä ³ëµå¿Í °°À¸¸é indexOf ÇÔ¼ö »ç¿ëÀ» ÁÙÀÏ ¼ö ÀÖÀ½
	 * @return {Array}	Style À» Àû¿ëÇÒ ³ëµå ¹è¿­
	 */
	// check if all the child nodes of elContainer are in waAllNodes
	_isFullyContained : function(elContainer, waAllNodes, oNode){
		var nSIdx, nEIdx;
		var oTmpNode = this._getVeryFirstRealChild(elContainer);
		// do quick checks before trying indexOf() because indexOf() function is very slow
		// oNode is optional
		if(oNode && oTmpNode == oNode){
			nSIdx = 1;
		}else{
			nSIdx = waAllNodes.indexOf(oTmpNode);
		}

		if(nSIdx != -1){
			oTmpNode = this._getVeryLastRealChild(elContainer);
			if(oNode && oTmpNode == oNode){
				nEIdx = 1;
			}else{
				nEIdx = waAllNodes.indexOf(oTmpNode);
			}
		}

		return (nSIdx != -1 && nEIdx != -1);
	},
	
	_getVeryFirstChild : function(oNode){
		if(oNode.firstChild){return this._getVeryFirstChild(oNode.firstChild);}
		return oNode;
	},

	_getVeryLastChild : function(oNode){
		if(oNode.lastChild){return this._getVeryLastChild(oNode.lastChild);}
		return oNode;
	},

	_getFirstRealChild : function(oNode){
		var oFirstNode = oNode.firstChild;
		while(oFirstNode && oFirstNode.nodeType == 3 && oFirstNode.nodeValue == ""){oFirstNode = oFirstNode.nextSibling;}

		return oFirstNode;
	},
	
	_getLastRealChild : function(oNode){
		var oLastNode = oNode.lastChild;
		while(oLastNode && oLastNode.nodeType == 3 && oLastNode.nodeValue == ""){oLastNode = oLastNode.previousSibling;}

		return oLastNode;
	},
	
	_getVeryFirstRealChild : function(oNode){
		var oFirstNode = this._getFirstRealChild(oNode);
		if(oFirstNode){return this._getVeryFirstRealChild(oFirstNode);}
		return oNode;
	},
	_getVeryLastRealChild : function(oNode){
		var oLastNode = this._getLastRealChild(oNode);
		if(oLastNode){return this._getVeryLastChild(oLastNode);}
		return oNode;
	},

	_getLineStartInfo : function(node){
		var frontEndFinal = null;
		var frontEnd = node;
		var lineBreaker = node;
		var bParentBreak = false;

		var rxLineBreaker = this.rxLineBreaker;

		// vertical(parent) search
		function getLineStart(node){
			if(!node){return;}
			if(frontEndFinal){return;}

			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				frontEndFinal = frontEnd;

				bParentBreak = true;

				return;
			}else{
				frontEnd = node;
			}

			getFrontEnd(node.previousSibling);

			if(frontEndFinal){return;}
			getLineStart(nhn.DOMFix.parentNode(node));
		}

		// horizontal(sibling) search			
		function getFrontEnd(node){
			if(!node){return;}
			if(frontEndFinal){return;}

			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				frontEndFinal = frontEnd;

				bParentBreak = false;
				return;
			}

			if(node.firstChild && node.tagName != "TABLE"){
				var curNode = node.lastChild;
				while(curNode && !frontEndFinal){
					getFrontEnd(curNode);
					
					curNode = curNode.previousSibling;
				}
			}else{
				frontEnd = node;
			}
			
			if(!frontEndFinal){
				getFrontEnd(node.previousSibling);
			}
		}

		if(rxLineBreaker.test(node.tagName)){
			frontEndFinal = node;
		}else{
			getLineStart(node);
		}
	
		return {oNode: frontEndFinal, oLineBreaker: lineBreaker, bParentBreak: bParentBreak};
	},

	_getLineEndInfo : function(node){
		var backEndFinal = null;
		var backEnd = node;
		var lineBreaker = node;
		var bParentBreak = false;

		var rxLineBreaker = this.rxLineBreaker;

		// vertical(parent) search
		function getLineEnd(node){
			if(!node){return;}
			if(backEndFinal){return;}
			
			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				backEndFinal = backEnd;

				bParentBreak = true;

				return;
			}else{
				backEnd = node;
			}
	
			getBackEnd(node.nextSibling);
			if(backEndFinal){return;}
	
			getLineEnd(nhn.DOMFix.parentNode(node));
		}
		
		// horizontal(sibling) search
		function getBackEnd(node){
			if(!node){return;}
			if(backEndFinal){return;}
			
			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				backEndFinal = backEnd;

				bParentBreak = false;
				
				return;
			}

			if(node.firstChild && node.tagName != "TABLE"){
				var curNode = node.firstChild;
				while(curNode && !backEndFinal){
					getBackEnd(curNode);
					
					curNode = curNode.nextSibling;
				}
			}else{
				backEnd = node;
			}
	
			if(!backEndFinal){
				getBackEnd(node.nextSibling);
			}
		}
	
		if(rxLineBreaker.test(node.tagName)){
			backEndFinal = node;
		}else{
			getLineEnd(node);
		}
	
		return {oNode: backEndFinal, oLineBreaker: lineBreaker, bParentBreak: bParentBreak};
	},

	getLineInfo : function(bAfter){
		var bAfter = bAfter || false;
		
		var oSNode = this.getStartNode();
		var oENode = this.getEndNode();

		// oSNode && oENode will be null if the range is currently collapsed and the cursor is not located in the middle of a text node.
		if(!oSNode){oSNode = this.getNodeAroundRange(!bAfter, true);}
		if(!oENode){oENode = this.getNodeAroundRange(!bAfter, true);}
		
		var oStart = this._getLineStartInfo(oSNode);
		var oStartNode = oStart.oNode;
		var oEnd = this._getLineEndInfo(oENode);
		var oEndNode = oEnd.oNode;

		if(oSNode != oStartNode || oENode != oEndNode){
			// check if the start node is positioned after the range's ending point
			// or
			// if the end node is positioned before the range's starting point
			var iRelativeStartPos = this._compareEndPoint(nhn.DOMFix.parentNode(oStartNode), this._getPosIdx(oStartNode), this.endContainer, this.endOffset);
			var iRelativeEndPos = this._compareEndPoint(nhn.DOMFix.parentNode(oEndNode), this._getPosIdx(oEndNode)+1, this.startContainer, this.startOffset);

			if(!(iRelativeStartPos <= 0 && iRelativeEndPos >= 0)){
				oSNode = this.getNodeAroundRange(false, true);
				oENode = this.getNodeAroundRange(false, true);
				oStart = this._getLineStartInfo(oSNode);
				oEnd = this._getLineEndInfo(oENode);
			}
		}

		return {oStart: oStart, oEnd: oEnd};
	}
	
}).extend(nhn.W3CDOMRange);

/**
 * @fileOverview This file contains cross-browser selection function
 * @name BrowserSelection.js
 */
nhn.BrowserSelection = function(win){
	this.init = function(win){
		this._window = win || window;
		this._document = this._window.document;
	};

	this.init(win);

	// [SMARTEDITORSUS-888] IE9 ÀÌÈÄ·Î document.createRange ¸¦ Áö¿ø
/*	var oAgentInfo = jindo.$Agent().navigator();
	if(oAgentInfo.ie){
		nhn.BrowserSelectionImpl_IE.apply(this);
	}else{
		nhn.BrowserSelectionImpl_FF.apply(this);
	}*/

	if(!!this._document.createRange){
		nhn.BrowserSelectionImpl_FF.apply(this);
	}else{
		nhn.BrowserSelectionImpl_IE.apply(this);
	}
	
	this.selectRange = function(oRng){
		this.selectNone();
		this.addRange(oRng);
	};

	this.selectionLoaded = true;
	if(!this._oSelection){this.selectionLoaded = false;}
};

nhn.BrowserSelectionImpl_FF = function(){
	this._oSelection = this._window.getSelection();

	this.getRangeAt = function(iNum){
		iNum = iNum || 0;

		try{
			var oFFRange = this._oSelection.getRangeAt(iNum);
		}catch(e){return new nhn.W3CDOMRange(this._window);}

		return this._FFRange2W3CRange(oFFRange);
	};
			
	this.addRange = function(oW3CRange){
		var oFFRange = this._W3CRange2FFRange(oW3CRange);
		this._oSelection.addRange(oFFRange);
	};

	this.selectNone = function(){
		this._oSelection.removeAllRanges();
	};
	
	this.getCommonAncestorContainer = function(oW3CRange){
		var oFFRange = this._W3CRange2FFRange(oW3CRange);
		return oFFRange.commonAncestorContainer;
	};
	
	this.isCollapsed = function(oW3CRange){
		var oFFRange = this._W3CRange2FFRange(oW3CRange);
		return oFFRange.collapsed;
	};
	
	this.compareEndPoints = function(elContainerA, nOffsetA, elContainerB, nOffsetB){
		var oFFRangeA = this._document.createRange();
		var oFFRangeB = this._document.createRange();
		oFFRangeA.setStart(elContainerA, nOffsetA);
		oFFRangeB.setStart(elContainerB, nOffsetB);
		oFFRangeA.collapse(true);
		oFFRangeB.collapse(true);

		try{
			return oFFRangeA.compareBoundaryPoints(1, oFFRangeB);
		}catch(e){
			return 1;
		}
	};

	this._FFRange2W3CRange = function(oFFRange){
		var oW3CRange = new nhn.W3CDOMRange(this._window);

		oW3CRange.setStart(oFFRange.startContainer, oFFRange.startOffset, true);
		oW3CRange.setEnd(oFFRange.endContainer, oFFRange.endOffset, true);
		
		return oW3CRange;
	};

	this._W3CRange2FFRange = function(oW3CRange){
		var oFFRange = this._document.createRange();
		oFFRange.setStart(oW3CRange.startContainer, oW3CRange.startOffset);
		oFFRange.setEnd(oW3CRange.endContainer, oW3CRange.endOffset);

		return oFFRange;
	};
};

nhn.BrowserSelectionImpl_IE = function(){
	this._oSelection = this._document.selection;
	this.oLastRange = {
		oBrowserRange : null,
		elStartContainer : null,
		nStartOffset : -1,
		elEndContainer : null,
		nEndOffset : -1
	};

	this._updateLastRange = function(oBrowserRange, oW3CRange){
		this.oLastRange.oBrowserRange = oBrowserRange;
		this.oLastRange.elStartContainer = oW3CRange.startContainer;
		this.oLastRange.nStartOffset = oW3CRange.startOffset;
		this.oLastRange.elEndContainer = oW3CRange.endContainer;
		this.oLastRange.nEndOffset = oW3CRange.endOffset;
	};
	
	this.getRangeAt = function(iNum){
		iNum = iNum || 0;

		var oW3CRange, oBrowserRange;
		if(this._oSelection.type == "Control"){
			oW3CRange = new nhn.W3CDOMRange(this._window);

			var oSelectedNode = this._oSelection.createRange().item(iNum);

			// if the selction occurs in a different document, ignore
			if(!oSelectedNode || oSelectedNode.ownerDocument != this._document){return oW3CRange;}

			oW3CRange.selectNode(oSelectedNode);
			
			return oW3CRange;
		}else{
			//oBrowserRange = this._oSelection.createRangeCollection().item(iNum);
			oBrowserRange = this._oSelection.createRange();

			var oSelectedNode = oBrowserRange.parentElement();

			// if the selction occurs in a different document, ignore
			if(!oSelectedNode || oSelectedNode.ownerDocument != this._document){
				oW3CRange = new nhn.W3CDOMRange(this._window);
				return oW3CRange;
			}
			oW3CRange = this._IERange2W3CRange(oBrowserRange);
			
			return oW3CRange;
		}
	};

	this.addRange = function(oW3CRange){
		var oIERange = this._W3CRange2IERange(oW3CRange);
		oIERange.select();
	};

	this.selectNone = function(){
		this._oSelection.empty();
	};

	this.getCommonAncestorContainer = function(oW3CRange){
		return this._W3CRange2IERange(oW3CRange).parentElement();
	};
	
	this.isCollapsed = function(oW3CRange){
		var oRange = this._W3CRange2IERange(oW3CRange);
		var oRange2 = oRange.duplicate();

		oRange2.collapse();

		return oRange.isEqual(oRange2);
	};
	
	this.compareEndPoints = function(elContainerA, nOffsetA, elContainerB, nOffsetB){
		var oIERangeA, oIERangeB;

		if(elContainerA === this.oLastRange.elStartContainer && nOffsetA === this.oLastRange.nStartOffset){
			oIERangeA = this.oLastRange.oBrowserRange.duplicate();
			oIERangeA.collapse(true);
		}else{
			if(elContainerA === this.oLastRange.elEndContainer && nOffsetA === this.oLastRange.nEndOffset){
				oIERangeA = this.oLastRange.oBrowserRange.duplicate();
				oIERangeA.collapse(false);
			}else{
				oIERangeA = this._getIERangeAt(elContainerA, nOffsetA);
			}
		}

		if(elContainerB === this.oLastRange.elStartContainer && nOffsetB === this.oLastRange.nStartOffset){
			oIERangeB = this.oLastRange.oBrowserRange.duplicate();
			oIERangeB.collapse(true);
		}else{
			if(elContainerB === this.oLastRange.elEndContainer && nOffsetB === this.oLastRange.nEndOffset){
				oIERangeB = this.oLastRange.oBrowserRange.duplicate();
				oIERangeB.collapse(false);
			}else{
				oIERangeB = this._getIERangeAt(elContainerB, nOffsetB);
			}
		}

		return oIERangeA.compareEndPoints("StartToStart", oIERangeB);
	};
	
	this._W3CRange2IERange = function(oW3CRange){
		if(this.oLastRange.elStartContainer === oW3CRange.startContainer &&
			this.oLastRange.nStartOffset === oW3CRange.startOffset &&
			this.oLastRange.elEndContainer === oW3CRange.endContainer &&
			this.oLastRange.nEndOffset === oW3CRange.endOffset){
			return this.oLastRange.oBrowserRange;
		}

		var oStartIERange = this._getIERangeAt(oW3CRange.startContainer, oW3CRange.startOffset);
		var oEndIERange = this._getIERangeAt(oW3CRange.endContainer, oW3CRange.endOffset);
		oStartIERange.setEndPoint("EndToEnd", oEndIERange);

		this._updateLastRange(oStartIERange, oW3CRange);

		return oStartIERange;
	};

	this._getIERangeAt = function(oW3CContainer, iW3COffset){
		var oIERange = this._document.body.createTextRange();

		var oEndPointInfoForIERange = this._getSelectableNodeAndOffsetForIE(oW3CContainer, iW3COffset);

		var oSelectableNode = oEndPointInfoForIERange.oSelectableNodeForIE;
		var iIEOffset = oEndPointInfoForIERange.iOffsetForIE;

		oIERange.moveToElementText(oSelectableNode);

		oIERange.collapse(oEndPointInfoForIERange.bCollapseToStart);
		oIERange.moveStart("character", iIEOffset);

		return oIERange;
	};

	this._getSelectableNodeAndOffsetForIE = function(oW3CContainer, iW3COffset){
//		var oIERange = this._document.body.createTextRange();

		var oNonTextNode = null;
		var aChildNodes =  null;
		var iNumOfLeftNodesToCount = 0;

		if(oW3CContainer.nodeType == 3){
			oNonTextNode = nhn.DOMFix.parentNode(oW3CContainer);
			aChildNodes = nhn.DOMFix.childNodes(oNonTextNode);
			iNumOfLeftNodesToCount = aChildNodes.length;
		}else{
			oNonTextNode = oW3CContainer;
			aChildNodes = nhn.DOMFix.childNodes(oNonTextNode);
			//iNumOfLeftNodesToCount = iW3COffset;
			iNumOfLeftNodesToCount = (iW3COffset<aChildNodes.length)?iW3COffset:aChildNodes.length;
		}
//@ room 4 improvement
		var oNodeTester = null;
		var iResultOffset = 0;
		var bCollapseToStart = true;

		for(var i=0; i<iNumOfLeftNodesToCount; i++){
			oNodeTester = aChildNodes[i];

			if(oNodeTester.nodeType == 3){
				if(oNodeTester == oW3CContainer){break;}

				iResultOffset += oNodeTester.nodeValue.length;
			}else{
//				oIERange.moveToElementText(oNodeTester);
				oNonTextNode = oNodeTester;
				iResultOffset = 0;

				bCollapseToStart = false;
			}
		}

		if(oW3CContainer.nodeType == 3){iResultOffset += iW3COffset;}

		return {oSelectableNodeForIE:oNonTextNode, iOffsetForIE: iResultOffset, bCollapseToStart: bCollapseToStart};
	};

	this._IERange2W3CRange = function(oIERange){
		var oW3CRange = new nhn.W3CDOMRange(this._window);

		var oIEPointRange = null;
		var oPosition = null;

		oIEPointRange = oIERange.duplicate();
		oIEPointRange.collapse(true);

		oPosition = this._getW3CContainerAndOffset(oIEPointRange, true);

		oW3CRange.setStart(oPosition.oContainer, oPosition.iOffset, true, true);

		var oCollapsedChecker = oIERange.duplicate();
		oCollapsedChecker.collapse(true);
		if(oCollapsedChecker.isEqual(oIERange)){
			oW3CRange.collapse(true);
		}else{
			oIEPointRange = oIERange.duplicate();
			oIEPointRange.collapse(false);
			oPosition = this._getW3CContainerAndOffset(oIEPointRange);
			oW3CRange.setEnd(oPosition.oContainer, oPosition.iOffset, true);
		}

		this._updateLastRange(oIERange, oW3CRange);

		return oW3CRange;
	};

	this._getW3CContainerAndOffset = function(oIEPointRange, bStartPt){
		var oRgOrigPoint = oIEPointRange;

		var oContainer = oRgOrigPoint.parentElement();
		var offset = -1;

		var oRgTester = this._document.body.createTextRange();
		var aChildNodes = nhn.DOMFix.childNodes(oContainer);
		var oPrevNonTextNode = null;
		var pointRangeIdx = 0;

		for(var i=0;i<aChildNodes.length;i++){
			if(aChildNodes[i].nodeType == 3){continue;}

			oRgTester.moveToElementText(aChildNodes[i]);

			if(oRgTester.compareEndPoints("StartToStart", oIEPointRange)>=0){break;}

			oPrevNonTextNode = aChildNodes[i];
		}

		var pointRangeIdx = i;

		if(pointRangeIdx !== 0 && aChildNodes[pointRangeIdx-1].nodeType == 3){
			var oRgTextStart = this._document.body.createTextRange();
			var oCurTextNode = null;
			if(oPrevNonTextNode){
				oRgTextStart.moveToElementText(oPrevNonTextNode);
				oRgTextStart.collapse(false);
				oCurTextNode = oPrevNonTextNode.nextSibling;
			}else{
				oRgTextStart.moveToElementText(oContainer);
				oRgTextStart.collapse(true);
				oCurTextNode = oContainer.firstChild;
			}

			var oRgTextsUpToThePoint = oRgOrigPoint.duplicate();
			oRgTextsUpToThePoint.setEndPoint("StartToStart", oRgTextStart);

			var textCount = oRgTextsUpToThePoint.text.replace(/[\r\n]/g,"").length;

			while(textCount > oCurTextNode.nodeValue.length && oCurTextNode.nextSibling){
				textCount -= oCurTextNode.nodeValue.length;
				oCurTextNode = oCurTextNode.nextSibling;
			}

			// this will enforce IE to re-reference oCurTextNode
			var oTmp = oCurTextNode.nodeValue;
			
			if(bStartPt && oCurTextNode.nextSibling && oCurTextNode.nextSibling.nodeType == 3 && textCount == oCurTextNode.nodeValue.length){
				textCount -= oCurTextNode.nodeValue.length;
				oCurTextNode = oCurTextNode.nextSibling;
			}

			oContainer = oCurTextNode;
			offset = textCount;
		}else{
			oContainer = oRgOrigPoint.parentElement();
			offset = pointRangeIdx;
		}
		return {"oContainer" : oContainer, "iOffset" : offset};
	};
};

nhn.DOMFix = new (jindo.$Class({
	$init : function(){
		if(jindo.$Agent().navigator().ie || jindo.$Agent().navigator().opera){
			this.childNodes = this._childNodes_Fix;
			this.parentNode = this._parentNode_Fix;
		}else{
			this.childNodes = this._childNodes_Native;
			this.parentNode = this._parentNode_Native;
		}
	},

	_parentNode_Native : function(elNode){
		return elNode.parentNode;
	},
	
	_parentNode_Fix : function(elNode){
		if(!elNode){return elNode;}

		while(elNode.previousSibling){elNode = elNode.previousSibling;}

		return elNode.parentNode;
	},
	
	_childNodes_Native : function(elNode){
		return elNode.childNodes;
	},
	
	_childNodes_Fix : function(elNode){
		var aResult = null;
		var nCount = 0;

		if(elNode){
			var aResult = [];
			elNode = elNode.firstChild;
			while(elNode){
				aResult[nCount++] = elNode;
				elNode=elNode.nextSibling;
			}
		}
		
		return aResult;
	}
}))();
/*[
 * ADD_APP_PROPERTY
 *
 * ÁÖ¿ä ¿ÀºêÁ§Æ®¸¦ ¸ðµç ÇÃ·¯±×ÀÎ¿¡¼­ this.oApp¸¦ ÅëÇØ¼­ Á÷Á¢ Á¢±Ù °¡´É ÇÏµµ·Ï µî·ÏÇÑ´Ù.
 *
 * sPropertyName string µî·Ï¸í
 * oProperty object µî·Ï½ÃÅ³ ¿ÀºêÁ§Æ®
 *
---------------------------------------------------------------------------]*/
/*[
 * REGISTER_BROWSER_EVENT
 *
 * Æ¯Á¤ ºê¶ó¿ìÀú ÀÌº¥Æ®°¡ ¹ß»ý ÇßÀ»¶§ Husky ¸Þ½ÃÁö¸¦ ¹ß»ý ½ÃÅ²´Ù.
 *
 * obj HTMLElement ºê¶ó¿ìÀú ÀÌº¥Æ®¸¦ ¹ß»ý ½ÃÅ³ HTML ¿¤¸®¸ÕÆ®
 * sEvent string ¹ß»ý ´ë±â ÇÒ ºê¶ó¿ìÀú ÀÌº¥Æ®
 * sMsg string ¹ß»ý ÇÒ Husky ¸Þ½ÃÁö
 * aParams array ¸Þ½ÃÁö¿¡ ³Ñ±æ ÆÄ¶ó¹ÌÅÍ
 * nDelay number ºê¶ó¿ìÀú ÀÌº¥Æ® ¹ß»ý ÈÄ Husky ¸Þ½ÃÁö ¹ß»ý »çÀÌ¿¡ µô·¹ÀÌ¸¦ ÁÖ°í ½ÍÀ» °æ¿ì ¼³Á¤. (1/1000ÃÊ ´ÜÀ§)
 *
---------------------------------------------------------------------------]*/
/*[
 * DISABLE_MESSAGE
 *
 * Æ¯Á¤ ¸Þ½ÃÁö¸¦ ÄÚ¾î¿¡¼­ ¹«½ÃÇÏ°í ¶ó¿ìÆÃ ÇÏÁö ¾Êµµ·Ï ºñÈ°¼ºÈ­ ÇÑ´Ù.
 *
 * sMsg string ºñÈ°¼ºÈ­ ½ÃÅ³ ¸Þ½ÃÁö
 *
---------------------------------------------------------------------------]*/
/*[
 * ENABLE_MESSAGE
 *
 * ¹«½ÃÇÏµµ·Ï ¼³Á¤µÈ ¸Þ½ÃÁö¸¦ ¹«½ÃÇÏÁö ¾Êµµ·Ï È°¼ºÈ­ ÇÑ´Ù.
 *
 * sMsg string È°¼ºÈ­ ½ÃÅ³ ¸Þ½ÃÁö
 *
---------------------------------------------------------------------------]*/
/*[
 * EXEC_ON_READY_FUNCTION
 *
 * oApp.run({fnOnAppReady:fnOnAppReady})¿Í °°ÀÌ run È£Ãâ ½ÃÁ¡¿¡ ÁöÁ¤µÈ ÇÔ¼ö°¡ ÀÖÀ» °æ¿ì ÀÌ¸¦ MSG_APP_READY ½ÃÁ¡¿¡ ½ÇÇà ½ÃÅ²´Ù.
 * ÄÚ¾î¿¡¼­ ÀÚµ¿À¸·Î ¹ß»ý½ÃÅ°´Â ¸Þ½ÃÁö·Î Á÷Á¢ ¹ß»ý½ÃÅ°Áö´Â ¾Êµµ·Ï ÇÑ´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc Husky Framework¿¡¼­ ÀÚÁÖ »ç¿ëµÇ´Â ¸Þ½ÃÁö¸¦ Ã³¸®ÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.CorePlugin = jindo.$Class({
	name : "CorePlugin",

	// nStatus = 0(request not sent), 1(request sent), 2(response received)
	// sContents = response
	htLazyLoadRequest_plugins : {},
	htLazyLoadRequest_allFiles : {},
	
	htHTMLLoaded : {},
	
	$AFTER_MSG_APP_READY : function(){
		this.oApp.exec("EXEC_ON_READY_FUNCTION", []);
	},

	$ON_ADD_APP_PROPERTY : function(sPropertyName, oProperty){
		this.oApp[sPropertyName] = oProperty;
	},

	$ON_REGISTER_BROWSER_EVENT : function(obj, sEvent, sMsg, aParams, nDelay){
		this.oApp.registerBrowserEvent(obj, sEvent, sMsg, aParams, nDelay);
	},
	
	$ON_DISABLE_MESSAGE : function(sMsg){
		this.oApp.disableMessage(sMsg, true);
	},

	$ON_ENABLE_MESSAGE : function(sMsg){
		this.oApp.disableMessage(sMsg, false);
	},
	
	$ON_LOAD_FULL_PLUGIN : function(aFilenames, sClassName, sMsgName, oThisRef, oArguments){
		var oPluginRef = oThisRef.$this || oThisRef;
//		var nIdx = _nIdx||0;
		
		var sFilename = aFilenames[0];
		
		if(!this.htLazyLoadRequest_plugins[sFilename]){
			this.htLazyLoadRequest_plugins[sFilename] = {nStatus:1, sContents:""};
		}
		
		if(this.htLazyLoadRequest_plugins[sFilename].nStatus === 2){
			//this.oApp.delayedExec("MSG_FULL_PLUGIN_LOADED", [sFilename, sClassName, sMsgName, oThisRef, oArguments, false], 0);
			this.oApp.exec("MSG_FULL_PLUGIN_LOADED", [sFilename, sClassName, sMsgName, oThisRef, oArguments, false]);
		}else{
			this._loadFullPlugin(aFilenames, sClassName, sMsgName, oThisRef, oArguments, 0);
		}
	},
	
	_loadFullPlugin : function(aFilenames, sClassName, sMsgName, oThisRef, oArguments, nIdx){
		jindo.LazyLoading.load(nhn.husky.SE2M_Configuration.LazyLoad.sJsBaseURI+"/"+aFilenames[nIdx], 
			jindo.$Fn(function(aFilenames, sClassName, sMsgName, oThisRef, oArguments, nIdx){
				var sCurFilename = aFilenames[nIdx];

				// plugin filename
				var sFilename = aFilenames[0];
				if(nIdx == aFilenames.length-1){
					this.htLazyLoadRequest_plugins[sFilename].nStatus=2;
					this.oApp.exec("MSG_FULL_PLUGIN_LOADED", [aFilenames, sClassName, sMsgName, oThisRef, oArguments]);
					return;
				}
				//this.oApp.exec("LOAD_FULL_PLUGIN", [aFilenames, sClassName, sMsgName, oThisRef, oArguments, nIdx+1]);
				this._loadFullPlugin(aFilenames, sClassName, sMsgName, oThisRef, oArguments, nIdx+1);
			}, this).bind(aFilenames, sClassName, sMsgName, oThisRef, oArguments, nIdx),
			
			"utf-8"
		);
	},
	
	$ON_MSG_FULL_PLUGIN_LOADED : function(aFilenames, sClassName, sMsgName, oThisRef, oArguments, oRes){
		// oThisRef.$this´Â ÇöÀç ·ÎµåµÇ´Â ÇÃ·¯±×ÀÎÀÌ parent ÀÎ½ºÅÏ½ºÀÏ °æ¿ì Á¸Àç ÇÔ. oThisRef.$this´Â ÇöÀç ÇÃ·¯±×ÀÎ(oThisRef)¸¦ parent·Î »ï°í ÀÖ´Â ÀÎ½ºÅÏ½º
		// oThisRef¿¡ $this ¼Ó¼ºÀÌ ¾ø´Ù¸é parent°¡ ¾Æ´Ñ ÀÏ¹Ý ÀÎ½ºÅÏ½º
		// oPluginRef´Â °á°úÀûÀ¸·Î »ó¼Ó °ü°è°¡ ÀÖ´Ù¸é ÀÚ½Ä ÀÎ½ºÅÏ½º¸¦ ¾Æ´Ï¶ó¸é ÀÏ¹ÝÀûÀÎ ÀÎ½ºÅÏ½º¸¦ °¡Áü
		var oPluginRef = oThisRef.$this || oThisRef;
		
		var sFilename = aFilenames;

		// now the source code is loaded, remove the loader handlers
		for(var i=0, nLen=oThisRef._huskyFLT.length; i<nLen; i++){
			var sLoaderHandlerName = "$BEFORE_"+oThisRef._huskyFLT[i];
			
			// if child class has its own loader function, remove the loader from current instance(parent) only
			var oRemoveFrom = (oThisRef.$this && oThisRef[sLoaderHandlerName])?oThisRef:oPluginRef;
			oRemoveFrom[sLoaderHandlerName] = null;
			this.oApp.createMessageMap(sLoaderHandlerName);
		}

		var oPlugin = eval(sClassName+".prototype");
		//var oPlugin = eval("new "+sClassName+"()");

		var bAcceptLocalBeforeFirstAgain = false;
		// if there were no $LOCAL_BEFORE_FIRST in already-loaded script, set to accept $LOCAL_BEFORE_FIRST next time as the function could be included in the lazy-loaded script.
		if(typeof oPluginRef["$LOCAL_BEFORE_FIRST"] !== "function"){
			this.oApp.acceptLocalBeforeFirstAgain(oPluginRef, true);
		}
		
		for(var x in oPlugin){
			// ÀÚ½Ä ÀÎ½ºÅÏ½º¿¡ parent¸¦ overrideÇÏ´Â ÇÔ¼ö°¡ ¾ø´Ù¸é parent ÀÎ½ºÅÏ½º¿¡ ÇÔ¼ö º¹»ç ÇØ ÁÜ. ÀÌ¶§ ÇÔ¼ö¸¸ º¹»çÇÏ°í, ³ª¸ÓÁö ¼Ó¼ºµéÀº ÇöÀç ÀÎ½ºÅÏ½º¿¡ Á¸Àç ÇÏÁö ¾ÊÀ» °æ¿ì¿¡¸¸ º¹»ç.
			if(oThisRef.$this && (!oThisRef[x] || (typeof oPlugin[x] === "function" && x != "constructor"))){
				oThisRef[x] = jindo.$Fn(oPlugin[x], oPluginRef).bind();
			}

			// ÇöÀç ÀÎ½ºÅÏ½º¿¡ ÇÔ¼ö º¹»ç ÇØ ÁÜ. ÀÌ¶§ ÇÔ¼ö¸¸ º¹»çÇÏ°í, ³ª¸ÓÁö ¼Ó¼ºµéÀº ÇöÀç ÀÎ½ºÅÏ½º¿¡ Á¸Àç ÇÏÁö ¾ÊÀ» °æ¿ì¿¡¸¸ º¹»ç
			if(oPlugin[x] && (!oPluginRef[x] || (typeof oPlugin[x] === "function" && x != "constructor"))){
				oPluginRef[x] = oPlugin[x];

				// »õ·Î Ãß°¡µÇ´Â ÇÔ¼ö°¡ ¸Þ½ÃÁö ÇÚµé·¯¶ó¸é ¸Þ½ÃÁö ¸ÅÇÎ¿¡ Ãß°¡ ÇØ ÁÜ
				if(x.match(/^\$(LOCAL|BEFORE|ON|AFTER)_/)){
					this.oApp.addToMessageMap(x, oPluginRef);
				}
			}
		}
		
		if(bAcceptLocalBeforeFirstAgain){
			this.oApp.acceptLocalBeforeFirstAgain(oPluginRef, true);
		}
		
		// re-send the message after all the jindo.$super handlers are executed
		if(!oThisRef.$this){
			this.oApp.exec(sMsgName, oArguments);
		}
	},
	
	$ON_LOAD_HTML : function(sId){
		if(this.htHTMLLoaded[sId]) return;
		
		var elTextarea = jindo.$("_llh_"+sId);
		if(!elTextarea) return;

		this.htHTMLLoaded[sId] = true;
		
		var elTmp = document.createElement("DIV");
		elTmp.innerHTML = elTextarea.value;

		while(elTmp.firstChild){
			elTextarea.parentNode.insertBefore(elTmp.firstChild, elTextarea);
		}
	},

	$ON_EXEC_ON_READY_FUNCTION : function(){
		if(typeof this.oApp.htRunOptions.fnOnAppReady == "function"){this.oApp.htRunOptions.fnOnAppReady();}
	}
});
//{
/**
 * @fileOverview This file contains Husky plugin that bridges the HuskyRange function
 * @name hp_HuskyRangeManager.js
 */
nhn.husky.HuskyRangeManager = jindo.$Class({
	name : "HuskyRangeManager",

	oWindow : null,

	$init : function(win){
		this.oWindow = win || window;
	},

	$BEFORE_MSG_APP_READY : function(){
		if(this.oWindow && this.oWindow.tagName == "IFRAME"){
			this.oWindow = this.oWindow.contentWindow;
			nhn.CurrentSelection.setWindow(this.oWindow);
		}

		this.oApp.exec("ADD_APP_PROPERTY", ["getSelection", jindo.$Fn(this.getSelection, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getEmptySelection", jindo.$Fn(this.getEmptySelection, this).bind()]);
	},

	$ON_SET_EDITING_WINDOW : function(oWindow){
		this.oWindow = oWindow;
	},

	getEmptySelection : function(oWindow){
		var oHuskyRange = new nhn.HuskyRange(oWindow || this.oWindow);
		return oHuskyRange;
	},

	getSelection : function(oWindow){
		this.oApp.exec("RESTORE_IE_SELECTION", []);

		var oHuskyRange = this.getEmptySelection(oWindow);

		// this may throw an exception if the selected is area is not yet shown
		try{
			oHuskyRange.setFromSelection();
		}catch(e){}

		return oHuskyRange;
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to the tool bar UI
 * @name hp_SE2M_Toolbar.js
 */
nhn.husky.SE2M_Toolbar = jindo.$Class({
	name : "SE2M_Toolbar",

	toolbarArea : null,
	toolbarButton : null,
	uiNameTag : "uiName",
	
	// 0: unknown
	// 1: all enabled
	// 2: all disabled
	nUIStatus : 1,   
	
	sUIClassPrefix : "husky_seditor_ui_",

	aUICmdMap : null,
	elFirstToolbarItem : null,

	_assignHTMLElements : function(oAppContainer){
		oAppContainer = jindo.$(oAppContainer) || document;
		this.rxUI = new RegExp(this.sUIClassPrefix+"([^ ]+)");

		//@ec[
		this.toolbarArea = jindo.$$.getSingle(".se2_tool", oAppContainer);
		this.aAllUI = jindo.$$("[class*=" + this.sUIClassPrefix + "]", this.toolbarArea);
		this.elTextTool = jindo.$$.getSingle("div.husky_seditor_text_tool", this.toolbarArea);	// [SMARTEDITORSUS-1124] ÅØ½ºÆ® Åø¹Ù ¹öÆ°ÀÇ ¶ó¿îµå Ã³¸®
		//@ec]
		
		this.welToolbarArea = jindo.$Element(this.toolbarArea);		
		for (var i = 0, nCount = this.aAllUI.length; i < nCount; i++) {
			if (this.rxUI.test(this.aAllUI[i].className)) {
				var sUIName = RegExp.$1;
				if(this.htUIList[sUIName] !== undefined){
					continue;
				}
				
				this.htUIList[sUIName] = this.aAllUI[i];
				this.htWrappedUIList[sUIName] = jindo.$Element(this.htUIList[sUIName]);
			}
		}
 
		if (jindo.$$.getSingle("DIV.se2_icon_tool") != null) {
			this.elFirstToolbarItem = jindo.$$.getSingle("DIV.se2_icon_tool UL.se2_itool1>li>button");
		}
	},

	$LOCAL_BEFORE_FIRST : function(sMsg) {
		var aToolItems = jindo.$$(">ul>li[class*=" + this.sUIClassPrefix + "]>button", this.elTextTool);
		var nItemLength = aToolItems.length;
		 
		this.elFirstToolbarItem = this.elFirstToolbarItem || aToolItems[0];
		this.elLastToolbarItem = aToolItems[nItemLength-1];

		this.oApp.registerBrowserEvent(this.toolbarArea, "keydown", "NAVIGATE_TOOLBAR", []);
	},
 
	
	$init : function(oAppContainer){
		this.htUIList = {};
		this.htWrappedUIList = {};

		this.aUICmdMap = {};
		this._assignHTMLElements(oAppContainer);
		this._setRoundedCornerButton();	// [SMARTEDITORSUS-1124] ÅØ½ºÆ® Åø¹Ù ¹öÆ°ÀÇ ¶ó¿îµå Ã³¸®
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.toolbarArea, "mouseover", "EVENT_TOOLBAR_MOUSEOVER", []);
		this.oApp.registerBrowserEvent(this.toolbarArea, "mouseout", "EVENT_TOOLBAR_MOUSEOUT", []);
		this.oApp.registerBrowserEvent(this.toolbarArea, "mousedown", "EVENT_TOOLBAR_MOUSEDOWN", []);
		
/*
		var aBtns = jindo.$$("BUTTON", this.toolbarArea);
		for(var i=0; i<aBtns.length; i++){
			this.oApp.registerBrowserEvent(aBtns[i], "focus", "EVENT_TOOLBAR_MOUSEOVER", []);
			this.oApp.registerBrowserEvent(aBtns[i], "blur", "EVENT_TOOLBAR_MOUSEOUT", []);
		}
*/
		this.oApp.exec("ADD_APP_PROPERTY", ["getToolbarButtonByUIName", jindo.$Fn(this.getToolbarButtonByUIName, this).bind()]);
		
		//À¥Á¢±Ù¼º 
		//ÀÌ ´Ü°è¿¡¼­ oAppContainer°¡ Á¤ÀÇµÇÁö ¾ÊÀº »óÅÂ¶ó¼­ this.toolbarAreaº¯¼ö°ªÀ» »ç¿ëÇÏÁö ¸øÇÏ°í ¾Æ·¡¿Í °°ÀÌ ´Ù½Ã Á¤ÀÇÇÏ¿´À½.
		var elTool = jindo.$$.getSingle(".se2_tool");
		this.oApp.exec("REGISTER_HOTKEY", ["esc", "FOCUS_EDITING_AREA", [], elTool]);  
	},
	

	$ON_NAVIGATE_TOOLBAR : function(weEvent) {

		var TAB_KEY_CODE = 9;
		//ÀÌº¥Æ®°¡ ¹ß»ýÇÑ ¿¤¸®¸ÕÆ®°¡ ¸¶Áö¸· ¾ÆÀÌÅÛÀÌ°í TAB Å°°¡ ´­·ÁÁ³´Ù¸é   
		if ((weEvent.element == this.elLastToolbarItem) && (weEvent.key().keyCode == TAB_KEY_CODE) ) {
			

			if (weEvent.key().shift) {
				//do nothing
			} else {
				this.elFirstToolbarItem.focus();
				weEvent.stopDefault();
			}
		}


		//ÀÌº¥Æ®°¡ ¹ß»ýÇÑ ¿¤¸®¸ÕÆ®°¡ Ã¹¹øÂ° ¾ÆÀÌÅÛÀÌ°í TAB Å°°¡ ´­·ÁÁ³´Ù¸é 		
		if (weEvent.element == this.elFirstToolbarItem && (weEvent.key().keyCode == TAB_KEY_CODE)) {
			if (weEvent.key().shift) {
				weEvent.stopDefault();
				this.elLastToolbarItem.focus();
			}
		}	
	},   


	//Æ÷Ä¿½º°¡ Åø¹Ù¿¡ ÀÖ´Â »óÅÂ¿¡¼­ ´ÜÃàÅ°¸¦ ´©¸£¸é ¿¡µðÆÃ ¿µ¿ªÀ¸·Î ´Ù½Ã Æ÷Ä¿½º°¡ °¡µµ·Ï ÇÏ´Â ÇÔ¼ö. (À¥Á¢±Ù¼º)  
	$ON_FOCUS_EDITING_AREA : function() {
		this.oApp.exec("FOCUS");
	},

	$ON_TOGGLE_TOOLBAR_ACTIVE_LAYER : function(elLayer, elBtn, sOpenCmd, aOpenArgs, sCloseCmd, aCloseArgs){
		this.oApp.exec("TOGGLE_ACTIVE_LAYER", [elLayer, "MSG_TOOLBAR_LAYER_SHOWN", [elLayer, elBtn, sOpenCmd, aOpenArgs], sCloseCmd, aCloseArgs]);
	},

	$ON_MSG_TOOLBAR_LAYER_SHOWN : function(elLayer, elBtn, aOpenCmd, aOpenArgs){
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [elLayer, elBtn]);
		if(aOpenCmd){
			this.oApp.exec(aOpenCmd, aOpenArgs);
		}
	},
	
	$ON_SHOW_TOOLBAR_ACTIVE_LAYER : function(elLayer, sCmd, aArgs, elBtn){
		this.oApp.exec("SHOW_ACTIVE_LAYER", [elLayer, sCmd, aArgs]);
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [elLayer, elBtn]);
	},

	$ON_ENABLE_UI : function(sUIName){
		this._enableUI(sUIName);
	},

	$ON_DISABLE_UI : function(sUIName){
		this._disableUI(sUIName);
	},

	$ON_SELECT_UI : function(sUIName){
		var welUI = this.htWrappedUIList[sUIName];
		if(!welUI){
			return;
		}
		welUI.removeClass("hover");
		welUI.addClass("active");
	},

	$ON_DESELECT_UI : function(sUIName){
		var welUI = this.htWrappedUIList[sUIName];
		if(!welUI){
			return;
		}
		welUI.removeClass("active");
	},

	$ON_ENABLE_ALL_UI : function(htOptions){
		if(this.nUIStatus === 1){
			return;
		}
	
		var sUIName, className;
		htOptions = htOptions || {};
		var waExceptions = jindo.$A(htOptions.aExceptions || []);

		for(sUIName in this.htUIList){
			if(sUIName && !waExceptions.has(sUIName)){
				this._enableUI(sUIName);
			}
//			if(sUIName) this.oApp.exec("ENABLE_UI", [sUIName]);
		}
//		jindo.$Element(this.toolbarArea).removeClass("off");

		this.nUIStatus = 1;
	},

	$ON_DISABLE_ALL_UI : function(htOptions){
		if(this.nUIStatus === 2){
			return;
		}
		
		var sUIName;
		htOptions = htOptions || {};
		var waExceptions = jindo.$A(htOptions.aExceptions || []);
		var bLeavlActiveLayer = htOptions.bLeaveActiveLayer || false;

		if(!bLeavlActiveLayer){
			this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
		}

		for(sUIName in this.htUIList){
			if(sUIName && !waExceptions.has(sUIName)){
				this._disableUI(sUIName);
			}
//			if(sUIName) this.oApp.exec("DISABLE_UI", [sUIName]);
		}
//		jindo.$Element(this.toolbarArea).addClass("off");

		this.nUIStatus = 2;
	},
	
	$ON_MSG_STYLE_CHANGED : function(sAttributeName, attributeValue){
		if(attributeValue === "@^"){
			this.oApp.exec("SELECT_UI", [sAttributeName]);
		}else{
			this.oApp.exec("DESELECT_UI", [sAttributeName]);
		}
	},
	
	$ON_POSITION_TOOLBAR_LAYER : function(elLayer, htOption){
		var nLayerLeft, nLayerRight, nToolbarLeft, nToolbarRight;
	
		elLayer = jindo.$(elLayer);
		htOption = htOption || {};
		var elBtn = jindo.$(htOption.elBtn);
		var sAlign = htOption.sAlign;

		var nMargin = -1;
		if(!elLayer){
			return;
		}
		if(elBtn && elBtn.tagName && elBtn.tagName == "BUTTON"){
			elBtn.parentNode.appendChild(elLayer);
		}

		var welLayer = jindo.$Element(elLayer);

		if(sAlign != "right"){
			elLayer.style.left = "0";

			nLayerLeft = welLayer.offset().left;
			nLayerRight = nLayerLeft + elLayer.offsetWidth;
			
			nToolbarLeft = this.welToolbarArea.offset().left;
			nToolbarRight = nToolbarLeft + this.toolbarArea.offsetWidth;

			if(nLayerRight > nToolbarRight){
				welLayer.css("left", (nToolbarRight-nLayerRight-nMargin)+"px");
			}
			
			if(nLayerLeft < nToolbarLeft){
				welLayer.css("left", (nToolbarLeft-nLayerLeft+nMargin)+"px");
			}
		}else{
			elLayer.style.right = "0";

			nLayerLeft = welLayer.offset().left;
			nLayerRight = nLayerLeft + elLayer.offsetWidth;
			
			nToolbarLeft = this.welToolbarArea.offset().left;
			nToolbarRight = nToolbarLeft + this.toolbarArea.offsetWidth;

			if(nLayerRight > nToolbarRight){
				welLayer.css("right", -1*(nToolbarRight-nLayerRight-nMargin)+"px");
			}
			
			if(nLayerLeft < nToolbarLeft){
				welLayer.css("right", -1*(nToolbarLeft-nLayerLeft+nMargin)+"px");
			}
		}
	},
	
	$ON_EVENT_TOOLBAR_MOUSEOVER : function(weEvent){
		if(this.nUIStatus === 2){
			return;
		}

		var aAffectedElements = this._getAffectedElements(weEvent.element);
		for(var i=0; i<aAffectedElements.length; i++){
			if(!aAffectedElements[i].hasClass("active")){
				aAffectedElements[i].addClass("hover");
			}
		}
	},
	
	$ON_EVENT_TOOLBAR_MOUSEOUT : function(weEvent){
		if(this.nUIStatus === 2){
			return;
		}
		var aAffectedElements = this._getAffectedElements(weEvent.element);
		for(var i=0; i<aAffectedElements.length; i++){
			aAffectedElements[i].removeClass("hover");
		}
	},

	$ON_EVENT_TOOLBAR_MOUSEDOWN : function(weEvent){
		var elTmp = weEvent.element;
		// Check if the button pressed is in active status and has a visible layer i.e. the button had been clicked and its layer is open already. (buttons like font styles-bold, underline-got no sub layer -> childNodes.length<=2)
		// -> In this case, do not close here(mousedown). The layer will be closed on "click". If we close the layer here, the click event will open it again because it toggles the visibility.
		while(elTmp){
			if(elTmp.className && elTmp.className.match(/active/) && (elTmp.childNodes.length>2 || elTmp.parentNode.className.match(/se2_pair/))){
				return;
			}
			elTmp = elTmp.parentNode;
		}
		this.oApp.exec("HIDE_ACTIVE_LAYER_IF_NOT_CHILD", [weEvent.element]);
	},

	_enableUI : function(sUIName){
		var i, nLen;
		
		this.nUIStatus = 0;

		var welUI = this.htWrappedUIList[sUIName];
		var elUI = this.htUIList[sUIName];
		if(!welUI){
			return;
		}
		welUI.removeClass("off");
		
		var aAllBtns = elUI.getElementsByTagName("BUTTON");
		for(i=0, nLen=aAllBtns.length; i<nLen; i++){
			aAllBtns[i].disabled = false;
		}

		// enable related commands
		var sCmd = "";
		if(this.aUICmdMap[sUIName]){
			for(i=0; i<this.aUICmdMap[sUIName].length;i++){
				sCmd = this.aUICmdMap[sUIName][i];
				this.oApp.exec("ENABLE_MESSAGE", [sCmd]);
			}
		}
	},
	
	_disableUI : function(sUIName){
		var i, nLen;
		
		this.nUIStatus = 0;
		
		var welUI = this.htWrappedUIList[sUIName];
		var elUI = this.htUIList[sUIName];
		if(!welUI){
			return;
		}
		welUI.addClass("off");
		welUI.removeClass("hover");
		
		var aAllBtns = elUI.getElementsByTagName("BUTTON");
		for(i=0, nLen=aAllBtns.length; i<nLen; i++){
			aAllBtns[i].disabled = true;
		}

		// disable related commands
		var sCmd = "";
		if(this.aUICmdMap[sUIName]){
			for(i=0; i<this.aUICmdMap[sUIName].length;i++){
				sCmd = this.aUICmdMap[sUIName][i];
				this.oApp.exec("DISABLE_MESSAGE", [sCmd]);
			}
		}
	},
	
	_getAffectedElements : function(el){
		var elLi, welLi;
		
		// ¹öÆ° Å¬¸¯½Ã¿¡ return false¸¦ ÇØ ÁÖÁö ¾ÊÀ¸¸é chrome¿¡¼­ ¹öÆ°ÀÌ Æ÷Ä¿½º °¡Á®°¡ ¹ö¸².
		// ¿¡µðÅÍ ·Îµù ½Ã¿¡ ÀÏ°ýÃ³¸® ÇÒ °æ¿ì ·Îµù ¼Óµµ°¡ ´À·ÁÁüÀ¸·Î hover½Ã¿¡ ÇÏ³ª¾¿ Ã³¸®
		if(!el.bSE2_MDCancelled){
			el.bSE2_MDCancelled = true;
			var aBtns = el.getElementsByTagName("BUTTON");
			
			for(var i=0, nLen=aBtns.length; i<nLen; i++){
				aBtns[i].onmousedown = function(){return false;};
			}
		}

		if(!el || !el.tagName){ return []; }

		if((elLi = el).tagName == "BUTTON"){
			// typical button
			// <LI>
			//   <BUTTON>
			if((elLi = elLi.parentNode) && elLi.tagName == "LI" && this.rxUI.test(elLi.className)){
				return [jindo.$Element(elLi)];
			}

			// button pair
			// <LI>
			//   <SPAN>
			//     <BUTTON>
			//   <SPAN>
			//     <BUTTON>
			elLi = el;
			if((elLi = elLi.parentNode.parentNode) && elLi.tagName == "LI" && (welLi = jindo.$Element(elLi)).hasClass("se2_pair")){
				return [welLi, jindo.$Element(el.parentNode)];
			}

			return [];
		}

		// span in a button
		if((elLi = el).tagName == "SPAN"){
			// <LI>
			//   <BUTTON>
			//     <SPAN>
			if((elLi = elLi.parentNode.parentNode) && elLi.tagName == "LI" && this.rxUI.test(elLi.className)){
				return [jindo.$Element(elLi)];
			}

			// <LI>
			//     <SPAN>
			//±Û°¨°ú ±Û¾ç½Ä
			if((elLi = elLi.parentNode) && elLi.tagName == "LI" && this.rxUI.test(elLi.className)){
				return [jindo.$Element(elLi)];
			}
		}

		return [];
	},
	
	/*
	 * ÅØ½ºÆ® Åø¹ÙÀÇ ¹öÆ° ¶ó¿îµù Ã³¸®
	 * [MOSS] "[UI°³¹ß1ÆÀ] ½º¸¶Æ®¿¡µðÅÍ ÅØ½ºÆ®Åø¹Ù¹öÆ° ¶ó¿îµùÃ³¸®°¡ÀÌµå" Âü°í
	 *		- ¹öÆ° ¶ó¿îµå Ã³¸®¸¦ À§ÇÑ tool_bg Å¬·¡½º Ãß°¡¸¦ À§ÇÑ ¿¤¸®¸ÕÆ® Å½»öÀº _buttonRound Å¬·¡½º »ç¿ë (AU Ãß°¡Å¬·¡½º)
	 */
	_setRoundedCornerButton : function(){
		var i, nLiLen, elLi, welLi, elSpan, aSingleLi, aFirstLi, aLastLi;
		
		aSingleLi = jindo.$$(">ul>li[class*=" + this.sUIClassPrefix + "]:only-child", this.elTextTool);
		
		// ´Üµ¶Çü ¹öÆ° ÁÂ/¿ìÃø ¶ó¿îµå Ã³¸®
		for(i=0, nLiLen=aSingleLi.length; i<nLiLen; i++){
			elLi = aSingleLi[i];
			welLi = jindo.$Element(elLi);
			
			if(welLi.hasClass("husky_seditor_ui_text_more") ||
				welLi.hasClass("husky_seditor_ui_photo_attach") || 
				welLi.hasClass("husky_seditor_ui_map_attach")){
				continue;
			}
			
			welLi.addClass("single_child");
			jindo.$Element(jindo.$$.getSingle('button>span._buttonRound', elLi)).addClass("tool_bg");
		}
		
		// ¹öÆ° ÁÂÃø ¶ó¿îµå Ã³¸®
		// ¡Ø ÁÖÀÇ: ´õº¸±â ÇÏÀ§ÀÇ ¹öÆ° ¶ó¿îµå Ã³¸®ÀÇ °æ¿ìµµ ÀÖÀ¸¹Ç·Î ¹Ù·Î ÇÏÀ§ ULÀÌ ¾Æ´Ñ °æ¿ìµµ ÀÖÀ½
		aFirstLi = jindo.$$("ul>li[class*=" + this.sUIClassPrefix + "]:first-child", this.elTextTool);
		
		for(i=0, nLiLen=aFirstLi.length; i<nLiLen; i++){
			elLi = aFirstLi[i];
			welLi = jindo.$Element(elLi);
			
			if(welLi.hasClass("husky_seditor_ui_fontName") ||
				welLi.hasClass("husky_seditor_ui_text_more") || 
				welLi.hasClass("husky_seditor_ui_photo_attach") || 
				welLi.hasClass("husky_seditor_ui_map_attach") || 
				welLi.hasClass("single_child")){
				continue;
			}
			
			welLi.addClass("first_child");
			jindo.$Element(jindo.$$.getSingle('button>span._buttonRound', elLi)).addClass("tool_bg");
		}
		
		// ¹öÆ° ¿ìÃø ¶ó¿îµå Ã³¸®
		// ¡Ø ÁÖÀÇ: ´õº¸±â ÇÏÀ§ÀÇ ¹öÆ° ¶ó¿îµå Ã³¸®ÀÇ °æ¿ìµµ ÀÖÀ¸¹Ç·Î ¹Ù·Î ÇÏÀ§ ULÀÌ ¾Æ´Ñ °æ¿ìµµ ÀÖÀ½
		aLastLi = jindo.$$("ul>li[class*=" + this.sUIClassPrefix + "]:last-child", this.elTextTool);
		
		for(i=0, nLiLen=aLastLi.length; i<nLiLen; i++){
			elLi = aLastLi[i];
			welLi = jindo.$Element(elLi);
			
			if(welLi.hasClass("husky_seditor_ui_fontSize") ||
				welLi.hasClass("husky_seditor_ui_text_more") || 
				welLi.hasClass("husky_seditor_ui_photo_attach") || 
				welLi.hasClass("husky_seditor_ui_map_attach") || 
				welLi.hasClass("single_child")){
				continue;
			}
			
			welLi.addClass("last_child");
			jindo.$Element(jindo.$$.getSingle('button>span._buttonRound', elLi)).addClass("tool_bg");
		}
	},
	
	$ON_REGISTER_UI_EVENT : function(sUIName, sEvent, sCmd, aParams){
		//[SMARTEDITORSUS-966][IE8 Ç¥ÁØ/IE 10] È£È¯ ¸ðµå¸¦ Á¦°ÅÇÏ°í »çÁø Ã·ºÎ ½Ã ¿¡µðÆÃ ¿µ¿ªÀÇ 
		//						Ä¿¼­ ÁÖÀ§¿¡ <sub><sup> ÅÂ±×°¡ ºÙ¾î¼­ ±ÛÀÚ°¡ ¸Å¿ì ÀÛ°Ô µÇ´Â Çö»ó
		//¿øÀÎ : ¾Æ·¡ÀÇ [SMARTEDITORSUS-901] ¼öÁ¤ ³»¿ë¿¡¼­ À­Ã·ÀÚ ¾Æ·§Ã·ÀÚ ÀÌº¥Æ® µî·Ï ½Ã 
		//ÇØ´ç ÇÃ·¯±×ÀÎÀÌ ¸¶Å©¾÷¿¡ ¾øÀ¸¸é this.htUIList¿¡ Á¸ÀçÇÏÁö ¾Ê¾Æ getsingle »ç¿ë½Ã »çÁøÃ·ºÎ¿¡ ÀÌº¥Æ®°¡ °É·ÈÀ½
		//ÇØ°á : this.htUIList¿¡ Á¸ÀçÇÏÁö ¾ÊÀ¸¸é ÀÌº¥Æ®¸¦ µî·ÏÇÏÁö ¾ÊÀ½
		if(!this.htUIList[sUIName]){
			return;
		}
		// map cmd & ui
		var elButton;
		if(!this.aUICmdMap[sUIName]){this.aUICmdMap[sUIName] = [];}
		this.aUICmdMap[sUIName][this.aUICmdMap[sUIName].length] = sCmd;
		//[SMARTEDITORSUS-901]ÇÃ·¯±×ÀÎ ÅÂ±× ÄÚµå Ãß°¡ ½Ã <li>ÅÂ±×¿Í<button>ÅÂ±× »çÀÌ¿¡ °³ÇàÀÌ ÀÖÀ¸¸é ÀÌº¥Æ®°¡ µî·ÏµÇÁö ¾Ê´Â Çö»ó
		//¿øÀÎ : IE9, Chrome, FF, Safari ¿¡¼­´Â ÅÂ±×¸¦ °³Çà ½Ã ±× °³ÇàÀ» text node·Î ÀÎ½ÄÇÏ¿© firstchild°¡ text ³ëµå°¡ µÇ¾î ¹öÆ° ÀÌº¥Æ®°¡ ÇÒ´çµÇÁö ¾ÊÀ½ 
		//ÇØ°á : firstchild¿¡ ÀÌº¥Æ®¸¦ °Å´Â °ÍÀÌ ¾Æ´Ï¶ó, child Áß button ÀÎ °Í¿¡ ÀÌº¥Æ®¸¦ °Éµµ·Ï º¯°æ
		elButton = jindo.$$.getSingle('button', this.htUIList[sUIName]);
	
		if(!elButton){return;}
		this.oApp.registerBrowserEvent(elButton, sEvent, sCmd, aParams);
	},

	getToolbarButtonByUIName : function(sUIName){
		return jindo.$$.getSingle("BUTTON", this.htUIList[sUIName]);
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to changing the editing mode using a Button element
 * @name hp_SE2M_EditingModeChanger.js
 */
nhn.husky.SE2M_EditingModeChanger = jindo.$Class({
	name : "SE2M_EditingModeChanger",
	htConversionMode : null,
	
	$init : function(elAppContainer, htConversionMode){
		this.htConversionMode = htConversionMode;
		this._assignHTMLElements(elAppContainer);
	},

	_assignHTMLElements : function(elAppContainer){
		elAppContainer = jindo.$(elAppContainer) || document;

		//@ec[
		this.elWYSIWYGButton = jindo.$$.getSingle("BUTTON.se2_to_editor", elAppContainer);
		this.elHTMLSrcButton = jindo.$$.getSingle("BUTTON.se2_to_html", elAppContainer);
		this.elTEXTButton = jindo.$$.getSingle("BUTTON.se2_to_text", elAppContainer);
		this.elModeToolbar = jindo.$$.getSingle("DIV.se2_conversion_mode", elAppContainer);		
		//@ec]

		this.welWYSIWYGButtonLi = jindo.$Element(this.elWYSIWYGButton.parentNode);
		this.welHTMLSrcButtonLi = jindo.$Element(this.elHTMLSrcButton.parentNode);
		this.welTEXTButtonLi = jindo.$Element(this.elTEXTButton.parentNode);
	},
	
	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["isUseModeChanger", jindo.$Fn(this.isUseModeChanger, this).bind()]);
	},
	
	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elWYSIWYGButton, "click", "EVENT_CHANGE_EDITING_MODE_CLICKED", ["WYSIWYG"]);
		this.oApp.registerBrowserEvent(this.elHTMLSrcButton, "click", "EVENT_CHANGE_EDITING_MODE_CLICKED", ["HTMLSrc"]);
		this.oApp.registerBrowserEvent(this.elTEXTButton, "click", "EVENT_CHANGE_EDITING_MODE_CLICKED", ["TEXT", false]);
		
		this.showModeChanger();
		
		if(this.isUseModeChanger() === false && this.oApp.isUseVerticalResizer() === false){
			this.elModeToolbar.style.display = "none";
		}
	},
	
	// [SMARTEDITORSUS-906][SMARTEDITORSUS-1433] Editing Mode »ç¿ë ¿©ºÎ Ã³¸® (true:»ç¿ëÇÔ/ false:»ç¿ëÇÏÁö ¾ÊÀ½)
	showModeChanger : function(){
		if(this.isUseModeChanger()){
			this.elWYSIWYGButton.style.display = 'block';
			this.elHTMLSrcButton.style.display = 'block';
			this.elTEXTButton.style.display = 'block';
		}else{
			this.elWYSIWYGButton.style.display = 'none';
			this.elHTMLSrcButton.style.display = 'none';
			this.elTEXTButton.style.display = 'none';
		}
	},
	
	isUseModeChanger : function(){
		return (typeof(this.htConversionMode) === 'undefined' || typeof(this.htConversionMode.bUseModeChanger) === 'undefined' || this.htConversionMode.bUseModeChanger === true) ? true : false;
	},
	
	$ON_EVENT_CHANGE_EDITING_MODE_CLICKED : function(sMode, bNoAlertMsg){
		if (sMode == 'TEXT') {
			//¿¡µðÅÍ ¿µ¿ª ³»¿¡ ¸ðµç ³»¿ë °¡Á®¿È. 
	    	var sContent = this.oApp.getIR();
	    	
			// ³»¿ëÀÌ ÀÖÀ¸¸é °æ°íÃ¢ ¶ç¿ì±â
			if (sContent.length > 0 && !bNoAlertMsg) {
				if ( !confirm(this.oApp.$MSG("SE2M_EditingModeChanger.confirmTextMode")) ) {
					return false;
				}
			}
			this.oApp.exec("CHANGE_EDITING_MODE", [sMode]);
		}else{
			this.oApp.exec("CHANGE_EDITING_MODE", [sMode]);
		}
		
		if ('HTMLSrc' == sMode) {
			this.oApp.exec('MSG_NOTIFY_CLICKCR', ['htmlmode']);
		} else if ('TEXT' == sMode) {
			this.oApp.exec('MSG_NOTIFY_CLICKCR', ['textmode']);
		} else {
			this.oApp.exec('MSG_NOTIFY_CLICKCR', ['editormode']);
		}
	},
	
	$ON_DISABLE_ALL_UI : function(htOptions){
		htOptions = htOptions || {};
		var waExceptions = jindo.$A(htOptions.aExceptions || []);

		if(waExceptions.has("mode_switcher")){
			return;
		}
		if(this.oApp.getEditingMode() == "WYSIWYG"){
			this.welWYSIWYGButtonLi.removeClass("active");
			this.elHTMLSrcButton.disabled = true;
			this.elTEXTButton.disabled = true;
		} else if (this.oApp.getEditingMode() == 'TEXT') {
			this.welTEXTButtonLi.removeClass("active");
			this.elWYSIWYGButton.disabled = true;
			this.elHTMLSrcButton.disabled = true;
		}else{
			this.welHTMLSrcButtonLi.removeClass("active");
			this.elWYSIWYGButton.disabled = true;
			this.elTEXTButton.disabled = true;
		}
	},
	
	$ON_ENABLE_ALL_UI : function(){
		if(this.oApp.getEditingMode() == "WYSIWYG"){
			this.welWYSIWYGButtonLi.addClass("active");
			this.elHTMLSrcButton.disabled = false;
			this.elTEXTButton.disabled = false;
		} else if (this.oApp.getEditingMode() == 'TEXT') {
			this.welTEXTButtonLi.addClass("active");
			this.elWYSIWYGButton.disabled = false;
			this.elHTMLSrcButton.disabled = false;
		}else{
			this.welHTMLSrcButtonLi.addClass("active");
			this.elWYSIWYGButton.disabled = false;
			this.elTEXTButton.disabled = false;
		}
	},

	$ON_CHANGE_EDITING_MODE : function(sMode){
		if(sMode == "HTMLSrc"){
			this.welWYSIWYGButtonLi.removeClass("active");
			this.welHTMLSrcButtonLi.addClass("active");
			this.welTEXTButtonLi.removeClass("active");
			
			this.elWYSIWYGButton.disabled = false;
			this.elHTMLSrcButton.disabled = true;
			this.elTEXTButton.disabled = false;
			this.oApp.exec("HIDE_ALL_DIALOG_LAYER");
			
			this.oApp.exec("DISABLE_ALL_UI", [{aExceptions:["mode_switcher"]}]);
		} else if (sMode == 'TEXT') {
			this.welWYSIWYGButtonLi.removeClass("active");
			this.welHTMLSrcButtonLi.removeClass("active");
			this.welTEXTButtonLi.addClass("active");
			
			this.elWYSIWYGButton.disabled = false;
			this.elHTMLSrcButton.disabled = false;
			this.elTEXTButton.disabled = true; 
			this.oApp.exec("HIDE_ALL_DIALOG_LAYER");
			this.oApp.exec("DISABLE_ALL_UI", [{aExceptions:["mode_switcher"]}]);
		}else{
			this.welWYSIWYGButtonLi.addClass("active");
			this.welHTMLSrcButtonLi.removeClass("active");
			this.welTEXTButtonLi.removeClass("active");

			this.elWYSIWYGButton.disabled = true;
			this.elHTMLSrcButton.disabled = false;
			this.elTEXTButton.disabled = false;
			
			this.oApp.exec("RESET_STYLE_STATUS");
			this.oApp.exec("ENABLE_ALL_UI", []);
		}
	}
});
//}
/*[
 * LOAD_CONTENTS_FIELD
 *
 * ¿¡µðÅÍ ÃÊ±âÈ­ ½Ã¿¡ ³Ñ¾î¿Â Contents(DB ÀúÀå °ª)ÇÊµå¸¦ ÀÐ¾î ¿¡µðÅÍ¿¡ ¼³Á¤ÇÑ´Ù.
 *
 * bDontAddUndo boolean Contents¸¦ ¼³Á¤ÇÏ¸é¼­ UNDO È÷½ºÅä¸®´Â Ãß°¡ ÇÏÁö¾Ê´Â´Ù.
 *
---------------------------------------------------------------------------]*/
/*[
 * UPDATE_IR_FIELD
 *
 * ¿¡µðÅÍÀÇ IR°ªÀ» IRÇÊµå¿¡ ¼³Á¤ ÇÑ´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * CHANGE_EDITING_MODE
 *
 * ¿¡µðÅÍÀÇ ÆíÁý ¸ðµå¸¦ º¯°æÇÑ´Ù.
 *
 * sMode string ÀüÈ¯ ÇÒ ¸ðµå¸í
 * bNoFocus boolean ¸ðµå ÀüÈ¯ ÈÄ¿¡ ¿¡µðÅÍ¿¡ Æ÷Ä¿½º¸¦ °­Á¦·Î ÇÒ´çÇÏÁö ¾Ê´Â´Ù.
 *
---------------------------------------------------------------------------]*/
/*[
 * FOCUS
 *
 * ¿¡µðÅÍ ÆíÁý ¿µ¿ª¿¡ Æ÷Ä¿½º¸¦ ÁØ´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * SET_IR
 *
 * IR°ªÀ» ¿¡µðÅÍ¿¡ ¼³Á¤ ÇÑ´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * REGISTER_EDITING_AREA
 *
 * ÆíÁý ¿µ¿ªÀ» ÇÃ·¯±×ÀÎÀ» µî·Ï ½ÃÅ²´Ù. ¿øÈ°ÇÑ ¸ðµå ÀüÈ¯°ú IR°ª °øÀ¯µî¸¦ À§ÇØ¼­ ÃÊ±âÈ­ ½Ã¿¡ µî·ÏÀÌ ÇÊ¿äÇÏ´Ù. 
 *
 * oEditingAreaPlugin object ÆíÁý ¿µ¿ª ÇÃ·¯±×ÀÎ ÀÎ½ºÅÏ½º
 *
---------------------------------------------------------------------------]*/
/*[
 * MSG_EDITING_AREA_RESIZE_STARTED
 *
 * ÆíÁý ¿µ¿ª »çÀÌÁî Á¶ÀýÀÌ ½ÃÀÛ µÇ¾úÀ½À» ¾Ë¸®´Â ¸Þ½ÃÁö.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * RESIZE_EDITING_AREA
 *
 * ÆíÁý ¿µ¿ª »çÀÌÁî¸¦ ¼³Á¤ ÇÑ´Ù. º¯°æ ÀüÈÄ¿¡ MSG_EDITIING_AREA_RESIZE_STARTED/MSG_EDITING_AREA_RESIZE_ENED¸¦ ¹ß»ý ½ÃÄÑ Áà¾ß µÈ´Ù.
 *
 * ipNewWidth number »õ Æø
 * ipNewHeight number »õ ³ôÀÌ
 *
---------------------------------------------------------------------------]*/
/*[
 * RESIZE_EDITING_AREA_BY
 *
 * ÆíÁý ¿µ¿ª »çÀÌÁî¸¦ ´Ã¸®°Å³ª ÁÙÀÎ´Ù. º¯°æ ÀüÈÄ¿¡ MSG_EDITIING_AREA_RESIZE_STARTED/MSG_EDITING_AREA_RESIZE_ENED¸¦ ¹ß»ý ½ÃÄÑ Áà¾ß µÈ´Ù.
 * º¯°æÄ¡¸¦ ÀÔ·ÂÇÏ¸é ¿ø·¡ »çÀÌÁî¿¡¼­ º¯°æÇÏ¿© px·Î Àû¿ëÇÏ¸ç, width°¡ %·Î ¼³Á¤µÈ °æ¿ì¿¡´Â Æø º¯°æÄ¡°¡ ÀÔ·ÂµÇ¾îµµ Àû¿ëµÇÁö ¾Ê´Â´Ù.
 *
 * ipWidthChange number Æø º¯°æÄ¡
 * ipHeightChange number ³ôÀÌ º¯°æÄ¡
 *
---------------------------------------------------------------------------]*/
/*[
 * MSG_EDITING_AREA_RESIZE_ENDED
 *
 * ÆíÁý ¿µ¿ª »çÀÌÁî Á¶ÀýÀÌ ³¡³µÀ½À» ¾Ë¸®´Â ¸Þ½ÃÁö.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc IR °ª°ú º¹¼ö°³ÀÇ ÆíÁý ¿µ¿ªÀ» °ü¸®ÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.SE_EditingAreaManager = jindo.$Class({
	name : "SE_EditingAreaManager",
	
	// Currently active plugin instance(SE_EditingArea_???)
	oActivePlugin : null,
	
	// Intermediate Representation of the content being edited.
	// This should be a textarea element.
	elContentsField : null,
	
	bIsDirty : false,
	bAutoResize : false, // [SMARTEDITORSUS-677] ¿¡µðÅÍÀÇ ÀÚµ¿È®Àå ±â´É On/Off ¿©ºÎ
	
	$init : function(sDefaultEditingMode, elContentsField, oDimension, fOnBeforeUnload, elAppContainer){
		this.sDefaultEditingMode = sDefaultEditingMode;
		this.elContentsField = jindo.$(elContentsField);
		this._assignHTMLElements(elAppContainer);
		this.fOnBeforeUnload = fOnBeforeUnload;
		
		this.oEditingMode = {};
		
		this.elContentsField.style.display = "none";
		
		this.nMinWidth = parseInt((oDimension.nMinWidth || 60), 10);
		this.nMinHeight = parseInt((oDimension.nMinHeight || 60), 10);
		
		var oWidth = this._getSize([oDimension.nWidth, oDimension.width, this.elEditingAreaContainer.offsetWidth], this.nMinWidth);
		var oHeight = this._getSize([oDimension.nHeight, oDimension.height, this.elEditingAreaContainer.offsetHeight], this.nMinHeight);

		this.elEditingAreaContainer.style.width = oWidth.nSize + oWidth.sUnit;
		this.elEditingAreaContainer.style.height = oHeight.nSize + oHeight.sUnit;
		
		if(oWidth.sUnit === "px"){
			elAppContainer.style.width = (oWidth.nSize + 2) + "px";	
		}else if(oWidth.sUnit === "%"){
			elAppContainer.style.minWidth = this.nMinWidth + "px";
		}
	},
	
	_getSize : function(aSize, nMin){
		var i, nLen, aRxResult, nSize, sUnit, sDefaultUnit = "px";
		
		nMin = parseInt(nMin, 10);
		
		for(i=0, nLen=aSize.length; i<nLen; i++){
			if(!aSize[i]){
				continue;
			}
			
			if(!isNaN(aSize[i])){
				nSize = parseInt(aSize[i], 10);
				sUnit = sDefaultUnit;
				break;
			}
			
			aRxResult = /([0-9]+)(.*)/i.exec(aSize[i]);
						
			if(!aRxResult || aRxResult.length < 2 || aRxResult[1] <= 0){
				continue;
			}
			
			nSize = parseInt(aRxResult[1], 10);
			sUnit = aRxResult[2];
						
			if(!sUnit){
				sUnit = sDefaultUnit;
			}
			
			if(nSize < nMin && sUnit === sDefaultUnit){
				nSize = nMin;
			}
			
			break;
		}
				
		if(!sUnit){
			sUnit = sDefaultUnit;
		}
		
		if(isNaN(nSize) || (nSize < nMin && sUnit === sDefaultUnit)){
			nSize = nMin;
		}
		
		return {nSize : nSize, sUnit : sUnit};
	},

	_assignHTMLElements : function(elAppContainer){
		//@ec[
		this.elEditingAreaContainer = jindo.$$.getSingle("DIV.husky_seditor_editing_area_container", elAppContainer);
		//@ec]
		
		// [SMARTEDITORSUS-1585]
		this.toolbarArea = jindo.$$.getSingle(".se2_tool", elAppContainer);
		// --[SMARTEDITORSUS-1585]
	},

	$BEFORE_MSG_APP_READY : function(msg){
		this.oApp.exec("ADD_APP_PROPERTY", ["elEditingAreaContainer", this.elEditingAreaContainer]);
		this.oApp.exec("ADD_APP_PROPERTY", ["welEditingAreaContainer", jindo.$Element(this.elEditingAreaContainer)]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getEditingAreaHeight", jindo.$Fn(this.getEditingAreaHeight, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getEditingAreaWidth", jindo.$Fn(this.getEditingAreaWidth, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getRawContents", jindo.$Fn(this.getRawContents, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getContents", jindo.$Fn(this.getContents, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getIR", jindo.$Fn(this.getIR, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["setContents", this.setContents]);
		this.oApp.exec("ADD_APP_PROPERTY", ["setIR", this.setIR]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getEditingMode", jindo.$Fn(this.getEditingMode, this).bind()]);
	},

	$ON_MSG_APP_READY : function(){
		this.htOptions =  this.oApp.htOptions[this.name] || {};
		this.sDefaultEditingMode = this.htOptions["sDefaultEditingMode"] || this.sDefaultEditingMode;
		this.iframeWindow = this.oApp.getWYSIWYGWindow();
		this.oApp.exec("REGISTER_CONVERTERS", []);
		this.oApp.exec("CHANGE_EDITING_MODE", [this.sDefaultEditingMode, true]);
		this.oApp.exec("LOAD_CONTENTS_FIELD", [false]);
		
		//[SMARTEDITORSUS-1327] IE 7/8¿¡¼­ ALT+0À¸·Î ÆË¾÷ ¶ç¿ì°í escÅ¬¸¯½Ã ÆË¾÷Ã¢ ´ÝÈ÷°Ô ÇÏ·Á¸é ¾Æ·¡ ºÎºÐ ²À ÇÊ¿äÇÔ. 
		this.oApp.exec("REGISTER_HOTKEY", ["esc", "CLOSE_LAYER_POPUP", [], document]); 
		
		if(!!this.fOnBeforeUnload){
			window.onbeforeunload = this.fOnBeforeUnload;
		}else{
			window.onbeforeunload = jindo.$Fn(function(){
				// [SMARTEDITORSUS-1028][SMARTEDITORSUS-1517] QuickEditor ¼³Á¤ API °³¼±À¸·Î, submit ÀÌÈÄ ¹ß»ýÇÏ°Ô µÇ´Â beforeunload ÀÌº¥Æ® ÇÚµé¸µ Á¦°Å
				//this.oApp.exec("MSG_BEFOREUNLOAD_FIRED");
				// --// [SMARTEDITORSUS-1028][SMARTEDITORSUS-1517]
				//if(this.getContents() != this.elContentsField.value || this.bIsDirty){
				if(this.getRawContents() != this.sCurrentRawContents || this.bIsDirty){
					return this.oApp.$MSG("SE_EditingAreaManager.onExit");
				}
			}, this).bind();
		}
	},
	
	$ON_CLOSE_LAYER_POPUP : function() {
         this.oApp.exec("ENABLE_ALL_UI");                // ¸ðµç UI È°¼ºÈ­.
         this.oApp.exec("DESELECT_UI", ["helpPopup"]);       
         this.oApp.exec("HIDE_ALL_DIALOG_LAYER", []);
         this.oApp.exec("HIDE_EDITING_AREA_COVER");              // ÆíÁý ¿µ¿ª È°¼ºÈ­.

         this.oApp.exec("FOCUS");
	},  
 
	$AFTER_MSG_APP_READY : function(){
		this.oApp.exec("UPDATE_RAW_CONTENTS");
		
		if(!!this.oApp.htOptions[this.name] && this.oApp.htOptions[this.name].bAutoResize){
			this.bAutoResize = this.oApp.htOptions[this.name].bAutoResize;
		}
		
		this.startAutoResize();	// [SMARTEDITORSUS-677] ÆíÁý¿µ¿ª ÀÚµ¿ È®Àå ¿É¼ÇÀÌ TRUEÀÌ¸é ÀÚµ¿È®Àå ½ÃÀÛ
	},
	
	$ON_LOAD_CONTENTS_FIELD : function(bDontAddUndo){
		var sContentsFieldValue = this.elContentsField.value;
		
		// [SMARTEDITORSUS-177] [IE9] ±Û ¾²±â, ¼öÁ¤ ½Ã¿¡ elContentsField ¿¡ µé¾î°£ °ø¹éÀ» Á¦°Å
		// [SMARTEDITORSUS-312] [FF4] ÀÎ¿ë±¸ Ã¹¹øÂ°,µÎ¹øÂ° µðÀÚÀÎ 1È¸ ¼±ÅÃ ½Ã ¿¡µðÅÍ¿¡ Àû¿ëµÇÁö ¾ÊÀ½
		sContentsFieldValue = sContentsFieldValue.replace(/^\s+/, "");
				
		this.oApp.exec("SET_CONTENTS", [sContentsFieldValue, bDontAddUndo]);
	},
	
	// ÇöÀç contents¸¦ formÀÇ textarea¿¡ ¼¼ÆÃ ÇØ ÁÜ.
	// form submit Àü¿¡ ÀÌ ºÎºÐÀ» ½ÇÇà½ÃÄÑ¾ß µÊ.
	$ON_UPDATE_CONTENTS_FIELD : function(){
		//this.oIRField.value = this.oApp.getIR();
		this.elContentsField.value = this.oApp.getContents();
		this.oApp.exec("UPDATE_RAW_CONTENTS");
		//this.sCurrentRawContents = this.elContentsField.value;
	},
	
	// ¿¡µðÅÍÀÇ ÇöÀç »óÅÂ¸¦ ±â¾ïÇØ µÒ. ÆäÀÌÁö¸¦ ¶°³¯ ¶§ ÀÌ °ªÀÌ º¯°æ µÆ´ÂÁö È®ÀÎ ÇØ¼­ ³»¿ëÀÌ º¯°æ µÆ´Ù´Â °æ°íÃ¢À» ¶ç¿ò
	// RawContents ´ë½Å contents¸¦ ÀÌ¿ëÇØµµ µÇÁö¸¸, contents È¹µæÀ» À§ÇØ¼­´Â º¯È¯±â¸¦ ½ÇÇàÇØ¾ß µÇ±â ¶§¹®¿¡ RawContents ÀÌ¿ë
	$ON_UPDATE_RAW_CONTENTS : function(){
		this.sCurrentRawContents = this.oApp.getRawContents();
	},
	
	$BEFORE_CHANGE_EDITING_MODE : function(sMode){
		if(!this.oEditingMode[sMode]){
			return false;
		}
		
		this.stopAutoResize();	// [SMARTEDITORSUS-677] ÇØ´ç ÆíÁý ¸ðµå¿¡¼­ÀÇ ÀÚµ¿È®ÀåÀ» ÁßÁöÇÔ
		
		this._oPrevActivePlugin = this.oActivePlugin;
		this.oActivePlugin = this.oEditingMode[sMode];
	},

	$AFTER_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		if(this._oPrevActivePlugin){
			var sIR = this._oPrevActivePlugin.getIR();
			this.oApp.exec("SET_IR", [sIR]);

			//this.oApp.exec("ENABLE_UI", [this._oPrevActivePlugin.sMode]);
			
			this._setEditingAreaDimension();
		}
		//this.oApp.exec("DISABLE_UI", [this.oActivePlugin.sMode]);
		
		this.startAutoResize();	// [SMARTEDITORSUS-677] º¯°æµÈ ÆíÁý ¸ðµå¿¡¼­ÀÇ ÀÚµ¿È®ÀåÀ» ½ÃÀÛ

		if(!bNoFocus){
			this.oApp.delayedExec("FOCUS", [], 0);
		}
	},
	
	/** 
	 * ÆäÀÌÁö¸¦ ¶°³¯ ¶§ alertÀ» Ç¥½ÃÇÒÁö ¿©ºÎ¸¦ ¼ÂÆÃÇÏ´Â ÇÔ¼ö.
	 */
	$ON_SET_IS_DIRTY : function(bIsDirty){
		this.bIsDirty = bIsDirty;
	},

	$ON_FOCUS : function(){
		if(!this.oActivePlugin || typeof this.oActivePlugin.setIR != "function"){
			return;
		}

		// [SMARTEDITORSUS-599] ipad ´ëÀÀ ÀÌ½´.
		// ios5¿¡¼­´Â this.iframe.contentWindow focus°¡ ¾ø¾î¼­ »ý±ä ÀÌ½´. 
		// document°¡ ¾Æ´Ñ window¿¡ focus() ÁÖ¾î¾ß¸¸ º»¹®¿¡ focus°¡ °¡°í ÀÔ·ÂÀÌµÊ.
		
		//[SMARTEDITORSUS-1017] [iOS5´ëÀÀ] ¸ðµå ÀüÈ¯ ½Ã textarea¿¡ Æ÷Ä¿½º°¡ ÀÖ¾îµµ ±ÛÀÚ°¡ ÀÔ·ÂÀÌ ¾ÈµÇ´Â Çö»ó
		//¿øÀÎ : WYSIWYG¸ðµå°¡ ¾Æ´Ò ¶§¿¡µµ iframeÀÇ contentWindow¿¡ focus°¡ °¡¸é¼­ focus±â´ÉÀÌ ÀÛµ¿ÇÏÁö ¾ÊÀ½
		//ÇØ°á : WYSIWYG¸ðµå ÀÏ¶§¸¸ ½ÇÇà µÇµµ·Ï Á¶°Ç½Ä Ãß°¡ ¹× ±âÁ¸¿¡ blurÃ³¸® ÄÚµå »èÁ¦
		//[SMARTEDITORSUS-1594] Å©·Ò¿¡¼­ À¥Á¢±Ù¼º¿ë Å°·Î ºüÁ®³ª°£ ÈÄ ´Ù½Ã ÁøÀÔ½Ã °£È¤ Æ÷Ä¿½ÌÀÌ ¾ÈµÇ´Â ¹®Á¦°¡ ÀÖ¾î iframe¿¡ Æ÷Ä¿½ÌÀ» ¸ÕÀú ÁÖµµ·Ï ¼öÁ¤
		if(!!this.iframeWindow && this.iframeWindow.document.hasFocus && !this.iframeWindow.document.hasFocus() && this.oActivePlugin.sMode == "WYSIWYG"){
			this.iframeWindow.focus();
		}
		
		this.oActivePlugin.focus();
	},
	
	$ON_IE_FOCUS : function(){
		if(!this.oApp.oNavigator.ie){
			return;
		}
		this.oApp.exec("FOCUS");
	},
	
	$ON_SET_CONTENTS : function(sContents, bDontAddUndoHistory){
		this.setContents(sContents, bDontAddUndoHistory);
	},

	$BEFORE_SET_IR : function(sIR, bDontAddUndoHistory){
		bDontAddUndoHistory = bDontAddUndoHistory || false;
		if(!bDontAddUndoHistory){
			this.oApp.exec("RECORD_UNDO_ACTION", ["BEFORE SET CONTENTS", {sSaveTarget:"BODY"}]);
		}
	},

	$ON_SET_IR : function(sIR){
		if(!this.oActivePlugin || typeof this.oActivePlugin.setIR != "function"){
			return;
		}

		this.oActivePlugin.setIR(sIR);
	},

	$AFTER_SET_IR : function(sIR, bDontAddUndoHistory){
		bDontAddUndoHistory = bDontAddUndoHistory || false;
		if(!bDontAddUndoHistory){
			this.oApp.exec("RECORD_UNDO_ACTION", ["AFTER SET CONTENTS", {sSaveTarget:"BODY"}]);
		}
	},

	$ON_REGISTER_EDITING_AREA : function(oEditingAreaPlugin){
		this.oEditingMode[oEditingAreaPlugin.sMode] = oEditingAreaPlugin;
		if(oEditingAreaPlugin.sMode == 'WYSIWYG'){
			this.attachDocumentEvents(oEditingAreaPlugin.oEditingArea);
		}
		this._setEditingAreaDimension(oEditingAreaPlugin);
	},

	$ON_MSG_EDITING_AREA_RESIZE_STARTED : function(){
		// [SMARTEDITORSUS-1585] ±Û°¨, ±Û¾ç½Ä, ±ÛÀå½ÄÀ» ¿­¾úÀ» ¶§ ¸®»çÀÌÂ¡ÀÌ ¹ß»ýÇÏ¸é Ä¿¹ö¿ë ·¹ÀÌ¾î°¡ »ç¶óÁö´Â ¹®Á¦ °³¼±
		this._isLayerReasonablyShown = false;
		
		var elSelectedUI = jindo.$$.getSingle("ul[class^='se2_itool']>li.active", this.toolbarArea, {oneTimeOffCache : true});
		if(elSelectedUI){
			var elSelectedUIParent = elSelectedUI.parentNode;
		}

		// ±Û°¨ ¹öÆ°À» Æ÷ÇÔÇÑ ºÎ¸ð´Â ul.se2_itool2, ±ÛÀå½Ä, ±Û¾ç½Ä ¹öÆ°À» Æ÷ÇÔÇÑ ºÎ¸ð´Â ul.se2_itool4
		if(elSelectedUIParent && (elSelectedUIParent.className == "se2_itool2" || elSelectedUIParent.className == "se2_itool4")){
			this._isLayerReasonablyShown = true;
		}
		// --[SMARTEDITORSUS-1585]
		
		this._fitElementInEditingArea(this.elEditingAreaContainer);
		this.oApp.exec("STOP_AUTORESIZE_EDITING_AREA");	// [SMARTEDITORSUS-677] »ç¿ëÀÚ°¡ ÆíÁý¿µ¿ª »çÀÌÁî¸¦ º¯°æÇÏ¸é ÀÚµ¿È®Àå ±â´É ÁßÁö
		this.oApp.exec("SHOW_EDITING_AREA_COVER");
		this.elEditingAreaContainer.style.overflow = "hidden";
//		this.elResizingBoard.style.display = "block";

		this.iStartingHeight = parseInt(this.elEditingAreaContainer.style.height, 10);
	},
	
	/**
	 * [SMARTEDITORSUS-677] ÆíÁý¿µ¿ª ÀÚµ¿È®Àå ±â´ÉÀ» ÁßÁöÇÔ
	 */
	$ON_STOP_AUTORESIZE_EDITING_AREA : function(){
		if(!this.bAutoResize){
			return;
		}
		
		this.stopAutoResize();
		this.bAutoResize = false;
	},
	
	/**
	 * [SMARTEDITORSUS-677] ÇØ´ç ÆíÁý ¸ðµå¿¡¼­ÀÇ ÀÚµ¿È®ÀåÀ» ½ÃÀÛÇÔ
	 */
	startAutoResize : function(){
		if(!this.bAutoResize || !this.oActivePlugin || typeof this.oActivePlugin.startAutoResize != "function"){
			return;
		}
		
		this.oActivePlugin.startAutoResize();
	},
	
	/**
	 * [SMARTEDITORSUS-677] ÇØ´ç ÆíÁý ¸ðµå¿¡¼­ÀÇ ÀÚµ¿È®ÀåÀ» ÁßÁöÇÔ
	 */
	stopAutoResize : function(){
		if(!this.bAutoResize || !this.oActivePlugin || typeof this.oActivePlugin.stopAutoResize != "function"){
			return;
		}
		
		this.oActivePlugin.stopAutoResize();
	},
	
	$ON_RESIZE_EDITING_AREA: function(ipNewWidth, ipNewHeight){
		if(ipNewWidth !== null && typeof ipNewWidth !== "undefined"){
			this._resizeWidth(ipNewWidth, "px");	
		}
		if(ipNewHeight !== null && typeof ipNewHeight !== "undefined"){
			this._resizeHeight(ipNewHeight, "px");
		}
		
		this._fitElementInEditingArea(this.elResizingBoard);
		this._setEditingAreaDimension();
	},
	
	_resizeWidth : function(ipNewWidth, sUnit){
		var iNewWidth = parseInt(ipNewWidth, 10);
		
		if(iNewWidth < this.nMinWidth){
			iNewWidth = this.nMinWidth;
		}
		
		if(ipNewWidth){		
			this.elEditingAreaContainer.style.width = iNewWidth + sUnit;			
		}
	},
	
	_resizeHeight : function(ipNewHeight, sUnit){
		var iNewHeight = parseInt(ipNewHeight, 10);
		
		if(iNewHeight < this.nMinHeight){
			iNewHeight = this.nMinHeight;
		}

		if(ipNewHeight){
			this.elEditingAreaContainer.style.height = iNewHeight + sUnit;
		}
	},
	
	$ON_RESIZE_EDITING_AREA_BY : function(ipWidthChange, ipHeightChange){
		var iWidthChange = parseInt(ipWidthChange, 10);
		var iHeightChange = parseInt(ipHeightChange, 10);
		var iWidth;
		var iHeight;
		
		if(ipWidthChange !== 0 && this.elEditingAreaContainer.style.width.indexOf("%") === -1){
			iWidth = this.elEditingAreaContainer.style.width?parseInt(this.elEditingAreaContainer.style.width, 10)+iWidthChange:null;
		}
		
		if(iHeightChange !== 0){
			iHeight = this.elEditingAreaContainer.style.height?this.iStartingHeight+iHeightChange:null;
		}
		
		if(!ipWidthChange && !iHeightChange){
			return;
		}
				
		this.oApp.exec("RESIZE_EDITING_AREA", [iWidth, iHeight]);
	},
	
	$ON_MSG_EDITING_AREA_RESIZE_ENDED : function(FnMouseDown, FnMouseMove, FnMouseUp){
		// [SMARTEDITORSUS-1585] ±Û°¨, ±Û¾ç½Ä, ±ÛÀå½ÄÀ» ¿­¾úÀ» ¶§ ¸®»çÀÌÂ¡ÀÌ ¹ß»ýÇÏ¸é Ä¿¹ö¿ë ·¹ÀÌ¾î°¡ »ç¶óÁö´Â ¹®Á¦ °³¼±
		if(!this._isLayerReasonablyShown){
			this.oApp.exec("HIDE_EDITING_AREA_COVER");
		}
		// --[SMARTEDITORSUS-1585]
		
		this.elEditingAreaContainer.style.overflow = "";
//		this.elResizingBoard.style.display = "none";
		this._setEditingAreaDimension();
	},

	$ON_SHOW_EDITING_AREA_COVER : function(){
//		this.elEditingAreaContainer.style.overflow = "hidden";
		if(!this.elResizingBoard){
			this.createCoverDiv();
		}
		this.elResizingBoard.style.display = "block";
	},
	
	$ON_HIDE_EDITING_AREA_COVER : function(){
//		this.elEditingAreaContainer.style.overflow = "";
		if(!this.elResizingBoard){
			return;
		}
		this.elResizingBoard.style.display = "none";
	},
	
	$ON_KEEP_WITHIN_EDITINGAREA : function(elLayer, nHeight){
		var nTop = parseInt(elLayer.style.top, 10);
		if(nTop + elLayer.offsetHeight > this.oApp.elEditingAreaContainer.offsetHeight){
			if(typeof nHeight == "number"){
				elLayer.style.top = nTop - elLayer.offsetHeight - nHeight + "px";
			}else{
				elLayer.style.top = this.oApp.elEditingAreaContainer.offsetHeight - elLayer.offsetHeight + "px";
			}
		}

		var nLeft = parseInt(elLayer.style.left, 10);
		if(nLeft + elLayer.offsetWidth > this.oApp.elEditingAreaContainer.offsetWidth){
			elLayer.style.left = this.oApp.elEditingAreaContainer.offsetWidth - elLayer.offsetWidth + "px";
		}
	},

	$ON_EVENT_EDITING_AREA_KEYDOWN : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_EVENT_EDITING_AREA_MOUSEDOWN : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_EVENT_EDITING_AREA_SCROLL : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	_setEditingAreaDimension : function(oEditingAreaPlugin){
		oEditingAreaPlugin = oEditingAreaPlugin || this.oActivePlugin;
		this._fitElementInEditingArea(oEditingAreaPlugin.elEditingArea);
	},
	
	_fitElementInEditingArea : function(el){
		el.style.height = this.elEditingAreaContainer.offsetHeight+"px";
//		el.style.width = this.elEditingAreaContainer.offsetWidth+"px";
//		el.style.width = this.elEditingAreaContainer.style.width || (this.elEditingAreaContainer.offsetWidth+"px");
	},
	
	attachDocumentEvents : function(doc){
		this.oApp.registerBrowserEvent(doc, "click", "EVENT_EDITING_AREA_CLICK");
		this.oApp.registerBrowserEvent(doc, "dblclick", "EVENT_EDITING_AREA_DBLCLICK");
		this.oApp.registerBrowserEvent(doc, "mousedown", "EVENT_EDITING_AREA_MOUSEDOWN");
		this.oApp.registerBrowserEvent(doc, "mousemove", "EVENT_EDITING_AREA_MOUSEMOVE");
		this.oApp.registerBrowserEvent(doc, "mouseup", "EVENT_EDITING_AREA_MOUSEUP");
		this.oApp.registerBrowserEvent(doc, "mouseout", "EVENT_EDITING_AREA_MOUSEOUT");
		this.oApp.registerBrowserEvent(doc, "mousewheel", "EVENT_EDITING_AREA_MOUSEWHEEL");
		this.oApp.registerBrowserEvent(doc, "keydown", "EVENT_EDITING_AREA_KEYDOWN");
		this.oApp.registerBrowserEvent(doc, "keypress", "EVENT_EDITING_AREA_KEYPRESS");
		this.oApp.registerBrowserEvent(doc, "keyup", "EVENT_EDITING_AREA_KEYUP");
		this.oApp.registerBrowserEvent(doc, "scroll", "EVENT_EDITING_AREA_SCROLL");
	},
	
	createCoverDiv : function(){
		this.elResizingBoard = document.createElement("DIV");

		this.elEditingAreaContainer.insertBefore(this.elResizingBoard, this.elEditingAreaContainer.firstChild);
		this.elResizingBoard.style.position = "absolute";
		this.elResizingBoard.style.background = "#000000";
		this.elResizingBoard.style.zIndex=100;
		this.elResizingBoard.style.border=1;
		
		this.elResizingBoard.style["opacity"] = 0.0;
		this.elResizingBoard.style.filter="alpha(opacity=0.0)";
		this.elResizingBoard.style["MozOpacity"]=0.0;
		this.elResizingBoard.style["-moz-opacity"] = 0.0;
		this.elResizingBoard.style["-khtml-opacity"] = 0.0;
		
		this._fitElementInEditingArea(this.elResizingBoard);
		this.elResizingBoard.style.width = this.elEditingAreaContainer.offsetWidth+"px";
		
		this.elResizingBoard.style.display = "none";
	},

	$ON_GET_COVER_DIV : function(sAttr,oReturn){
		if(!!this.elResizingBoard) {
			oReturn[sAttr] = this.elResizingBoard;
		}
	},
	
	getIR : function(){
		if(!this.oActivePlugin){
			return "";
		}
		return this.oActivePlugin.getIR();
	},

	setIR : function(sIR, bDontAddUndo){
		this.oApp.exec("SET_IR", [sIR, bDontAddUndo]);
	},

	getRawContents : function(){
		if(!this.oActivePlugin){
			return "";
		}
		return this.oActivePlugin.getRawContents();
	},
	
	getContents : function(){
		var sIR = this.oApp.getIR();
		var sContents;

		if(this.oApp.applyConverter){
			sContents = this.oApp.applyConverter("IR_TO_DB", sIR, this.oApp.getWYSIWYGDocument());
		}else{
			sContents = sIR;
		}
		
		sContents = this._cleanContents(sContents);

		return sContents;
	},
	
	_cleanContents : function(sContents){
		return sContents.replace(new RegExp("(<img [^>]*>)"+unescape("%uFEFF")+"", "ig"), "$1");
	},

	setContents : function(sContents, bDontAddUndo){
		var sIR;

		if(this.oApp.applyConverter){
			sIR = this.oApp.applyConverter("DB_TO_IR", sContents, this.oApp.getWYSIWYGDocument());
		}else{
			sIR = sContents;
		}

		this.oApp.exec("SET_IR", [sIR, bDontAddUndo]);
	},
	
	getEditingMode : function(){
		return this.oActivePlugin.sMode;
	},
	
	getEditingAreaWidth : function(){
		return this.elEditingAreaContainer.offsetWidth;
	},
	
	getEditingAreaHeight : function(){
		return this.elEditingAreaContainer.offsetHeight;
	}
});
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to resizing the editing area vertically
 * @name hp_SE_EditingAreaVerticalResizer.js
 */
nhn.husky.SE_EditingAreaVerticalResizer = jindo.$Class({
	name : "SE_EditingAreaVerticalResizer",
	
	oResizeGrip : null,
	sCookieNotice : "bHideResizeNotice",
	
	nEditingAreaMinHeight : null,	// [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ªÀÇ ÃÖ¼Ò ³ôÀÌ
	htConversionMode : null,
	
	$init : function(elAppContainer, htConversionMode){
		this.htConversionMode = htConversionMode;
		this._assignHTMLElements(elAppContainer);
	},
	
	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["isUseVerticalResizer", jindo.$Fn(this.isUseVerticalResizer, this).bind()]);
	},
	
	$ON_MSG_APP_READY : function(){
		
		//[SMARTEDITORSUS-941][iOS5´ëÀÀ]¾ÆÀÌÆÐµåÀÇ ÀÚµ¿ È®Àå ±â´ÉÀÌ µ¿ÀÛÇÏÁö ¾ÊÀ» ¶§ ¿¡µðÅÍ Ã¢º¸´Ù ±ä ³»¿ëÀ» ÀÛ¼ºÇÏ¸é ¿¡µðÅÍ¸¦ ¶Õ°í ³ª¿À´Â Çö»ó 
		//¿øÀÎ : ÀÚµ¿È®Àå ±â´ÉÀÌ Á¤Áö µÉ °æ¿ì iframe¿¡ ½ºÅ©·ÑÀÌ »ý±âÁö ¾Ê°í, Ã¢À» ¶Õ°í ³ª¿È
		//ÇØ°á : Ç×»ó ÀÚµ¿È®Àå ±â´ÉÀÌ ÄÑÁ®ÀÖµµ·Ï º¯°æ. ÀÚµ¿ È®Àå ±â´É °ü·ÃÇÑ ÀÌº¥Æ® ÄÚµåµµ ¸ð¹ÙÀÏ »çÆÄ¸®¿¡¼­ ¿¹¿Ü Ã³¸®
		if(jindo.$Agent().navigator().msafari){
			jindo.$Element(this.oResizeGrip).first().text('ÀÔ·ÂÃ¢ ³ôÀÌ ÀÚµ¿ Á¶Á¤ ¹Ù');
			this.oResizeGrip.disabled = true;
			return;
		}
		
		this.$FnMouseDown = jindo.$Fn(this._mousedown, this);
		this.$FnMouseMove = jindo.$Fn(this._mousemove, this);
		this.$FnMouseUp = jindo.$Fn(this._mouseup, this);
		this.$FnMouseOver = jindo.$Fn(this._mouseover, this);
		this.$FnMouseOut = jindo.$Fn(this._mouseout, this);

		this.$FnMouseDown.attach(this.oResizeGrip, "mousedown");
		this.$FnMouseOver.attach(this.oResizeGrip, "mouseover");
		this.$FnMouseOut.attach(this.oResizeGrip, "mouseout");
		
		this.oApp.exec("REGISTER_HOTKEY", ["shift+esc", "FOCUS_RESIZER"]);
		
		this.oApp.exec("ADD_APP_PROPERTY", ["checkResizeGripPosition", jindo.$Fn(this.checkResizeGripPosition, this).bind()]);	// [SMARTEDITORSUS-677]
		
		if(!!this.welNoticeLayer && !Number(jindo.$Cookie().get(this.sCookieNotice))){
			this.welNoticeLayer.delegate("click", "BUTTON.bt_clse", jindo.$Fn(this._closeNotice, this).bind());
			this.welNoticeLayer.show();
		}
		
		if(!!this.oApp.getEditingAreaHeight){
			this.nEditingAreaMinHeight = this.oApp.getEditingAreaHeight();	// [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ªÀÇ ÃÖ¼Ò ³ôÀÌ¸¦ °¡Á®¿Í Gap Ã³¸® ½Ã »ç¿ë
		}
		
		this.showVerticalResizer();
		
		if(this.isUseVerticalResizer() === false && this.oApp.isUseModeChanger() === false){
			this.elModeToolbar.style.display = "none";
		}
	},
	
	// [SMARTEDITORSUS-906][SMARTEDITORSUS-1433] Resizbar »ç¿ë ¿©ºÎ Ã³¸® (true:»ç¿ëÇÔ/ false:»ç¿ëÇÏÁö ¾ÊÀ½)
	showVerticalResizer : function(){
		if(this.isUseVerticalResizer()){
			this.oResizeGrip.style.display = 'block';
		}else{
			this.oResizeGrip.style.display = 'none';
		}
	},
	
	isUseVerticalResizer : function(){
		return (typeof(this.htConversionMode) === 'undefined' || typeof(this.htConversionMode.bUseVerticalResizer) === 'undefined' || this.htConversionMode.bUseVerticalResizer === true) ? true : false;
	},
	
	/**
	 * [SMARTEDITORSUS-677] [¿¡µðÅÍ ÀÚµ¿È®Àå ONÀÎ °æ¿ì]
	 * ÀÔ·ÂÃ¢ Å©±â Á¶Àý ¹ÙÀÇ À§Ä¡¸¦ È®ÀÎÇÏ¿© ºê¶ó¿ìÀú ÇÏ´Ü¿¡ À§Ä¡ÇÑ °æ¿ì ÀÚµ¿È®ÀåÀ» ¸ØÃã
	 */	
	checkResizeGripPosition : function(bExpand){
		var oDocument = jindo.$Document();
		var nGap = (jindo.$Element(this.oResizeGrip).offset().top - oDocument.scrollPosition().top + 25) - oDocument.clientSize().height;
		
		if(nGap <= 0){
			return;
		}

		if(bExpand){
			if(this.nEditingAreaMinHeight > this.oApp.getEditingAreaHeight() - nGap){	// [SMARTEDITORSUS-822] ¼öÁ¤ ¸ðµåÀÎ °æ¿ì¿¡ ´ëºñ
				nGap = (-1) * (this.nEditingAreaMinHeight - this.oApp.getEditingAreaHeight());
			}
	
			// Gap ¸¸Å­ ÆíÁý¿µ¿ª »çÀÌÁî¸¦ Á¶ÀýÇÏ¿©
			// »çÁø Ã·ºÎ³ª ºÙ¿©³Ö±â µîÀÇ »çÀÌÁî°¡ Å« ³»¿ë Ãß°¡°¡ ÀÖ¾úÀ» ¶§ ÀÔ·ÂÃ¢ Å©±â Á¶Àý ¹Ù°¡ ¼û°ÜÁöÁö ¾Êµµ·Ï ÇÔ
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED");
			this.oApp.exec("RESIZE_EDITING_AREA_BY", [0, (-1) * nGap]);
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED");
		}
		
		this.oApp.exec("STOP_AUTORESIZE_EDITING_AREA");
	},	
	
	$ON_FOCUS_RESIZER : function(){
		this.oApp.exec("IE_HIDE_CURSOR");
		this.oResizeGrip.focus();
	},
	
	_assignHTMLElements : function(elAppContainer, htConversionMode){
		//@ec[
		this.oResizeGrip = jindo.$$.getSingle("BUTTON.husky_seditor_editingArea_verticalResizer", elAppContainer);
		this.elModeToolbar = jindo.$$.getSingle("DIV.se2_conversion_mode", elAppContainer);
		//@ec]
		
		this.welNoticeLayer = jindo.$Element(jindo.$$.getSingle("DIV.husky_seditor_resize_notice", elAppContainer));
		this.welConversionMode = jindo.$Element(this.oResizeGrip.parentNode);
	},
	
	_mouseover : function(oEvent){
		oEvent.stopBubble();
		this.welConversionMode.addClass("controller_on");
	},

	_mouseout : function(oEvent){
		oEvent.stopBubble();
		this.welConversionMode.removeClass("controller_on");
	},
	
	_mousedown : function(oEvent){
		this.iStartHeight = oEvent.pos().clientY;
		this.iStartHeightOffset = oEvent.pos().layerY;

		this.$FnMouseMove.attach(document, "mousemove");
		this.$FnMouseUp.attach(document, "mouseup");

		this.iStartHeight = oEvent.pos().clientY;
		
		this.oApp.exec("HIDE_ACTIVE_LAYER");
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER");

		this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", [this.$FnMouseDown, this.$FnMouseMove, this.$FnMouseUp]);
	},

	_mousemove : function(oEvent){
		var iHeightChange = oEvent.pos().clientY - this.iStartHeight;

		this.oApp.exec("RESIZE_EDITING_AREA_BY", [0, iHeightChange]);
	},

	_mouseup : function(oEvent){
		this.$FnMouseMove.detach(document, "mousemove");
		this.$FnMouseUp.detach(document, "mouseup");

		this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", [this.$FnMouseDown, this.$FnMouseMove, this.$FnMouseUp]);
	},
	
	_closeNotice : function(){
		this.welNoticeLayer.hide();
		jindo.$Cookie().set(this.sCookieNotice, 1, 365*10);
	}
});
//}
//{
/**
  * @fileOverview This file contains Husky plugin that takes care of the operations directly related to editing the HTML source code using Textarea element
 * @name hp_SE_EditingArea_HTMLSrc.js
 * @required SE_EditingAreaManager
 */
nhn.husky.SE_EditingArea_HTMLSrc = jindo.$Class({
	name : "SE_EditingArea_HTMLSrc",
	sMode : "HTMLSrc",
	bAutoResize : false,	// [SMARTEDITORSUS-677] ÇØ´ç ÆíÁý¸ðµåÀÇ ÀÚµ¿È®Àå ±â´É On/Off ¿©ºÎ
	nMinHeight : null,		// [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ªÀÇ ÃÖ¼Ò ³ôÀÌ
	
	$init : function(sTextArea) { 
		this.elEditingArea = jindo.$(sTextArea);
	},

	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator();
		this.oApp.exec("REGISTER_EDITING_AREA", [this]);
	},
	
	$ON_MSG_APP_READY : function() {
		if(!!this.oApp.getEditingAreaHeight){
			this.nMinHeight = this.oApp.getEditingAreaHeight();	// [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ªÀÇ ÃÖ¼Ò ³ôÀÌ¸¦ °¡Á®¿Í ÀÚµ¿ È®Àå Ã³¸®¸¦ ÇÒ ¶§ »ç¿ë
		}
	},

	$ON_CHANGE_EDITING_MODE : function(sMode) {
		if (sMode == this.sMode) {				
			this.elEditingArea.style.display = "block";
		} else {
			this.elEditingArea.style.display = "none";
		}
	},
	
	$AFTER_CHANGE_EDITING_MODE : function(sMode, bNoFocus) {
		if (sMode == this.sMode && !bNoFocus) { 
			var o = new TextRange(this.elEditingArea);
			o.setSelection(0, 0);
			
			//[SMARTEDITORSUS-1017] [iOS5´ëÀÀ] ¸ðµå ÀüÈ¯ ½Ã textarea¿¡ Æ÷Ä¿½º°¡ ÀÖ¾îµµ ±ÛÀÚ°¡ ÀÔ·ÂÀÌ ¾ÈµÇ´Â Çö»ó
			//¿øÀÎ : WYSIWYG¸ðµå°¡ ¾Æ´Ò ¶§¿¡µµ iframeÀÇ contentWindow¿¡ focus°¡ °¡¸é¼­ focus±â´ÉÀÌ ÀÛµ¿ÇÏÁö ¾ÊÀ½
			//ÇØ°á : WYSIWYG¸ðµå ÀÏ¶§¸¸ ½ÇÇà µÇµµ·Ï Á¶°Ç½Ä Ãß°¡ ¹× ±âÁ¸¿¡ blurÃ³¸® ÄÚµå »èÁ¦
			//¸ð¹ÙÀÏ textarea¿¡¼­´Â Á÷Á¢ Å¬¸¯À»ÇØ¾ß¸¸ Å°º¸µå°¡ ¸ÔÈ÷±â ¶§¹®¿¡ ¿ì¼±Àº Ä¿¼­°¡ ¾Èº¸ÀÌ°Ô ÇØ¼­ »ç¿ëÀÚ°¡ Á÷Á¢ Å¬¸¯À» À¯µµ.
			// if(!!this.oNavigator.msafari){
				// this.elEditingArea.blur();
			// }
		}
	},
	
	/**
	 * [SMARTEDITORSUS-677] HTML ÆíÁý ¿µ¿ª ÀÚµ¿ È®Àå Ã³¸® ½ÃÀÛ
	 */ 
	startAutoResize : function(){
		var htOption = {
			nMinHeight : this.nMinHeight,
			wfnCallback : jindo.$Fn(this.oApp.checkResizeGripPosition, this).bind()
		};
		//[SMARTEDITORSUS-941][iOS5´ëÀÀ]¾ÆÀÌÆÐµåÀÇ ÀÚµ¿ È®Àå ±â´ÉÀÌ µ¿ÀÛÇÏÁö ¾ÊÀ» ¶§ ¿¡µðÅÍ Ã¢º¸´Ù ±ä ³»¿ëÀ» ÀÛ¼ºÇÏ¸é ¿¡µðÅÍ¸¦ ¶Õ°í ³ª¿À´Â Çö»ó 
		//¿øÀÎ : ÀÚµ¿È®Àå ±â´ÉÀÌ Á¤Áö µÉ °æ¿ì iframe¿¡ ½ºÅ©·ÑÀÌ »ý±âÁö ¾Ê°í, Ã¢À» ¶Õ°í ³ª¿È
		//ÇØ°á : Ç×»ó ÀÚµ¿È®Àå ±â´ÉÀÌ ÄÑÁ®ÀÖµµ·Ï º¯°æ. ÀÚµ¿ È®Àå ±â´É °ü·ÃÇÑ ÀÌº¥Æ® ÄÚµåµµ ¸ð¹ÙÀÏ »çÆÄ¸®¿¡¼­ ¿¹¿Ü Ã³¸®
		if(this.oNavigator.msafari){
			htOption.wfnCallback = function(){};
		}
				
		this.bAutoResize = true;
		this.AutoResizer = new nhn.husky.AutoResizer(this.elEditingArea, htOption);
		this.AutoResizer.bind();
	},
	
	/**
	 * [SMARTEDITORSUS-677] HTML ÆíÁý ¿µ¿ª ÀÚµ¿ È®Àå Ã³¸® Á¾·á
	 */ 
	stopAutoResize : function(){
		this.AutoResizer.unbind();
	},
	
	getIR : function() { 
		var sIR = this.getRawContents();		
		if (this.oApp.applyConverter) {
			sIR = this.oApp.applyConverter(this.sMode + "_TO_IR", sIR, this.oApp.getWYSIWYGDocument());
		}

		return sIR;
	},

	setIR : function(sIR) {
		if(sIR.toLowerCase() === "<br>" || sIR.toLowerCase() === "<p>&nbsp;</p>" || sIR.toLowerCase() === "<p><br></p>" || sIR.toLowerCase() === "<p></p>"){
			sIR="";
		}
		
		// [SMARTEDITORSUS-1589] ¹®¼­ ¸ðµå°¡ EdgeÀÎ IE11¿¡¼­ WYSIWYG ¸ðµå¿Í HTML ¸ðµå ÀüÈ¯ ½Ã, ¹®¸»¿¡ ¹«ÀÇ¹ÌÇÑ <br> µÎ °³°¡ Ã·°¡µÇ´Â Çö»óÀ¸·Î ÇÊÅÍ¸µ Ãß°¡
		var htBrowser = jindo.$Agent().navigator();
		if(htBrowser.ie && htBrowser.nativeVersion == 11 && document.documentMode == 11){ // Edge ¸ðµåÀÇ documentMode °ªÀº 11
			sIR = sIR.replace(/(<br><br>$)/, "");
		}
		// --[SMARTEDITORSUS-1589]
		
		var sContent = sIR;
		if (this.oApp.applyConverter) {
			sContent = this.oApp.applyConverter("IR_TO_" + this.sMode, sContent, this.oApp.getWYSIWYGDocument());
		}
		
		this.setRawContents(sContent);
	},
	
	setRawContents : function(sContent) {
		if (typeof sContent !== 'undefined') {
			this.elEditingArea.value = sContent;
		}
	},
	
	getRawContents : function() {
		return this.elEditingArea.value;
	},
	
	focus : function() {
		this.elEditingArea.focus();
	}
});

/**
 * Selection for textfield
 * @author hooriza
 */
if (typeof window.TextRange == 'undefined') { window.TextRange = {}; }
TextRange = function(oEl, oDoc) { 
	this._o = oEl;
	this._oDoc = (oDoc || document);
};

TextRange.prototype.getSelection = function() {
	var obj = this._o;
	var ret = [-1, -1];

	if(isNaN(this._o.selectionStart)) {
		obj.focus();

		// textarea support added by nagoon97
		var range = this._oDoc.body.createTextRange();
		var rangeField = null;

		rangeField = this._oDoc.selection.createRange().duplicate();
		range.moveToElementText(obj);
		rangeField.collapse(true);
		range.setEndPoint("EndToEnd", rangeField);
		ret[0] = range.text.length;

		rangeField = this._oDoc.selection.createRange().duplicate();
		range.moveToElementText(obj);
		rangeField.collapse(false);
		range.setEndPoint("EndToEnd", rangeField);
		ret[1] = range.text.length;

		obj.blur();
	} else {
		ret[0] = obj.selectionStart;
		ret[1] = obj.selectionEnd;
	}

	return ret;
};

TextRange.prototype.setSelection = function(start, end) {
	var obj = this._o;
	if (typeof end == 'undefined') {
		end = start;
	}

	if (obj.setSelectionRange) {
		obj.setSelectionRange(start, end);
	} else if (obj.createTextRange) {
		var range = obj.createTextRange();
		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end - start);
		range.select();
		obj.blur();
	}
};

TextRange.prototype.copy = function() {
	var r = this.getSelection();
	return this._o.value.substring(r[0], r[1]);
};

TextRange.prototype.paste = function(sStr) {
	var obj = this._o;
	var sel = this.getSelection();
	var value = obj.value;
	var pre = value.substr(0, sel[0]);
	var post = value.substr(sel[1]);

	value = pre + sStr + post;
	obj.value = value;

	var n = 0;
	if (typeof this._oDoc.body.style.maxHeight == "undefined") {
		var a = pre.match(/\n/gi);
		n = ( a !== null ? a.length : 0 );
	}
	
	this.setSelection(sel[0] + sStr.length - n);
};

TextRange.prototype.cut = function() {
	var r = this.copy();
	this.paste('');
	return r;
};
//}
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations directly related to editing the HTML source code using Textarea element
 * @name hp_SE_EditingArea_TEXT.js
 * @required SE_EditingAreaManager
 */
nhn.husky.SE_EditingArea_TEXT = jindo.$Class({
	name : "SE_EditingArea_TEXT",
	sMode : "TEXT",
	sRxConverter : '@[0-9]+@',
	bAutoResize : false,	// [SMARTEDITORSUS-677] ÇØ´ç ÆíÁý¸ðµåÀÇ ÀÚµ¿È®Àå ±â´É On/Off ¿©ºÎ
	nMinHeight : null,		// [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ªÀÇ ÃÖ¼Ò ³ôÀÌ
	
	$init : function(sTextArea) {
		this.elEditingArea = jindo.$(sTextArea);
	},

	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator();
		this.oApp.exec("REGISTER_EDITING_AREA", [this]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getTextAreaContents", jindo.$Fn(this.getRawContents, this).bind()]);
	},
	
	$ON_MSG_APP_READY : function() {
		if(!!this.oApp.getEditingAreaHeight){
			this.nMinHeight = this.oApp.getEditingAreaHeight();	// [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ªÀÇ ÃÖ¼Ò ³ôÀÌ¸¦ °¡Á®¿Í ÀÚµ¿ È®Àå Ã³¸®¸¦ ÇÒ ¶§ »ç¿ë
		}
	},
	
	$ON_REGISTER_CONVERTERS : function() {
		this.oApp.exec("ADD_CONVERTER", ["IR_TO_TEXT", jindo.$Fn(this.irToText, this).bind()]);
		this.oApp.exec("ADD_CONVERTER", ["TEXT_TO_IR", jindo.$Fn(this.textToIr, this).bind()]);
	},
	
	$ON_CHANGE_EDITING_MODE : function(sMode) {
		if (sMode == this.sMode) {
			this.elEditingArea.style.display = "block";
		} else {
			this.elEditingArea.style.display = "none";
		}
	},
	
	$AFTER_CHANGE_EDITING_MODE : function(sMode, bNoFocus) {
		if (sMode == this.sMode && !bNoFocus) {
			var o = new TextRange(this.elEditingArea);
			o.setSelection(0, 0);
		}
		
		//[SMARTEDITORSUS-1017] [iOS5´ëÀÀ] ¸ðµå ÀüÈ¯ ½Ã textarea¿¡ Æ÷Ä¿½º°¡ ÀÖ¾îµµ ±ÛÀÚ°¡ ÀÔ·ÂÀÌ ¾ÈµÇ´Â Çö»ó
		//¿øÀÎ : WYSIWYG¸ðµå°¡ ¾Æ´Ò ¶§¿¡µµ iframeÀÇ contentWindow¿¡ focus°¡ °¡¸é¼­ focus±â´ÉÀÌ ÀÛµ¿ÇÏÁö ¾ÊÀ½
		//ÇØ°á : WYSIWYG¸ðµå ÀÏ¶§¸¸ ½ÇÇà µÇµµ·Ï Á¶°Ç½Ä Ãß°¡ ¹× ±âÁ¸¿¡ blurÃ³¸® ÄÚµå »èÁ¦
		//¸ð¹ÙÀÏ textarea¿¡¼­´Â Á÷Á¢ Å¬¸¯À»ÇØ¾ß¸¸ Å°º¸µå°¡ ¸ÔÈ÷±â ¶§¹®¿¡ ¿ì¼±Àº Ä¿¼­°¡ ¾Èº¸ÀÌ°Ô ÇØ¼­ »ç¿ëÀÚ°¡ Á÷Á¢ Å¬¸¯À» À¯µµ.
		// if(!!this.oNavigator.msafari){
			// this.elEditingArea.blur();
		// }
	},
	
	irToText : function(sHtml) {
		var sContent = sHtml, nIdx = 0;		
		var aTemp = sContent.match(new RegExp(this.sRxConverter)); // applyConverter¿¡¼­ Ãß°¡ÇÑ sTmpStr¸¦ Àá½Ã Á¦°ÅÇØÁØ´Ù.
		if (aTemp !== null) {
			sContent = sContent.replace(new RegExp(this.sRxConverter), "");
		}
		
		//0.¾Èº¸ÀÌ´Â °ªµé¿¡ ´ëÇÑ Á¤¸®. (¿¡µðÅÍ ¸ðµå¿¡ view¿Í text¸ðµåÀÇ view¸¦ µ¿ÀÏÇÏ°Ô ÇØÁÖ±â À§ÇØ¼­)		
		sContent = sContent.replace(/\r/g, '');// MS¿¢¼¿ Å×ÀÌºí¿¡¼­ trº°·Î ºÐ¸®ÇØÁÖ´Â ¿ªÇÒÀÌ\rÀÌ±â ¶§¹®¿¡  text¸ðµå·Î º¯°æ½Ã¿¡ °¡µ¶¼ºÀ» À§ÇØ \r Á¦°ÅÇÏ´Â °ÍÀº ÀÓ½Ã º¸·ù. - 11.01.28 by cielo 
		sContent = sContent.replace(/[\n|\t]/g, ''); // °³Çà¹®ÀÚ, ¾Èº¸ÀÌ´Â °ø¹é Á¦°Å
		sContent = sContent.replace(/[\v|\f]/g, ''); // °³Çà¹®ÀÚ, ¾Èº¸ÀÌ´Â °ø¹é Á¦°Å
		//1. ¸ÕÀú, ºó ¶óÀÎ Ã³¸® .
		sContent = sContent.replace(/<p><br><\/p>/gi, '\n');
		sContent = sContent.replace(/<P>&nbsp;<\/P>/gi, '\n');
		
		//2. ºó ¶óÀÎ ÀÌ¿Ü¿¡ linebreak Ã³¸®.
		sContent = sContent.replace(/<br(\s)*\/?>/gi, '\n'); // br ÅÂ±×¸¦ °³Çà¹®ÀÚ·Î
		sContent = sContent.replace(/<br(\s[^\/]*)?>/gi, '\n'); // br ÅÂ±×¸¦ °³Çà¹®ÀÚ·Î
		sContent = sContent.replace(/<\/p(\s[^\/]*)?>/gi, '\n'); // p ÅÂ±×¸¦ °³Çà¹®ÀÚ·Î
		
		sContent = sContent.replace(/<\/li(\s[^\/]*)?>/gi, '\n'); // li ÅÂ±×¸¦ °³Çà¹®ÀÚ·Î [SMARTEDITORSUS-107]°³Çà Ãß°¡
		sContent = sContent.replace(/<\/tr(\s[^\/]*)?>/gi, '\n'); // tr ÅÂ±×¸¦ °³Çà¹®ÀÚ·Î [SMARTEDITORSUS-107]°³Çà Ãß°¡
	
		// ¸¶Áö¸· \nÀº ·ÎÁ÷»ó ºÒÇÊ¿äÇÑ linebreak¸¦ Á¦°øÇÏ¹Ç·Î Á¦°ÅÇØÁØ´Ù.
		nIdx = sContent.lastIndexOf('\n');
		if (nIdx > -1 && sContent.substring(nIdx) == '\n') {
			sContent = sContent.substring(0, nIdx);
		}
		
		sContent = jindo.$S(sContent).stripTags().toString();
		sContent = this.unhtmlSpecialChars(sContent);
		if (aTemp !== null) { // Á¦°ÅÇß´øsTmpStr¸¦ Ãß°¡ÇØÁØ´Ù.
			sContent = aTemp[0] + sContent;
		}
		
		return sContent;
	},
	
	textToIr : function(sHtml) {
		if (!sHtml) {
			return;
		}

		var sContent = sHtml, aTemp = null;
		
		// applyConverter¿¡¼­ Ãß°¡ÇÑ sTmpStr¸¦ Àá½Ã Á¦°ÅÇØÁØ´Ù. sTmpStrµµ ÇÏ³ªÀÇ stringÀ¸·Î ÀÎ½ÄÇÏ´Â °æ¿ì°¡ ÀÖ±â ¶§¹®.
		aTemp = sContent.match(new RegExp(this.sRxConverter));
		if (aTemp !== null) {
			sContent = sContent.replace(aTemp[0], "");
		}
				
		sContent = this.htmlSpecialChars(sContent);
		sContent = this._addLineBreaker(sContent);

		if (aTemp !== null) {
			sContent = aTemp[0] + sContent;
		}
		
		return sContent;
	},
	
	_addLineBreaker : function(sContent){
		if(this.oApp.sLineBreaker === "BR"){
			return sContent.replace(/\r?\n/g, "<BR>");
		}
		
		var oContent = new StringBuffer(),
			aContent = sContent.split('\n'), // \nÀ» ±âÁØÀ¸·Î ºí·°À» ³ª´«´Ù.
			aContentLng = aContent.length, 
			sTemp = "";
		
		for (var i = 0; i < aContentLng; i++) {
			sTemp = jindo.$S(aContent[i]).trim().$value();
			if (i === aContentLng -1 && sTemp === "") {
				break;
			}
			
			if (sTemp !== null && sTemp !== "") {
				oContent.append('<P>');
				oContent.append(aContent[i]);
				oContent.append('</P>');
			} else {
				if (!jindo.$Agent().navigator().ie) {
					oContent.append('<P><BR></P>');
				} else {
					oContent.append('<P>&nbsp;<\/P>');
				}
			}
		}
		
		return oContent.toString();
	},

	/**
	 * [SMARTEDITORSUS-677] HTML ÆíÁý ¿µ¿ª ÀÚµ¿ È®Àå Ã³¸® ½ÃÀÛ
	 */ 
	startAutoResize : function(){
		var htOption = {
			nMinHeight : this.nMinHeight,
			wfnCallback : jindo.$Fn(this.oApp.checkResizeGripPosition, this).bind()
		};
		
		//[SMARTEDITORSUS-941][iOS5´ëÀÀ]¾ÆÀÌÆÐµåÀÇ ÀÚµ¿ È®Àå ±â´ÉÀÌ µ¿ÀÛÇÏÁö ¾ÊÀ» ¶§ ¿¡µðÅÍ Ã¢º¸´Ù ±ä ³»¿ëÀ» ÀÛ¼ºÇÏ¸é ¿¡µðÅÍ¸¦ ¶Õ°í ³ª¿À´Â Çö»ó 
		//¿øÀÎ : ÀÚµ¿È®Àå ±â´ÉÀÌ Á¤Áö µÉ °æ¿ì iframe¿¡ ½ºÅ©·ÑÀÌ »ý±âÁö ¾Ê°í, Ã¢À» ¶Õ°í ³ª¿È
		//ÇØ°á : Ç×»ó ÀÚµ¿È®Àå ±â´ÉÀÌ ÄÑÁ®ÀÖµµ·Ï º¯°æ. ÀÚµ¿ È®Àå ±â´É °ü·ÃÇÑ ÀÌº¥Æ® ÄÚµåµµ ¸ð¹ÙÀÏ »çÆÄ¸®¿¡¼­ ¿¹¿Ü Ã³¸®
		if(this.oNavigator.msafari){
			htOption.wfnCallback = function(){};
		}
		
		this.bAutoResize = true;
		this.AutoResizer = new nhn.husky.AutoResizer(this.elEditingArea, htOption);
		this.AutoResizer.bind();
	},
	
	/**
	 * [SMARTEDITORSUS-677] HTML ÆíÁý ¿µ¿ª ÀÚµ¿ È®Àå Ã³¸® Á¾·á
	 */ 
	stopAutoResize : function(){
		this.AutoResizer.unbind();
	},
	
	getIR : function() {
		var sIR = this.getRawContents();
		if (this.oApp.applyConverter) {
			sIR = this.oApp.applyConverter(this.sMode + "_TO_IR", sIR, this.oApp.getWYSIWYGDocument());
		}		
		return sIR;
	},

	setIR : function(sIR) {
		var sContent = sIR;
		if (this.oApp.applyConverter) {
			sContent = this.oApp.applyConverter("IR_TO_" + this.sMode, sContent, this.oApp.getWYSIWYGDocument());
		}
		
		this.setRawContents(sContent);
	},
	
	setRawContents : function(sContent) {
		if (typeof sContent !== 'undefined') {
			this.elEditingArea.value = sContent;
		}
	},
	
	getRawContents : function() {
		return this.elEditingArea.value;
	},

	focus : function() {
		this.elEditingArea.focus();
	},

	/**
	 * HTML ÅÂ±×¿¡ ÇØ´çÇÏ´Â ±ÛÀÚ°¡ ¸ÔÈ÷Áö ¾Êµµ·Ï ¹Ù²ãÁÖ±â
	 *
	 * µ¿ÀÛ) & ¸¦ &amp; ·Î, < ¸¦ &lt; ·Î, > ¸¦ &gt; ·Î ¹Ù²ãÁØ´Ù
	 *
	 * @param {String} sText
	 * @return {String}
	 */
	htmlSpecialChars : function(sText) {
		return sText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
	},

	/**
	 * htmlSpecialChars ÀÇ ¹Ý´ë ±â´ÉÀÇ ÇÔ¼ö
	 *
	 * µ¿ÀÛ) &amp, &lt, &gt, &nbsp ¸¦ °¢°¢ &, <, >, ºóÄ­À¸·Î ¹Ù²ãÁØ´Ù
	 *
	 * @param {String} sText
	 * @return {String}
	 */
	unhtmlSpecialChars : function(sText) {
		return sText.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
	}
});
/*[
 * REFRESH_WYSIWYG
 *
 * (FFÀü¿ë) WYSIWYG ¸ðµå¸¦ ºñÈ°¼ºÈ­ ÈÄ ´Ù½Ã È°¼ºÈ­ ½ÃÅ²´Ù. FF¿¡¼­ WYSIWYG ¸ðµå°¡ ÀÏºÎ ºñÈ°¼ºÈ­ µÇ´Â ¹®Á¦¿ë
 * ÁÖÀÇ] REFRESH_WYSIWYGÈÄ¿¡´Â º»¹®ÀÇ selectionÀÌ ±úÁ®¼­ Ä¿¼­ Á¦ÀÏ ¾ÕÀ¸·Î °¡´Â Çö»óÀÌ ÀÖÀ½. (stringbookmark·Î Ã³¸®ÇØ¾ßÇÔ.)
 *  
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * ENABLE_WYSIWYG
 *
 * ºñÈ°¼ºÈ­µÈ WYSIWYG ÆíÁý ¿µ¿ªÀ» È°¼ºÈ­ ½ÃÅ²´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * DISABLE_WYSIWYG
 *
 * WYSIWYG ÆíÁý ¿µ¿ªÀ» ºñÈ°¼ºÈ­ ½ÃÅ²´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * PASTE_HTML
 *
 * HTMLÀ» ÆíÁý ¿µ¿ª¿¡ »ðÀÔÇÑ´Ù.
 *
 * sHTML string »ðÀÔÇÒ HTML
 * oPSelection object ºÙ¿© ³Ö±â ÇÒ ¿µ¿ª, »ý·«½Ã ÇöÀç Ä¿¼­ À§Ä¡
 *
---------------------------------------------------------------------------]*/
/*[
 * RESTORE_IE_SELECTION
 *
 * (IEÀü¿ë) ¿¡µðÅÍ¿¡¼­ Æ÷Ä¿½º°¡ ³ª°¡´Â ½ÃÁ¡¿¡ ±â¾ïÇØµÐ Æ÷Ä¿½º¸¦ º¹±¸ÇÑ´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc WYSIWYG ¸ðµå¸¦ Á¦°øÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.SE_EditingArea_WYSIWYG = jindo.$Class({
	name : "SE_EditingArea_WYSIWYG",
	status : nhn.husky.PLUGIN_STATUS.NOT_READY,

	sMode : "WYSIWYG",
	iframe : null,
	doc : null,
	
	bStopCheckingBodyHeight : false, 
	bAutoResize : false,	// [SMARTEDITORSUS-677] ÇØ´ç ÆíÁý¸ðµåÀÇ ÀÚµ¿È®Àå ±â´É On/Off ¿©ºÎ
	
	nBodyMinHeight : 0,
	nScrollbarWidth : 0,
	
	iLastUndoRecorded : 0,
//	iMinUndoInterval : 50,
	
	_nIFrameReadyCount : 50,
	
	bWYSIWYGEnabled : false,
	
	$init : function(iframe){
		this.iframe = jindo.$(iframe);		
		var oAgent = jindo.$Agent().navigator();		
		// IE¿¡¼­ ¿¡µðÅÍ ÃÊ±âÈ­ ½Ã¿¡ ÀÓÀÇÀûÀ¸·Î iframe¿¡ Æ÷Ä¿½º¸¦ ¹ÝÂë(IME ÀÔ·Â ¾ÈµÇ°í Ä¿¼­¸¸ ±ô¹ÚÀÌ´Â »óÅÂ) ÁÖ´Â Çö»óÀ» ¸·±â À§ÇØ¼­ ÀÏ´Ü iframeÀ» ¼û°Ü µ×´Ù°¡ CHANGE_EDITING_MODE¿¡¼­ À§ÁöÀ¨ ÀüÈ¯ ½Ã º¸¿©ÁØ´Ù.
		// ÀÌ·± Çö»óÀÌ ´Ù¾çÇÑ ¿ä¼Ò¿¡ ÀÇÇØ¼­ ¹ß»ýÇÏ¸ç ¹ß°ßµÈ ¸î°¡Áö °æ¿ì´Â,
		// - framesetÀ¸·Î ÆäÀÌÁö¸¦ ±¸¼ºÇÑ ÈÄ¿¡ ÇÑ°³ÀÇ frame¾È¿¡ ¹öÆ°À» µÎ¾î ¿¡µðÅÍ·Î ¸µÅ© ÇÒ °æ¿ì
		// - iframe°ú µ¿ÀÏ ÆäÀÌÁö¿¡ Á¸ÀçÇÏ´Â text field¿¡ °ªÀ» ÇÒ´ç ÇÒ °æ¿ì
		if(oAgent.ie){
			this.iframe.style.display = "none";
		}
	
		// IE8 : Ã£±â/¹Ù²Ù±â¿¡¼­ ±ÛÀÚ ÀÏºÎ¿¡ ½ºÅ¸ÀÏÀÌ Àû¿ëµÈ °æ¿ì Ã£±â°¡ ¾ÈµÇ´Â ºê¶ó¿ìÀú ¹ö±×·Î ÀÎÇØ EmulateIE7 ÆÄÀÏÀ» »ç¿ë
		// <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
		this.sBlankPageURL = "smart_editor2_inputarea.html";
		this.sBlankPageURL_EmulateIE7 = "smart_editor2_inputarea_ie8.html";
		this.aAddtionalEmulateIE7 = [];

		this.htOptions = nhn.husky.SE2M_Configuration.SE_EditingAreaManager;	
		if (this.htOptions) {
			this.sBlankPageURL = this.htOptions.sBlankPageURL || this.sBlankPageURL;
			this.sBlankPageURL_EmulateIE7 = this.htOptions.sBlankPageURL_EmulateIE7 || this.sBlankPageURL_EmulateIE7;
			this.aAddtionalEmulateIE7 = this.htOptions.aAddtionalEmulateIE7 || this.aAddtionalEmulateIE7;
		}
		
		this.aAddtionalEmulateIE7.push(8); // IE8Àº Default »ç¿ë

		this.sIFrameSrc = this.sBlankPageURL;
		if(oAgent.ie && jindo.$A(this.aAddtionalEmulateIE7).has(oAgent.nativeVersion)) {
			this.sIFrameSrc = this.sBlankPageURL_EmulateIE7;
		}
		
		var sIFrameSrc = this.sIFrameSrc,
			iframe = this.iframe,
			fHandlerSuccess = jindo.$Fn(this.initIframe, this).bind(),
			fHandlerFail =jindo.$Fn(function(){this.iframe.src = sIFrameSrc;}, this).bind();
			
		if(!oAgent.ie || (oAgent.version >=9 && !!document.addEventListener)){
			iframe.addEventListener("load", fHandlerSuccess, false);
			iframe.addEventListener("error", fHandlerFail, false);
		}else{
			iframe.attachEvent("onload", fHandlerSuccess);
			iframe.attachEvent("onerror", fHandlerFail);
		}
		iframe.src = sIFrameSrc; 	
		this.elEditingArea = iframe;
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oEditingArea = this.iframe.contentWindow.document;
		this.oApp.exec("REGISTER_EDITING_AREA", [this]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getWYSIWYGWindow", jindo.$Fn(this.getWindow, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getWYSIWYGDocument", jindo.$Fn(this.getDocument, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["isWYSIWYGEnabled", jindo.$Fn(this.isWYSIWYGEnabled, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getRawHTMLContents", jindo.$Fn(this.getRawHTMLContents, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["setRawHTMLContents", jindo.$Fn(this.setRawHTMLContents, this).bind()]);
		
		if (!!this.isWYSIWYGEnabled()) {
			this.oApp.exec('ENABLE_WYSIWYG_RULER', []);
		}
		
		this.oApp.registerBrowserEvent(this.getDocument().body, 'paste', 'EVENT_EDITING_AREA_PASTE');
	},

	$ON_MSG_APP_READY : function(){
		if(!this.oApp.hasOwnProperty("saveSnapShot")){
			this.$ON_EVENT_EDITING_AREA_MOUSEUP = function(){};
			this._recordUndo = function(){};
		}
				
		// uncomment this line if you wish to use the IE-style cursor in FF
		// this.getDocument().body.style.cursor = "text";

		// Do not update this._oIERange until the document is actually clicked (focus was given by mousedown->mouseup)
		// Without this, iframe cannot be re-selected(by RESTORE_IE_SELECTION) if the document hasn't been clicked
		// mousedown on iframe -> focus goes into the iframe doc -> beforedeactivate is fired -> empty selection is saved by the plugin -> empty selection is recovered in RESTORE_IE_SELECTION
		this._bIERangeReset = true;

		if(this.oApp.oNavigator.ie){
			jindo.$Fn(
				function(weEvent){
					var oSelection = this.iframe.contentWindow.document.selection;
					if(oSelection && oSelection.type.toLowerCase() === 'control' && weEvent.key().keyCode === 8){
						this.oApp.exec("EXECCOMMAND", ['delete', false, false]);
						weEvent.stop();
					}
					
					this._bIERangeReset = false;
				}, this
			).attach(this.iframe.contentWindow.document, "keydown");
			jindo.$Fn(
				function(weEvent){
					this._oIERange = null;
					this._bIERangeReset = true;
				}, this
			).attach(this.iframe.contentWindow.document.body, "mousedown");

			jindo.$Fn(this._onIEBeforeDeactivate, this).attach(this.iframe.contentWindow.document.body, "beforedeactivate");
			
			jindo.$Fn(
				function(weEvent){
					this._bIERangeReset = false;
				}, this
			).attach(this.iframe.contentWindow.document.body, "mouseup");
		}else{
			//this.getDocument().execCommand('useCSS', false, false);
			//this.getDocument().execCommand('styleWithCSS', false, false);
			//this.document.execCommand("insertBrOnReturn", false, false);
		}
		
		// DTD°¡ quirks°¡ ¾Æ´Ò °æ¿ì body ³ôÀÌ 100%°¡ Á¦´ë·Î µ¿ÀÛÇÏÁö ¾Ê¾Æ¼­ Å¸ÀÓ¾Æ¿ôÀ» µ¹¸ç ³ôÀÌ¸¦ ¼öµ¿À¸·Î °è¼Ó ÇÒ´ç ÇØ ÁÜ 
		// body ³ôÀÌ°¡ Á¦´ë·Î ¼³Á¤ µÇÁö ¾ÊÀ» °æ¿ì, º¸±â¿¡´Â ÀÌ»ó¾ø¾î º¸ÀÌ³ª ¸¶¿ì½º·Î ÅØ½ºÆ® ¼±ÅÃÀÌ Àß ¾ÈµÈ´ÙµçÁö ÇÏ´Â ÀÌ½´°¡ ÀÖÀ½
		this.fnSetBodyHeight = jindo.$Fn(this._setBodyHeight, this).bind();
		this.fnCheckBodyChange = jindo.$Fn(this._checkBodyChange, this).bind();

		this.fnSetBodyHeight();
		
		this._setScrollbarWidth();
	},
	
	/**
	 * ½ºÅ©·Ñ¹ÙÀÇ »çÀÌÁî ÃøÁ¤ÇÏ¿© ¼³Á¤
	 */
	_setScrollbarWidth : function(){
		var oDocument = this.getDocument(),
			elScrollDiv = oDocument.createElement("div");
		
		elScrollDiv.style.width = "100px";
		elScrollDiv.style.height = "100px";
		elScrollDiv.style.overflow = "scroll";
		elScrollDiv.style.position = "absolute";
		elScrollDiv.style.top = "-9999px";
				
		oDocument.body.appendChild(elScrollDiv);

		this.nScrollbarWidth = elScrollDiv.offsetWidth - elScrollDiv.clientWidth;
		
		oDocument.body.removeChild(elScrollDiv);
	},
	
	/**
	 * [SMARTEDITORSUS-677] ºÙ¿©³Ö±â³ª ³»¿ë ÀÔ·Â¿¡ ´ëÇÑ ÆíÁý¿µ¿ª ÀÚµ¿ È®Àå Ã³¸®
	 */ 
	$AFTER_EVENT_EDITING_AREA_KEYUP : function(oEvent){		
		if(!this.bAutoResize){
			return;
		}
		
		var oKeyInfo = oEvent.key();

		if((oKeyInfo.keyCode >= 33 && oKeyInfo.keyCode <= 40) || oKeyInfo.alt || oKeyInfo.ctrl || oKeyInfo.keyCode === 16){
			return;
		}
		
		this._setAutoResize();
	},
	
	/**
	 * [SMARTEDITORSUS-677] ºÙ¿©³Ö±â³ª ³»¿ë ÀÔ·Â¿¡ ´ëÇÑ ÆíÁý¿µ¿ª ÀÚµ¿ È®Àå Ã³¸®
	 */
	$AFTER_PASTE_HTML : function(){
		if(!this.bAutoResize){
			return;
		}
		
		this._setAutoResize();
	},

	/**
	 * [SMARTEDITORSUS-677] WYSIWYG ÆíÁý ¿µ¿ª ÀÚµ¿ È®Àå Ã³¸® ½ÃÀÛ
	 */ 
	startAutoResize : function(){
		this.oApp.exec("STOP_CHECKING_BODY_HEIGHT");
		this.bAutoResize = true;
		
		var oBrowser = this.oApp.oNavigator;

		// [SMARTEDITORSUS-887] [ºí·Î±× 1´Ü] ÀÚµ¿È®Àå ¸ðµå¿¡¼­ ¿¡µðÅÍ °¡·Î»çÀÌÁîº¸´Ù Å« »çÁøÀ» Ãß°¡ÇßÀ» ¶§ °¡·Î½ºÅ©·ÑÀÌ ¾È»ý±â´Â ¹®Á¦
		if(oBrowser.ie && oBrowser.version < 9){
			jindo.$Element(this.getDocument().body).css({ "overflow" : "visible" });

			// { "overflowX" : "visible", "overflowY" : "hidden" } À¸·Î ¼³Á¤ÇÏ¸é ¼¼·Î ½ºÅ©·Ñ »Ó ¾Æ´Ï¶ó °¡·Î ½ºÅ©·Ñµµ º¸ÀÌÁö ¾Ê´Â ¹®Á¦°¡ ÀÖ¾î
			// { "overflow" : "visible" } ·Î Ã³¸®ÇÏ°í ¿¡µðÅÍÀÇ container »çÀÌÁî¸¦ ´Ã·Á ¼¼·Î ½ºÅ©·ÑÀÌ º¸ÀÌÁö ¾Êµµ·Ï Ã³¸®ÇØ¾ß ÇÔ
			// [ÇÑ°è] ÀÚµ¿ È®Àå ¸ðµå¿¡¼­ ³»¿ëÀÌ ´Ã¾î³¯ ¶§ ¼¼·Î ½ºÅ©·ÑÀÌ º¸¿´´Ù°¡ ¾ø¾îÁö´Â ¹®Á¦
		}else{
			jindo.$Element(this.getDocument().body).css({ "overflowX" : "visible", "overflowY" : "hidden" });
		}
				
		this._setAutoResize();
		this.nCheckBodyInterval = setInterval(this.fnCheckBodyChange, 500);
		
		this.oApp.exec("START_FLOAT_TOOLBAR");	// set scroll event
	},
	
	/**
	 * [SMARTEDITORSUS-677] WYSIWYG ÆíÁý ¿µ¿ª ÀÚµ¿ È®Àå Ã³¸® Á¾·á
	 */ 
	stopAutoResize : function(){
		this.bAutoResize = false;
		clearInterval(this.nCheckBodyInterval);

		this.oApp.exec("STOP_FLOAT_TOOLBAR");	// remove scroll event
		
		jindo.$Element(this.getDocument().body).css({ "overflow" : "visible", "overflowY" : "visible" });
		
		this.oApp.exec("START_CHECKING_BODY_HEIGHT");
	},
	
	/**
	 * [SMARTEDITORSUS-677] ÆíÁý ¿µ¿ª Body°¡ º¯°æµÇ¾ú´ÂÁö ÁÖ±âÀûÀ¸·Î È®ÀÎ
	 */ 
	_checkBodyChange : function(){
		if(!this.bAutoResize){
			return;
		}
		
		var nBodyLength = this.getDocument().body.innerHTML.length;
		
		if(nBodyLength !== this.nBodyLength){
			this.nBodyLength = nBodyLength;
			
			this._setAutoResize();
		}
	},
	
	/**
	 * [SMARTEDITORSUS-677] ÀÚµ¿ È®Àå Ã³¸®¿¡¼­ Àû¿ëÇÒ Resize Body Height¸¦ ±¸ÇÔ
	 */ 
	_getResizeHeight : function(){
		var elBody = this.getDocument().body,
			welBody,
			nBodyHeight,
			aCopyStyle = ['width', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'wordSpacing'],
			oCss, i;

		if(!this.oApp.oNavigator.firefox && !this.oApp.oNavigator.safari){
			if(this.oApp.oNavigator.ie && this.oApp.oNavigator.version === 8 && document.documentMode === 8){
				jindo.$Element(elBody).css("height", "0px");
			}
			
			nBodyHeight = parseInt(elBody.scrollHeight, 10);

			if(nBodyHeight < this.nBodyMinHeight){
				nBodyHeight = this.nBodyMinHeight;
			}
		
			return nBodyHeight;
		}
		
		// Firefox && Safari	
		if(!this.elDummy){
			this.elDummy = document.createElement('div');
			this.elDummy.className = "se2_input_wysiwyg";

			this.oApp.elEditingAreaContainer.appendChild(this.elDummy);

			this.elDummy.style.cssText = 'position:absolute !important; left:-9999px !important; top:-9999px !important; z-index: -9999 !important; overflow: auto !important;';	
			this.elDummy.style.height = this.nBodyMinHeight + "px";
		}
		
		welBody = jindo.$Element(elBody);
	    i = aCopyStyle.length;
	    oCss = {};
	    
		while(i--){
			oCss[aCopyStyle[i]] = welBody.css(aCopyStyle[i]);
		}
		
		if(oCss.lineHeight.indexOf("px") > -1){
			oCss.lineHeight = (parseInt(oCss.lineHeight, 10)/parseInt(oCss.fontSize, 10));
		}

		jindo.$Element(this.elDummy).css(oCss);
				
		this.elDummy.innerHTML = elBody.innerHTML;
		nBodyHeight = this.elDummy.scrollHeight;
		
		return nBodyHeight;
	},
	
	/**
	 * [SMARTEDITORSUS-677] WYSIWYG ÀÚµ¿ È®Àå Ã³¸®
	 */ 
	_setAutoResize : function(){		
		var elBody = this.getDocument().body,
			welBody = jindo.$Element(elBody),
			nBodyHeight,
			nContainerHeight,
			oCurrentStyle,
			nStyleSize,
			bExpand = false,
			oBrowser = this.oApp.oNavigator;
		
		this.nTopBottomMargin = this.nTopBottomMargin || (parseInt(welBody.css("marginTop"), 10) + parseInt(welBody.css("marginBottom"), 10));
		this.nBodyMinHeight = this.nBodyMinHeight || (this.oApp.getEditingAreaHeight() - this.nTopBottomMargin);

		if((oBrowser.ie && oBrowser.nativeVersion >= 9) || oBrowser.chrome){	// ³»¿ëÀÌ ÁÙ¾îµµ scrollHeight°¡ ÁÙ¾îµéÁö ¾ÊÀ½
			welBody.css("height", "0px");
			this.iframe.style.height = "0px";
		}

		nBodyHeight = this._getResizeHeight();

		if(oBrowser.ie){
			// ³»¿ë µÚ·Î °ø°£ÀÌ ³²¾Æ º¸ÀÏ ¼ö ÀÖÀ¸³ª Ãß°¡·Î Container³ôÀÌ¸¦ ´õÇÏÁö ¾ÊÀ¸¸é
			// ³»¿ë °¡Àå µÚ¿¡¼­ Enter¸¦ ÇÏ´Â °æ¿ì ¾Æ·¡À§·Î Èçµé·Á º¸ÀÌ´Â ¹®Á¦°¡ ¹ß»ý
			if(nBodyHeight > this.nBodyMinHeight){
				oCurrentStyle = this.oApp.getCurrentStyle();
				nStyleSize = parseInt(oCurrentStyle.fontSize, 10) * oCurrentStyle.lineHeight;

				if(nStyleSize < this.nTopBottomMargin){
					nStyleSize = this.nTopBottomMargin;
				}

				nContainerHeight = nBodyHeight + nStyleSize;
				nContainerHeight += 18;
				
				bExpand = true;
			}else{
				nBodyHeight = this.nBodyMinHeight;
				nContainerHeight = this.nBodyMinHeight + this.nTopBottomMargin;
			}
		// }else if(oBrowser.safari){	// -- »çÆÄ¸®¿¡¼­ ³»¿ëÀÌ ÁÙ¾îµéÁö ¾Ê´Â ¹®Á¦°¡ ÀÖ¾î Firefox ¹æ½ÄÀ¸·Î º¯°æÇÔ
			// // [Chrome/Safari] Å©·ÒÀÌ³ª »çÆÄ¸®¿¡¼­´Â Body¿Í iframe³ôÀÌ¼­ ¼­·Î ¿¬°üµÇ¾î ´Ã¾î³ª¹Ç·Î,
			// // nContainerHeight¸¦ Ãß°¡·Î ´õÇÏ´Â °æ¿ì setTimeout ½Ã ¹«ÇÑ Áõ½ÄµÇ´Â ¹®Á¦°¡ ¹ß»ýÇÒ ¼ö ÀÖÀ½
			// nBodyHeight = nBodyHeight > this.nBodyMinHeight ? nBodyHeight - this.nTopBottomMargin : this.nBodyMinHeight;
			// nContainerHeight = nBodyHeight + this.nTopBottomMargin;
		}else{
			// [FF] nContainerHeight¸¦ Ãß°¡·Î ´õÇÏ¿´À½. setTimeout ½Ã ¹«ÇÑ Áõ½ÄµÇ´Â ¹®Á¦°¡ ¹ß»ýÇÒ ¼ö ÀÖÀ½
			if(nBodyHeight > this.nBodyMinHeight){
				oCurrentStyle = this.oApp.getCurrentStyle();
				nStyleSize = parseInt(oCurrentStyle.fontSize, 10) * oCurrentStyle.lineHeight;

				if(nStyleSize < this.nTopBottomMargin){
					nStyleSize = this.nTopBottomMargin;
				}

				nContainerHeight = nBodyHeight + nStyleSize;
				
				bExpand = true;
			}else{
				nBodyHeight = this.nBodyMinHeight;
				nContainerHeight = this.nBodyMinHeight + this.nTopBottomMargin;
			}
		}
		
		if(!oBrowser.firefox){
			welBody.css("height", nBodyHeight + "px");
		}

		this.iframe.style.height = nContainerHeight + "px";				// ÆíÁý¿µ¿ª IFRAMEÀÇ ³ôÀÌ º¯°æ
		this.oApp.welEditingAreaContainer.height(nContainerHeight);		// ÆíÁý¿µ¿ª IFRAMEÀ» °¨½Î´Â DIV ³ôÀÌ º¯°æ
		
		//[SMARTEDITORSUS-941][iOS5´ëÀÀ]¾ÆÀÌÆÐµåÀÇ ÀÚµ¿ È®Àå ±â´ÉÀÌ µ¿ÀÛÇÏÁö ¾ÊÀ» ¶§ ¿¡µðÅÍ Ã¢º¸´Ù ±ä ³»¿ëÀ» ÀÛ¼ºÇÏ¸é ¿¡µðÅÍ¸¦ ¶Õ°í ³ª¿À´Â Çö»ó 
		//¿øÀÎ : ÀÚµ¿È®Àå ±â´ÉÀÌ Á¤Áö µÉ °æ¿ì iframe¿¡ ½ºÅ©·ÑÀÌ »ý±âÁö ¾Ê°í, Ã¢À» ¶Õ°í ³ª¿È
		//ÇØ°á : Ç×»ó ÀÚµ¿È®Àå ±â´ÉÀÌ ÄÑÁ®ÀÖµµ·Ï º¯°æ. ÀÚµ¿ È®Àå ±â´É °ü·ÃÇÑ ÀÌº¥Æ® ÄÚµåµµ ¸ð¹ÙÀÏ »çÆÄ¸®¿¡¼­ ¿¹¿Ü Ã³¸®
		if(!this.oApp.oNavigator.msafari){
			this.oApp.checkResizeGripPosition(bExpand);
		}
	},
	
	/**
	 * ½ºÅ©·Ñ Ã³¸®¸¦ À§ÇØ ÆíÁý¿µ¿ª BodyÀÇ »çÀÌÁî¸¦ È®ÀÎÇÏ°í ¼³Á¤ÇÔ
	 * ÆíÁý¿µ¿ª ÀÚµ¿È®Àå ±â´ÉÀÌ OffÀÎ °æ¿ì¿¡ ÁÖ±âÀûÀ¸·Î ½ÇÇàµÊ
	 */ 
	_setBodyHeight : function(){
		if( this.bStopCheckingBodyHeight ){ // ¸ØÃç¾ß ÇÏ´Â °æ¿ì true, °è¼Ó Ã¼Å©ÇØ¾ß ÇÏ¸é false
			// À§ÁöÀ¨ ¸ðµå¿¡¼­ ´Ù¸¥ ¸ðµå·Î º¯°æÇÒ ¶§ "document´Â css¸¦ »ç¿ë ÇÒ¼ö ¾ø½À´Ï´Ù." ¶ó´Â error °¡ ¹ß»ý.
			// ±×·¡¼­ on_change_mode¿¡¼­ bStopCheckingBodyHeight ¸¦ true·Î º¯°æ½ÃÄÑÁà¾ß ÇÔ.
			return;
		}

		var elBody = this.getDocument().body,
			welBody = jindo.$Element(elBody),
			nMarginTopBottom = parseInt(welBody.css("marginTop"), 10) + parseInt(welBody.css("marginBottom"), 10),
			nContainerOffset = this.oApp.getEditingAreaHeight(),
			nMinBodyHeight = nContainerOffset - nMarginTopBottom,
			nBodyHeight = welBody.height(),
			nScrollHeight,
			nNewBodyHeight;
		
		this.nTopBottomMargin = nMarginTopBottom;
		
		if(nBodyHeight === 0){	// [SMARTEDITORSUS-144] height °¡ 0 ÀÌ°í ³»¿ëÀÌ ¾øÀ¸¸é Å©·Ò10 ¿¡¼­ Ä³·µÀÌ º¸ÀÌÁö ¾ÊÀ½
			welBody.css("height", nMinBodyHeight + "px");

			setTimeout(this.fnSetBodyHeight, 500);	
			return;
		}
		
		welBody.css("height", "0px");
		// [SMARTEDITORSUS-257] IE9, Å©·Ò¿¡¼­ ³»¿ëÀ» »èÁ¦ÇØµµ ½ºÅ©·ÑÀÌ ³²¾ÆÀÖ´Â ¹®Á¦ Ã³¸®
		// body ¿¡ ³»¿ëÀÌ ¾ø¾îÁ®µµ scrollHeight °¡ ÁÙ¾îµéÁö ¾Ê¾Æ height ¸¦ °­Á¦·Î 0 À¸·Î ¼³Á¤
		
		nScrollHeight = parseInt(elBody.scrollHeight, 10);

		nNewBodyHeight = (nScrollHeight > nContainerOffset ? nScrollHeight - nMarginTopBottom : nMinBodyHeight);
		// nMarginTopBottom À» »©Áö ¾ÊÀ¸¸é ½ºÅ©·ÑÀÌ °è¼Ó ´Ã¾î³ª´Â °æ¿ì°¡ ÀÖÀ½ (Âü°í [BLOGSUS-17421])

		if(this._isHorizontalScrollbarVisible()){
			nNewBodyHeight -= this.nScrollbarWidth;
		}
		
		welBody.css("height", nNewBodyHeight + "px");
		
		setTimeout(this.fnSetBodyHeight, 500);
	},
	
	/**
	 * °¡·Î ½ºÅ©·Ñ¹Ù »ý¼º È®ÀÎ
	 */
	_isHorizontalScrollbarVisible : function(){
		var oDocument = this.getDocument();
		
		if(oDocument.documentElement.clientWidth < oDocument.documentElement.scrollWidth){
			//oDocument.body.clientWidth < oDocument.body.scrollWidth ||
			
			return true;
		}
		
		return false;
	},
	
	/**
	 *  bodyÀÇ offsetÃ¼Å©¸¦ ¸ØÃß°Ô ÇÏ´Â ÇÔ¼ö.
	 */
	$ON_STOP_CHECKING_BODY_HEIGHT :function(){
		if(!this.bStopCheckingBodyHeight){
			this.bStopCheckingBodyHeight = true;
		}
	},
	
	/**
	 *  bodyÀÇ offsetÃ¼Å©¸¦ °è¼Ó ÁøÇà.
	 */
	$ON_START_CHECKING_BODY_HEIGHT :function(){
		if(this.bStopCheckingBodyHeight){
			this.bStopCheckingBodyHeight = false;
			this.fnSetBodyHeight();
		}
	},
	
	$ON_IE_CHECK_EXCEPTION_FOR_SELECTION_PRESERVATION : function(){
		// ÇöÀç ¼±ÅÃµÈ ¾Ù¸®¸ÕÆ®°¡ iframeÀÌ¶ó¸é, ¼¿·º¼ÇÀ» µû·Î ±â¾ï ÇØ µÎÁö ¾Ê¾Æµµ À¯Áö µÊÀ¸·Î RESTORE_IE_SELECTIONÀ» Å¸Áö ¾Êµµ·Ï this._oIERangeÀ» Áö¿öÁØ´Ù.
		// (ÇÊ¿ä ¾øÀ» »Ó´õ·¯ ÀúÀå ½Ã ¹®Á¦ ¹ß»ý)
		var oSelection = this.getDocument().selection;
        if(oSelection && oSelection.type === "Control"){
            this._oIERange = null;
        }
        
		/* // [SMARTEDITORSUS-978] HuskyRange.js ÀÇ [SMARTEDITORSUS-888] ÀÌ½´ ¼öÁ¤°ú °ü·Ã
		var tmpSelection = this.getDocument().selection,
			oRange, elNode;

		if(tmpSelection.type === "Control"){
			oRange = tmpSelection.createRange();
			elNode = oRange.item(0);

			if(elNode && elNode.tagName === "IFRAME"){
				this._oIERange = null;
			}
		}
		*/
	},
	
	_onIEBeforeDeactivate : function(wev){
		var tmpSelection, tmpRange;

		this.oApp.delayedExec("IE_CHECK_EXCEPTION_FOR_SELECTION_PRESERVATION", [], 0);

		if(this._oIERange){
			return;
		}

		// without this, cursor won't make it inside a table.
		// mousedown(_oIERange gets reset) -> beforedeactivate(gets fired for table) -> RESTORE_IE_SELECTION
		if(this._bIERangeReset){
			return;
		}

		this._oIERange = this.oApp.getSelection().cloneRange();
		
		/* [SMARTEDITORSUS-978] HuskyRange.js ÀÇ [SMARTEDITORSUS-888] ÀÌ½´ ¼öÁ¤°ú °ü·Ã
		tmpSelection = this.getDocument().selection;
		tmpRange = tmpSelection.createRange();
		// Control range does not have parentElement
		if(tmpRange.parentElement && tmpRange.parentElement() && tmpRange.parentElement().tagName === "INPUT"){
			this._oIERange = this._oPrevIERange;
		}else{
			this._oIERange = tmpRange;
		}
		*/
	},
	
	$ON_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		if(sMode === this.sMode){
			// [SMARTEDITORSUS-1213][IE9, 10] »çÁø »èÁ¦ ÈÄ zindex 1000ÀÎ div°¡ ÀÜÁ¸ÇÏ´Âµ¥, ±× À§·Î ½æ³×ÀÏ drag¸¦ ½ÃµµÇÏ´Ù º¸´Ï dropÀÌ ºÒ°¡´É.
			var htBrowser = jindo.$Agent().navigator();
			if(htBrowser.ie && htBrowser.nativeVersion > 8){ 
				var elFirstChild = jindo.$$.getSingle("DIV.husky_seditor_editing_area_container").childNodes[0];
				if((elFirstChild.tagName == "DIV") && (elFirstChild.style.zIndex == 1000)){
					elFirstChild.parentNode.removeChild(elFirstChild);
				}
			}
			// --[SMARTEDITORSUS-1213]
			
			this.iframe.style.display = "block";
			
			this.oApp.exec("REFRESH_WYSIWYG", []);
			this.oApp.exec("SET_EDITING_WINDOW", [this.getWindow()]);
			this.oApp.exec("START_CHECKING_BODY_HEIGHT");
		}else{
			this.iframe.style.display = "none";
			this.oApp.exec("STOP_CHECKING_BODY_HEIGHT");
		}
	},

	$AFTER_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		this._oIERange = null;
	},

	$ON_REFRESH_WYSIWYG : function(){
		if(!jindo.$Agent().navigator().firefox){
			return;
		}

		this._disableWYSIWYG();
		this._enableWYSIWYG();
	},
	
	$ON_ENABLE_WYSIWYG : function(){
		this._enableWYSIWYG();
	},

	$ON_DISABLE_WYSIWYG : function(){
		this._disableWYSIWYG();
	},
	
	$ON_IE_HIDE_CURSOR : function(){
		if(!this.oApp.oNavigator.ie){
			return;
		}

		this._onIEBeforeDeactivate();

		// De-select the default selection.
		// [SMARTEDITORSUS-978] IE9¿¡¼­ removeAllRanges·Î Á¦°ÅµÇÁö ¾Ê¾Æ
		// ÀÌÀü IE¿Í µ¿ÀÏÇÏ°Ô empty ¹æ½ÄÀ» »ç¿ëÇÏµµ·Ï ÇÏ¿´À¸³ª doc.selection.typeÀÌ NoneÀÎ °æ¿ì ¿¡·¯
		// Range¸¦ Àç¼³Á¤ ÇØÁÖ¾î selectNone À¸·Î Ã³¸®µÇµµ·Ï ¿¹¿ÜÃ³¸®
		var oSelection = this.oApp.getWYSIWYGDocument().selection;
        if(oSelection && oSelection.createRange){
        	try{
        		oSelection.empty();
        	}catch(e){
        		// [SMARTEDITORSUS-1003] IE9 / doc.selection.type === "None"
        		oSelection = this.oApp.getSelection();
        		oSelection.select();
        		oSelection.oBrowserSelection.selectNone();
        	}
        }else{
            this.oApp.getEmptySelection().oBrowserSelection.selectNone();
        }
	},
	
	$AFTER_SHOW_ACTIVE_LAYER : function(){
		this.oApp.exec("IE_HIDE_CURSOR",[]);
		this.bActiveLayerShown = true;
	},
	
	$BEFORE_EVENT_EDITING_AREA_KEYDOWN : function(oEvent){
		this._bKeyDown = true;
	},
	
	$ON_EVENT_EDITING_AREA_KEYDOWN : function(oEvent){
		if(this.oApp.getEditingMode() !== this.sMode){
			return;
		}
		
		var oKeyInfo = oEvent.key();
		
		if(this.oApp.oNavigator.ie){
			//var oKeyInfo = oEvent.key();
			switch(oKeyInfo.keyCode){
				case 33:
					this._pageUp(oEvent);
					break;
				case 34:
					this._pageDown(oEvent);
					break;
				case 8:		// [SMARTEDITORSUS-495][SMARTEDITORSUS-548] IE¿¡¼­ Ç¥°¡ »èÁ¦µÇÁö ¾Ê´Â ¹®Á¦
					this._backspaceTable(oEvent);
					break;
				default:
			}
		}else if(this.oApp.oNavigator.firefox){
			// [SMARTEDITORSUS-151] FF ¿¡¼­ Ç¥°¡ »èÁ¦µÇÁö ¾Ê´Â ¹®Á¦
			if(oKeyInfo.keyCode === 8){				// backspace
				this._backspaceTable(oEvent);
			}
		}
		
		this._recordUndo(oKeyInfo);	// Ã¹¹øÂ° Delete Å° ÀÔ·Â ÀüÀÇ »óÅÂ°¡ ÀúÀåµÇµµ·Ï KEYDOWN ½ÃÁ¡¿¡ ÀúÀå
	},
	
	_backspaceTable : function(weEvent){
		var oSelection = this.oApp.getSelection(),
			preNode = null;

		if(!oSelection.collapsed){
			return;
		}
		
		preNode = oSelection.getNodeAroundRange(true, false);

		if(preNode && preNode.nodeType === 3 && /^[\n]*$/.test(preNode.nodeValue)){
			preNode = preNode.previousSibling;
		}

		if(!!preNode && preNode.nodeType === 1 && preNode.tagName === "TABLE"){	
			jindo.$Element(preNode).leave();
			weEvent.stop(jindo.$Event.CANCEL_ALL);
		}
	},
	
	$BEFORE_EVENT_EDITING_AREA_KEYUP : function(oEvent){
		// IE(6) sometimes fires keyup events when it should not and when it happens the keyup event gets fired without a keydown event
		if(!this._bKeyDown){
			return false;
		}
		this._bKeyDown = false;
	},
	
	$ON_EVENT_EDITING_AREA_MOUSEUP : function(oEvent){
		this.oApp.saveSnapShot();
	},

	$BEFORE_PASTE_HTML : function(){
		if(this.oApp.getEditingMode() !== this.sMode){
			this.oApp.exec("CHANGE_EDITING_MODE", [this.sMode]);
		}
	},
	
	$ON_PASTE_HTML : function(sHTML, oPSelection, bNoUndo){
		var oSelection, oNavigator, sTmpBookmark, 
			oStartContainer, aImgChild, elLastImg, elChild, elNextChild;

		if(this.oApp.getEditingMode() !== this.sMode){
			return;
		}
		
		if(!bNoUndo){
			this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["PASTE HTML"]);
		}
		 
		oNavigator = jindo.$Agent().navigator();
		oSelection = oPSelection || this.oApp.getSelection();

		//[SMARTEDITORSUS-888] ºê¶ó¿ìÀú º° Å×½ºÆ® ÈÄ ¾Æ·¡ ºÎºÐÀÌ ºÒÇÊ¿äÇÏ¿© Á¦°ÅÇÔ
		//	- [SMARTEDITORSUS-387] IE9 Ç¥ÁØ¸ðµå¿¡¼­ ¿¤¸®¸ÕÆ® µÚ¿¡ ¾î¶°ÇÑ ¿¤¸®¸ÕÆ®µµ ¾ø´Â »óÅÂ¿¡¼­ Ä¿¼­°¡ ¾Èµé¾î°¡´Â Çö»ó.
		// if(oNavigator.ie && oNavigator.nativeVersion >= 9 && document.documentMode >= 9){
		//		sHTML = sHTML + unescape("%uFEFF");
		// }
		if(oNavigator.ie && oNavigator.nativeVersion == 8 && document.documentMode == 8){
			sHTML = sHTML + unescape("%uFEFF");
		}

		oSelection.pasteHTML(sHTML);
		
		// every browser except for IE may modify the innerHTML when it is inserted
		if(!oNavigator.ie){
			sTmpBookmark = oSelection.placeStringBookmark();
			this.oApp.getWYSIWYGDocument().body.innerHTML = this.oApp.getWYSIWYGDocument().body.innerHTML;
			oSelection.moveToBookmark(sTmpBookmark);
			oSelection.collapseToEnd();
			oSelection.select();
			oSelection.removeStringBookmark(sTmpBookmark);
			// [SMARTEDITORSUS-56] »çÁøÀ» ¿¬¼ÓÀ¸·Î Ã·ºÎÇÒ °æ¿ì ¿¬ÀÌ¾î »ðÀÔµÇÁö ¾Ê´Â Çö»óÀ¸·Î ÀÌ½´¸¦ ¹ß°ßÇÏ°Ô µÇ¾ú½À´Ï´Ù.
			// ±×·¯³ª ÀÌ´Â ºñ´Ü '´Ù¼öÀÇ »çÁøÀ» Ã·ºÎÇÒ °æ¿ì'¿¡¸¸ ¹ß»ýÇÏ´Â ¹®Á¦´Â ¾Æ´Ï¾ú°í, 
			// ¿øÀÎ È®ÀÎ °á°ú ÄÁÅÙÃ÷ »ðÀÔ ÈÄ ±âÁ¸ Bookmark »èÁ¦ ½Ã °»½ÅµÈ Selection ÀÌ Á¦´ë·Î ¹Ý¿µµÇÁö ¾Ê´Â Á¡ÀÌ ÀÖ¾ú½À´Ï´Ù.
			// ÀÌ¿¡, Selection À» °»½ÅÇÏ´Â ÄÚµå¸¦ Ãß°¡ÇÏ¿´½À´Ï´Ù.
			oSelection = this.oApp.getSelection();
			
			//[SMARTEDITORSUS-831] ºñIE °è¿­ ºê¶ó¿ìÀú¿¡¼­ ½ºÅ©·Ñ¹Ù°¡ »ý±â°Ô ¹®ÀÚÀÔ·Â ÈÄ ¿£ÅÍ Å¬¸¯ÇÏÁö ¾ÊÀº »óÅÂ¿¡¼­ 
			//ÀÌ¹ÌÁö ÇÏ³ª »ðÀÔ ½Ã ÀÌ¹ÌÁö¿¡ Æ÷Ä¿½ÌÀÌ ³õÀÌÁö ¾Ê½À´Ï´Ù.
			//¿øÀÎ : parameter·Î ³Ñ°Ü ¹ÞÀº oPSelecion¿¡ º¯°æµÈ °ªÀ» º¹»çÇØ ÁÖÁö ¾Ê¾Æ¼­ ¹ß»ý
			//ÇØ°á : parameter·Î ³Ñ°Ü ¹ÞÀº oPSelecion¿¡ º¯°æµÈ °ªÀ» º¹»çÇØÁØ´Ù
			//       call by reference·Î ³Ñ°Ü ¹Þ¾ÒÀ¸¹Ç·Î Á÷Á¢ °´Ã¼ ¾ÈÀÇ ÀÎÀÚ °ªÀ» ¹Ù²ãÁÖ´Â setRange ÇÔ¼ö »ç¿ë
			if(!!oPSelection){
				oPSelection.setRange(oSelection);
			}
		}else{
			// [SMARTEDITORSUS-428] [IE9.0] IE9¿¡¼­ Æ÷½ºÆ® ¾²±â¿¡ Á¢±ÙÇÏ¿© ¸ÇÀ§¿¡ ÀÓÀÇÀÇ ±Û°¨ Ã·ºÎ ÈÄ ¿£ÅÍ¸¦ Å¬¸¯ ½Ã ±Û°¨ÀÌ »ç¶óÁü
			// PASTE_HTML ÈÄ¿¡ IFRAME ºÎºÐÀÌ ¼±ÅÃµÈ »óÅÂ¿©¼­ Enter ½Ã ³»¿ëÀÌ Á¦°ÅµÇ¾î ¹ß»ýÇÑ ¹®Á¦
			oSelection.collapseToEnd();
			oSelection.select();
			
			this._oIERange = null;
			this._bIERangeReset = false;
		}
		
		// [SMARTEDITORSUS-639] »çÁø Ã·ºÎ ÈÄ ÀÌ¹ÌÁö µÚÀÇ °ø¹éÀ¸·Î ÀÎÇØ ½ºÅ©·ÑÀÌ »ý±â´Â ¹®Á¦
		if(sHTML.indexOf("<img") > -1){
			oStartContainer = oSelection.startContainer;
				
			if(oStartContainer.nodeType === 1 && oStartContainer.tagName === "P"){
				aImgChild = jindo.$Element(oStartContainer).child(function(v){  
					return (v.$value().nodeType === 1 && v.$value().tagName === "IMG");
				}, 1);
				
				if(aImgChild.length > 0){
					elLastImg = aImgChild[aImgChild.length - 1].$value();
					elChild = elLastImg.nextSibling;
					
					while(elChild){
						elNextChild = elChild.nextSibling;
						
						if (elChild.nodeType === 3 && (elChild.nodeValue === "&nbsp;" || elChild.nodeValue === unescape("%u00A0"))) {
							oStartContainer.removeChild(elChild);
						}
					
						elChild = elNextChild;
					}
				}
			}
		}

		if(!bNoUndo){
			this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["PASTE HTML"]);
		}
	},

	/**
	 * [SMARTEDITORSUS-344]»çÁø/µ¿¿µ»ó/Áöµµ ¿¬¼ÓÃ·ºÎ½Ã Æ÷Ä¿½Ì °³¼±ÀÌ½´·Î Ãß°¡µÇ ÇÔ¼ö.
	 */
	$ON_FOCUS_N_CURSOR : function (bEndCursor, sId){
		var el, oSelection;
		if(sId && ( el = jindo.$(sId, this.getDocument()) )){
			// ID°¡ ÁöÁ¤µÈ °æ¿ì, ¹«Á¶°Ç ÇØ´ç ºÎºÐÀ¸·Î Ä¿¼­ ÀÌµ¿
			clearTimeout(this._nTimerFocus);	// ¿¬¼Ó »ðÀÔµÉ °æ¿ì, ¹Ì¿Ï·á Å¸ÀÌ¸Ó´Â Ãë¼ÒÇÑ´Ù.
			this._nTimerFocus = setTimeout(jindo.$Fn(function(el){
				this._scrollIntoView(el);
				this.oApp.exec("FOCUS");
			}, this).bind(el), 300);
			return;
		}

		oSelection = this.oApp.getSelection();
		if(!oSelection.collapsed){ // select ¿µ¿ªÀÌ ÀÖ´Â °æ¿ì
			if(bEndCursor){
				oSelection.collapseToEnd();
			} else {
				oSelection.collapseToStart();
			}
			oSelection.select();
		}else if(bEndCursor){ // select ¿µ¿ªÀÌ ¾ø´Â »óÅÂ¿¡¼­ bEndCursor ÀÌ¸é body ¸Ç µÚ·Î ÀÌµ¿½ÃÅ²´Ù.
			this.oApp.exec("FOCUS");
			el = this.getDocument().body;
			oSelection.selectNode(el);
			oSelection.collapseToEnd();
			oSelection.select();
			this._scrollIntoView(el);
		}else{	// select ¿µ¿ªÀÌ ¾ø´Â »óÅÂ¶ó¸é focus¸¸ ÁØ´Ù.
			this.oApp.exec("FOCUS");
		}			
	},
	
	/* 
	 * ¿¤¸®¸ÕÆ®ÀÇ top, bottom °ªÀ» ¹ÝÈ¯
	 */
	_getElementVerticalPosition : function(el){
	    var nTop = 0,
			elParent = el,
			htPos = {nTop : 0, nBottom : 0};
	    
	    if(!el){
			return htPos;
	    }

	    while(elParent) {
	        nTop += elParent.offsetTop;
	        elParent = elParent.offsetParent;
	    }

	    htPos.nTop = nTop;
	    htPos.nBottom = nTop + jindo.$Element(el).height();
	    
	    return htPos;
	},
	
	/* 
	 * Window¿¡¼­ ÇöÀç º¸¿©Áö´Â ¿µ¿ªÀÇ top, bottom °ªÀ» ¹ÝÈ¯
	 */
	_getVisibleVerticalPosition : function(){
		var oWindow, oDocument, nVisibleHeight,
			htPos = {nTop : 0, nBottom : 0};
		
		oWindow = this.getWindow();
		oDocument = this.getDocument();
		nVisibleHeight = oWindow.innerHeight ? oWindow.innerHeight : oDocument.documentElement.clientHeight || oDocument.body.clientHeight;
		
		htPos.nTop = oWindow.pageYOffset || oDocument.documentElement.scrollTop;
		htPos.nBottom = htPos.nTop + nVisibleHeight;
		
		return htPos;
	},
	
	/* 
	 * ¿¤¸®¸ÕÆ®°¡ WYSIWYG WindowÀÇ Visible ºÎºÐ¿¡¼­ ¿ÏÀüÈ÷ º¸ÀÌ´Â »óÅÂÀÎÁö È®ÀÎ (ÀÏºÎ¸¸ º¸ÀÌ¸é false)
	 */
	_isElementVisible : function(htElementPos, htVisiblePos){					
		return (htElementPos.nTop >= htVisiblePos.nTop && htElementPos.nBottom <= htVisiblePos.nBottom);
	},
	
	/* 
	 * [SMARTEDITORSUS-824] [SMARTEDITORSUS-828] ÀÚµ¿ ½ºÅ©·Ñ Ã³¸®
	 */
	_scrollIntoView : function(el){
		var htElementPos = this._getElementVerticalPosition(el),
			htVisiblePos = this._getVisibleVerticalPosition(),
			nScroll = 0;
				
		if(this._isElementVisible(htElementPos, htVisiblePos)){
			return;
		}
				
		if((nScroll = htElementPos.nBottom - htVisiblePos.nBottom) > 0){
			this.getWindow().scrollTo(0, htVisiblePos.nTop + nScroll);	// Scroll Down
			return;
		}
		
		this.getWindow().scrollTo(0, htElementPos.nTop);	// Scroll Up
	},
	
	$BEFORE_MSG_EDITING_AREA_RESIZE_STARTED  : function(){
		// FF¿¡¼­ HeightÁ¶Á¤ ½Ã¿¡ º»¹®ÀÇ _fitElementInEditingArea()ÇÔ¼ö ºÎºÐ¿¡¼­ selectionÀÌ ±úÁö´Â Çö»óÀ» Àâ±â À§ÇØ¼­
		// StringBookmark¸¦ »ç¿ëÇØ¼­ À§Ä¡¸¦ ÀúÀåÇØµÒ. (step1)
		if(!jindo.$Agent().navigator().ie){
			var oSelection = null;
			oSelection = this.oApp.getSelection();
			this.sBM = oSelection.placeStringBookmark();
		}
	},
	
	$AFTER_MSG_EDITING_AREA_RESIZE_ENDED : function(FnMouseDown, FnMouseMove, FnMouseUp){
		if(this.oApp.getEditingMode() !== this.sMode){
			return;
		}
		
		this.oApp.exec("REFRESH_WYSIWYG", []);
		// bts.nhncorp.com/nhnbts/browse/COM-1042
		// $BEFORE_MSG_EDITING_AREA_RESIZE_STARTED¿¡¼­ ÀúÀåÇÑ StringBookmark¸¦ ¼ÂÆÃÇØÁÖ°í »èÁ¦ÇÔ.(step2)
		if(!jindo.$Agent().navigator().ie){
			var oSelection = this.oApp.getEmptySelection();
			oSelection.moveToBookmark(this.sBM);
			oSelection.select();
			oSelection.removeStringBookmark(this.sBM);	
		}
	},

	$ON_CLEAR_IE_BACKUP_SELECTION : function(){
		this._oIERange = null;
	},
	
	$ON_RESTORE_IE_SELECTION : function(){
		if(this._oIERange){
			// changing the visibility of the iframe can cause an exception
			try{
				this._oIERange.select();

				this._oPrevIERange = this._oIERange;
				this._oIERange = null;
			}catch(e){}
		}
	},
	
	/**
	  * EVENT_EDITING_AREA_PASTE ÀÇ ON ¸Þ½ÃÁö ÇÚµé·¯
	  *		À§ÁöÀ¨ ¸ðµå¿¡¼­ ¿¡µðÅÍ º»¹®ÀÇ paste ÀÌº¥Æ®¿¡ ´ëÇÑ ¸Þ½ÃÁö¸¦ Ã³¸®ÇÑ´Ù.
	  *		paste ½Ã¿¡ ³»¿ëÀÌ ºÙ¿©Áø º»¹®ÀÇ ³»¿ëÀ» ¹Ù·Î °¡Á®¿Ã ¼ö ¾ø¾î delay ¸¦ ÁØ´Ù.
	  */	
	$ON_EVENT_EDITING_AREA_PASTE : function(oEvent){
		this.oApp.delayedExec('EVENT_EDITING_AREA_PASTE_DELAY', [oEvent], 0);
	},

	$ON_EVENT_EDITING_AREA_PASTE_DELAY : function(weEvent) {	
		this._replaceBlankToNbsp(weEvent.element);
	},
	
	// [SMARTEDITORSUS-855] IE¿¡¼­ Æ¯Á¤ ºí·Î±× ±ÛÀ» º¹»çÇÏ¿© ºÙ¿©³Ö±â ÇßÀ» ¶§ °³ÇàÀÌ Á¦°ÅµÇ´Â ¹®Á¦
	_replaceBlankToNbsp : function(el){
		var oNavigator = this.oApp.oNavigator;
		
		if(!oNavigator.ie){
			return;
		}
		
		if(oNavigator.nativeVersion !== 9 || document.documentMode !== 7) { // IE9 È£È¯¸ðµå¿¡¼­¸¸ ¹ß»ý
			return;
		}

		if(el.nodeType !== 1){
			return;
		}
		
		if(el.tagName === "BR"){
			return;
		}
		
		var aEl = jindo.$$("p:empty()", this.oApp.getWYSIWYGDocument().body, { oneTimeOffCache:true });
		
		jindo.$A(aEl).forEach(function(value, index, array) {
			value.innerHTML = "&nbsp;";
		});
	},
	
	_pageUp : function(we){
		var nEditorHeight = this._getEditorHeight(),
			htPos = jindo.$Document(this.oApp.getWYSIWYGDocument()).scrollPosition(),
			nNewTop;

		if(htPos.top <= nEditorHeight){
			nNewTop = 0;
		}else{
			nNewTop = htPos.top - nEditorHeight;
		}
		this.oApp.getWYSIWYGWindow().scrollTo(0, nNewTop);
		we.stop();
	},
	
	_pageDown : function(we){
		var nEditorHeight = this._getEditorHeight(),
			htPos = jindo.$Document(this.oApp.getWYSIWYGDocument()).scrollPosition(),
			nBodyHeight = this._getBodyHeight(),
			nNewTop;

		if(htPos.top+nEditorHeight >= nBodyHeight){
			nNewTop = nBodyHeight - nEditorHeight;
		}else{
			nNewTop = htPos.top + nEditorHeight;
		}
		this.oApp.getWYSIWYGWindow().scrollTo(0, nNewTop);
		we.stop();
	},
	
	_getEditorHeight : function(){
		return this.oApp.elEditingAreaContainer.offsetHeight - this.nTopBottomMargin;
	},
	
	_getBodyHeight : function(){
		return parseInt(this.getDocument().body.scrollHeight, 10);
	},
	
	initIframe : function(){
		try {
			if (!this.iframe.contentWindow.document || !this.iframe.contentWindow.document.body || this.iframe.contentWindow.document.location.href === 'about:blank'){
				throw new Error('Access denied');
			}

			var sCSSBaseURI = (!!nhn.husky.SE2M_Configuration.SE2M_CSSLoader && nhn.husky.SE2M_Configuration.SE2M_CSSLoader.sCSSBaseURI) ? 
					nhn.husky.SE2M_Configuration.SE2M_CSSLoader.sCSSBaseURI : "";

			if(!!nhn.husky.SE2M_Configuration.SE_EditingAreaManager.sCSSBaseURI){
				sCSSBaseURI = nhn.husky.SE2M_Configuration.SE_EditingAreaManager.sCSSBaseURI;
			}

			// add link tag
			if (sCSSBaseURI){
				var doc = this.getDocument();
				var headNode = doc.getElementsByTagName("head")[0];
				var linkNode = doc.createElement('link');
				linkNode.type = 'text/css';
				linkNode.rel = 'stylesheet';
				linkNode.href = sCSSBaseURI + '/smart_editor2_in.css';
				headNode.appendChild(linkNode);
			}
			
			this._enableWYSIWYG();

			this.status = nhn.husky.PLUGIN_STATUS.READY;
		} catch(e) {
			if(this._nIFrameReadyCount-- > 0){
				setTimeout(jindo.$Fn(this.initIframe, this).bind(), 100);
			}else{
				throw("iframe for WYSIWYG editing mode can't be initialized. Please check if the iframe document exists and is also accessable(cross-domain issues). ");
			}
		}
	},

	getIR : function(){
		var sContent = this.iframe.contentWindow.document.body.innerHTML,
			sIR;

		if(this.oApp.applyConverter){
			sIR = this.oApp.applyConverter(this.sMode+"_TO_IR", sContent, this.oApp.getWYSIWYGDocument());
		}else{
			sIR = sContent;
		}

		return sIR;
	},

	setIR : function(sIR){
		// [SMARTEDITORSUS-875] HTML ¸ðµåÀÇ beautify¿¡¼­ Ãß°¡µÈ °ø¹éÀ» ´Ù½Ã Á¦°Å
		//sIR = sIR.replace(/(>)([\n\r\t\s]*)([^<]?)/g, "$1$3").replace(/([\n\r\t\s]*)(<)/g, "$2")
		// --[SMARTEDITORSUS-875]
		
		var sContent, 
			oNavigator = this.oApp.oNavigator, 
			bUnderIE11 = oNavigator.ie && document.documentMode < 11, // IE11¹Ì¸¸
			sCursorHolder = bUnderIE11 ? "" : "<br>";

		if(this.oApp.applyConverter){
			sContent = this.oApp.applyConverter("IR_TO_"+this.sMode, sIR, this.oApp.getWYSIWYGDocument());
		}else{
			sContent = sIR;
		}

		// [SMARTEDITORSUS-1279] [IE9/10] pre ÅÂ±× ¾Æ·¡¿¡ \nÀÌ Æ÷ÇÔµÇ¸é °³ÇàÀÌ µÇÁö ¾Ê´Â ÀÌ½´
		/*if(oNavigator.ie && oNavigator.nativeVersion >= 9 && document.documentMode >= 9){
			// [SMARTEDITORSUS-704] \r\nÀÌ ÀÖ´Â °æ¿ì IE9 Ç¥ÁØ¸ðµå¿¡¼­ Á¤·Ä ½Ã ºê¶ó¿ìÀú°¡ <p>¸¦ Ãß°¡ÇÏ´Â ¹®Á¦
			sContent = sContent.replace(/[\r\n]/g,"");
		}*/

		this.iframe.contentWindow.document.body.innerHTML = sContent;

		// ÆíÁý³»¿ëÀÌ ¾ø´Â °æ¿ì
		if((this.iframe.contentWindow.document.body.innerHTML).replace(/[\r\n\t\s]*/,"") === ""){
			if(this.oApp.sLineBreaker !== "BR"){
				sCursorHolder = "<p>" + sCursorHolder + "</p>";
			}
			this.iframe.contentWindow.document.body.innerHTML = sCursorHolder;
		}
		// [COM-1142] IEÀÇ °æ¿ì <p>&nbsp;</p> ¸¦ <p></p> ·Î º¯È¯
		// [SMARTEDITORSUS-1623] IE11Àº <p></p>·Î º¯È¯ÇÏ¸é ¶óÀÎÀÌ ºÙ¾î¹ö¸®±â ¶§¹®¿¡ IE10¸¸ Àû¿ëÇÏµµ·Ï ¼öÁ¤
		if(bUnderIE11 && this.oApp.getEditingMode() === this.sMode){
			var pNodes = this.oApp.getWYSIWYGDocument().body.getElementsByTagName("P");

			for(var i=0, nMax = pNodes.length; i < nMax; i++){
				if(pNodes[i].childNodes.length === 1 && pNodes[i].innerHTML === "&nbsp;"){
					pNodes[i].innerHTML = '';
				}
			}
		}
	},

	getRawContents : function(){
		return this.iframe.contentWindow.document.body.innerHTML;
	},

	getRawHTMLContents : function(){
		return this.getRawContents();
	},

	setRawHTMLContents : function(sContents){
		this.iframe.contentWindow.document.body.innerHTML = sContents;
	},

	getWindow : function(){
		return this.iframe.contentWindow;
	},

	getDocument : function(){
		return this.iframe.contentWindow.document;
	},
	
	focus : function(){
		//this.getWindow().focus();
		this.getDocument().body.focus();
		this.oApp.exec("RESTORE_IE_SELECTION", []);
	},
	
	_recordUndo : function(oKeyInfo){
		/**
		 * 229: Korean/Eng
		 * 16: shift
		 * 33,34: page up/down
		 * 35,36: end/home
		 * 37,38,39,40: left, up, right, down
		 * 32: space
		 * 46: delete
		 * 8: bksp
		 */
		if(oKeyInfo.keyCode >= 33 && oKeyInfo.keyCode <= 40){	// record snapshot
			this.oApp.saveSnapShot();
			return;
		}

		if(oKeyInfo.alt || oKeyInfo.ctrl || oKeyInfo.keyCode === 16){
			return;
		}

		if(this.oApp.getLastKey() === oKeyInfo.keyCode){
			return;
		}
		
		this.oApp.setLastKey(oKeyInfo.keyCode);

		// && oKeyInfo.keyCode != 32		// ¼Óµµ ¹®Á¦·Î ÀÎÇÏ¿© Space ´Â Á¦¿ÜÇÔ
		if(!oKeyInfo.enter && oKeyInfo.keyCode !== 46 && oKeyInfo.keyCode !== 8){
			return;
		}
	
		this.oApp.exec("RECORD_UNDO_ACTION", ["KEYPRESS(" + oKeyInfo.keyCode + ")", {bMustBlockContainer:true}]);
	},
	
	_enableWYSIWYG : function(){
		//if (this.iframe.contentWindow.document.body.hasOwnProperty("contentEditable")){
		if (this.iframe.contentWindow.document.body.contentEditable !== null) {
			this.iframe.contentWindow.document.body.contentEditable = true;
		} else {
			this.iframe.contentWindow.document.designMode = "on";
		}
				
		this.bWYSIWYGEnabled = true;		
		if(jindo.$Agent().navigator().firefox){
			setTimeout(jindo.$Fn(function(){
				//enableInlineTableEditing : Enables or disables the table row and column insertion and deletion controls. 
				this.iframe.contentWindow.document.execCommand('enableInlineTableEditing', false, false);
			}, this).bind(), 0);
		}
	},
	
	_disableWYSIWYG : function(){
		//if (this.iframe.contentWindow.document.body.hasOwnProperty("contentEditable")){
		if (this.iframe.contentWindow.document.body.contentEditable !== null){
			this.iframe.contentWindow.document.body.contentEditable = false;
		} else {
			this.iframe.contentWindow.document.designMode = "off";
		}
		this.bWYSIWYGEnabled = false;
	},
	
	isWYSIWYGEnabled : function(){
		return this.bWYSIWYGEnabled;
	}
});
//}
//{
/**
 * @pluginDesc WYSIWYG ¿µ¿ª¿¡ ºÙ¿©³Ö¾îÁö´Â ¿ÜºÎ ÄÁÅÙÃ÷¸¦ Á¤Á¦ÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.SE_PasteHandler = jindo.$Class({
	name : "SE_PasteHandler",
	
	$init : function(sParagraphContainer){
		// ¹®´Ü ´ÜÀ§
		this.sParagraphContainer = sParagraphContainer || "P";
		
		this.htBrowser = jindo.$Agent().navigator();
	},
	
	$ON_MSG_APP_READY : function(){
		if(!this.htBrowser.safari){
			this.elBody = this.oApp.getWYSIWYGDocument().body;
			this.wfnPasteHandler = jindo.$Fn(this._handlePaste, this);
			this.wfnPasteHandler.attach(this.elBody, "paste");
		}
	},
	
	_handlePaste : function(we){
		this.oApp.exec("SHOW_LOADING_LAYER", ["º¹»çµÈ ÄÁÅÙÃ÷¸¦ ºÙ¿©³Ö°í ÀÖ½À´Ï´Ù.\nÄÁÅÙÃ÷°¡ ¸¹Àº °æ¿ì, ´Ù¼Ò ½Ã°£ÀÌ °É¸± ¼ö ÀÖ½À´Ï´Ù.", 3000, 1000]);
		
		if(this.htBrowser.chrome){
			/**
			 * [Chrome] clipboard¿¡¼­ ³Ñ¾î¿Â style Á¤ÀÇ¸¦ ÀúÀåÇØ µÐ µÚ, 
			 * Æ¯Á¤ ¿­¸° ÅÂ±×¿¡ styleÀ» Àû¿ëÇØ¾ß ÇÒ °æ¿ì È°¿ëÇÑ´Ù.
			 * 
			 * MS Excel 2010 ±âÁØÀ¸·Î
			 * <td>¿¡ ´ã±ä class ¸íÀ» È¹µæÇÑ µÚ,
			 * ÀúÀåÇØ µÐ style¿¡¼­ ¸ÅÄªÇÏ´Â °ªÀÌ ÀÖÀ¸¸é
			 * styleÀ» ÇØ´ç ÅÂ±×¿¡ Àû¿ëÇÑ´Ù.
			 * 
			 * [IE] Text ÇüÅÂ·Î¸¸ °ªÀ» °¡Á®¿Ã ¼ö ÀÖ±â ¶§¹®¿¡ style Á¤ÀÇ ÀúÀå ºÒ°¡
			 * */
			var sClipboardData = we._event.clipboardData.getData("text/html");
			var elTmp = document.createElement("DIV");
			elTmp.innerHTML = sClipboardData;
			var elStyle = jindo.$$.getSingle("style", elTmp, {oneTimeOffCache : true});
			if(elStyle){
				var sStyleFromClipboard = elStyle.innerHTML;
				
				// style="" ³»ºÎ¿¡ »ðÀÔµÇ´Â °æ¿ì, Á¶È­¸¦ ÀÌ·ç¾î¾ß ÇÏ±â ¶§¹®¿¡ ½Öµû¿ÈÇ¥¸¦ µû¿ÈÇ¥·Î Ä¡È¯
				sStyleFromClipboard = sStyleFromClipboard.replace(/"/g, "'");
				
				this._sStyleFromClipboard = sStyleFromClipboard;
			}
		}
		
		// WYSIWYG ¿µ¿ªÀÇ HTMLÀ» °í½º¶õÈ÷ ´ã¾Æ ÀúÀåÇÑ µÚ, WYSIWYG ¿µ¿ªÀ» ºñ¿î´Ù.
		this._preparePaste();
		
		setTimeout(jindo.$Fn(function(){
			// ºñ¿öÁø WYSIWYG ¿µ¿ª ¾È¿¡ Å¬¸³º¸µå¿¡¼­ ºÙ¿©³Ö¾îÁø ÄÁÅÙÃ÷°¡ Ã¤¿öÁö°í, ÀÌ¸¦ È¹µæÇÏ¿© Ã³¸®ÇÑ´Ù.
			this._processPaste();
			this.oApp.exec("HIDE_LOADING_LAYER");
		}, this).bind(), 0);
		
	},
	
	/**
	 * ºÙ¿©³Ö¾îÁö´Â ¿ÜºÎ ÇÁ·Î±×·¥ÀÇ ÄÁÅÙÃ÷¸¦ Á¶ÀÛÇÏ±â À§ÇÑ ÁØºñ¸¦ ÇÑ´Ù.
	 * */
	_preparePaste : function(){
		this._saveOriginalContents();
	},
	
	/**
	 * º»¹® ¿µ¿ªÀÇ ¿ø¹®À» ÀúÀåÇØ µÐ´Ù.
	 * */
	_saveOriginalContents : function(){
		// ¿ì¼± ¼±ÅÃµÈ ¿µ¿ªÀÇ ÄÁÅÙÃ÷µéÀ» Áö¿î´Ù.
		var oSelection = this.oApp.getSelection();
		oSelection.deleteContents();
		
		// ÇöÀç Ä¿¼­ À§Ä¡¸¦ ±â¾ïÇØ µÎ±â À§ÇÑ ºÏ¸¶Å©
		this._sBM = oSelection.placeStringBookmark();
		
		// º»¹® ¿µ¿ª¿¡ ÀÖ´Â ¿ø¹® ÀúÀå
		this._sOriginalContent = this.elBody.innerHTML;
		
		// ¿ÜºÎ ÇÁ·Î±×·¥¿¡¼­ ºÙ¿©³Ö¾îÁø ÄÁÅÙÃ÷¸¦ ÀúÀåÇÏ±â ¼ö¿ùÇÏµµ·Ï º»¹® ¿µ¿ªÀ» ºñ¿î´Ù.
		this.elBody.innerHTML = "";
	},
	
	/**
	 * ¿ÜºÎ ÇÁ·Î±×·¥ÀÇ ÄÁÅÙÃ÷°¡ ¿ø¹®¿¡ ºÙ¿©³Ö¾îÁö´Â °úÁ¤À» ÁøÇàÇÑ´Ù.
	 * */
	_processPaste : function(){
		this._savePastedContents();
		
		// ¿ø¹®À» º»¹® ¿µ¿ª¿¡ ºÙ¿©³Ö´Â´Ù.
		this.elBody.innerHTML = this._sOriginalContent;
		
		// º»¹® ¿µ¿ª¿¡ ÇÊÅÍ¸µµÈ ÄÁÅÙÃ÷¸¦ ºÙ¿©³Ö´Â ºÎºÐ
		if(!this._isPastedContentsEmpty){
			this._loadPastedContents();
		}
	},
	
	/**
	 * º»¹® ¿µ¿ª¿¡ ¿ÜºÎ ÇÁ·Î±×·¥ÀÇ ÄÁÅÙÃ÷°¡ ºÙ¿©³Ö¾îÁö¸é ÀÌ¸¦ ÀúÀåÇÏ°í,
	 * SmartEditor¿¡ ¸Â°Ô ÇÊÅÍ¸µÇÑ µÚ, º»¹® ¿µ¿ªÀ» ºñ¿î´Ù. 
	 * */
	_savePastedContents : function(){
		var sTarget = this.elBody.innerHTML;
		
		this._isPastedContentsEmpty = true; // ºÙ¿©³Ö¾îÁø ³»¿ëÀÌ ¾ø´ÂÁö È®ÀÎ
		
		if(sTarget != ""){
			this._isPastedContentsEmpty = false;
			
			/**
			 * [FireFox] clipboard¿¡¼­ style Á¤ÀÇ¸¦ ÀúÀåÇÒ ¼ö´Â ¾øÁö¸¸,
			 * º»¹®¿¡ ºÙ¿©³Ö¾îÁø µÚ È¹µæÇÏ¿© ÀúÀå °¡´É
			 * */
			if(this.htBrowser.firefox){
				var aStyleFromClipboard = sTarget.match(/<style>([^<>]+)<\/style>/i);
				if(aStyleFromClipboard){
					var sStyleFromClipboard = aStyleFromClipboard[1];
					// style="" ³»ºÎ¿¡ »ðÀÔµÇ´Â °æ¿ì, Á¶È­¸¦ ÀÌ·ç¾î¾ß ÇÏ±â ¶§¹®¿¡ ½Öµû¿ÈÇ¥¸¦ µû¿ÈÇ¥·Î Ä¡È¯
					sStyleFromClipboard = sStyleFromClipboard.replace(/"/g, "'");
					
					this._sStyleFromClipboard = sStyleFromClipboard;
				}
			}
			
			// ºÙ¿©³Ö¾îÁø ÄÁÅÙÃ÷¸¦ Á¤Á¦
			sTarget = this._filterPastedContents(sTarget);
			
			this._sTarget = sTarget;
			
			this._aTarget = [];
			
			// ¿ø¹®À» º»¹® ¿µ¿ª¿¡ ºÙ¿©³Ö±â À§ÇØ º»¹® ¿µ¿ªÀ» ºñ¿î´Ù.
			this.elBody.innerHTML = "";
		}
	},
	
	/**
	 * SmartEditor¿¡ ¸Â´Â ÇÊÅÍ¸µÀ» °ÅÄ£ ÄÁÅÙÃ÷¸¦ ¹ÝÈ¯ÇÑ´Ù.
	 * @param {String} ÇÊÅÍ¸µ ´ë»óÀÌ µÉ HTML
	 * */
	_filterPastedContents : function(sOriginalContent){
		// ¹®´Ü ±³Ã¼¿Í °ü·ÃµÈ º¯¼ö
		this._isPastedMultiParagraph = false; // ºÙ¿©³Ö¾îÁö´Â ÄÁÅÙÃ÷°¡ ¿©·¯ ¹®´ÜÀ¸·Î ±¸¼ºµÇ¾î ÀÖ´ÂÁö È®ÀÎ
		this._aGoesPreviousParagraph = []; // ¹®´ÜÀÇ ºÐ¸®°¡ ÀÖ´Â °æ¿ì, ¿ø·¡ÀÇ ºÏ¸¶Å©°¡ ÀÖ´Â ¹®´ÜÀ¸·Î ³Ñ¾î°¥ inline ¿ä¼ÒµéÀÇ ÁýÇÕ
		var bParagraphChangeStart = false,
		bParagraphChangeEnd = false,
		nParagraphHierarchy = 0, // ¸î ÁßÀ¸·Î ¿­·Á ÀÖ´ÂÁö È®ÀÎ
		nParagraphChangeCount = 0, // ¹®´Ü ±³Ã¼ È½¼ö
		bParagraphIsOpen = false; // ÇöÀç ¹®´ÜÀÌ ¿­·Á ÀÖ´ÂÁö È®ÀÎ
		
		var sMatch, // ÆÇº°½Ä°ú ÀÏÄ¡ÇÏ´Â ºÎºÐ 
		sResult, // ÆÇº°½Ä°ú ÀÏÄ¡ÇÏ´Â ºÎºÐÀÌ ÇÊÅÍ¸µÀ» °ÅÃÄ ÃÖÁ¾ÀûÀ¸·Î ¹ÝÈ¯µÇ´Â ÇüÅÂ
		aResult = [], // ÃÖÁ¾ÀûÀ¸·Î ¹ÝÈ¯µÇ´Â Á¤Á¦µÈ ÄÁÅÙÃ÷µéÀÌ ´ã±ä ¹è¿­
		nCurrentIndex = 0, // ÇöÀç ÀÛ¾÷ ÁßÀÎ ºÎºÐÀÌ °á°ú ¹è¿­¿¡¼­ Â÷ÁöÇÏ´Â index
		sTagName, // ÆÇº°½Ä°ú ÀÏÄ¡ÇÏ´Â ºÎºÐÀÇ ÅÂ±×¸í
		sPreviousContent = "", // Á÷Àü »ðÀÔµÈ ÄÁÅÙÃ÷
		aMultiParagraphIndicator = ["BLOCKQUOTE", "DD", "DIV", "DL", "FORM", "H1", "H2", "H3", "H4", "H5", "H6",
		                            "HR", "OL", "P", "TABLE", "UL", "IFRAME"], // white list·Î ¿©·¯ ¹®´ÜÀ¸·Î Ã³¸®ÇØ¾ß ÇÏ´Â °æ¿ì¸¦ ±¸º° (https://developer.mozilla.org/ko/docs/HTML/Block-level_elements) 
		// ÇöÀç ÀÛ¾÷ÀÌ Å×ÀÌºí ³»ºÎ¿¡¼­ ÀÌ·ç¾îÁö°í ÀÖ´ÂÁö È®ÀÎ. tr, td¿¡ styleÀÌ ¸í½ÃµÇ¾î ÀÖÁö ¾ÊÀº °æ¿ì »ç¿ë
		isInTableContext = false,
		nTdIndex = 0, // tr, tdÀÇ style Ä³½Ì Áß¿¡ ÇöÀç ¸î ¹øÂ° tdÀÎÁö È®ÀÎÀ» À§ÇÔ
		nTdLength = 0, // Ä³½Ì ½ÃÁ¡¿¡ ÃÑ tdÀÇ ¼ö¸¦ ±¸ÇÔ
		aColumnWidth = [], // colÀÇ width¸¦ ÀúÀåÇÏ´Â ¹è¿­
		nRowHeight; // trÀÇ height ÀúÀå¿ë
		                            
		// ÆÐÅÏ
		var rxOpeningTag = /^<[^?\/\s>]+(([\s]{0})|([\s]+[^>]+))>/, // ¿­¸° ÅÂ±×
		rxTagName = /^<[\/]?([^\s]+)(([\s]{0})|([\s]+[^>]+))>/, // ÅÂ±×¸í
		rxClosingTag = /^<\/[A-Za-z]+>/, // ´ÝÈù ÅÂ±×
		rxOpeningAndClosingTag = /^<[^>]+\/>/, // ÀÚÃ¼·Î ¿­°í ´Ý´Â ÅÂ±×
		rxCommentTag = /^<!--[^<>]+-->/, // ÁÖ¼®ÀÌ³ª Ä¿½ºÅÒ ÅÂ±×
		rxOpeningCommentTag = /^<!--[^->]+>/, // ¿­¸° ÁÖ¼® ÅÂ±×
		rxClosingCommentTag = /^<![^->]+-->/,	// ´ÝÈù ÁÖ¼® ÅÂ±×
		rxWhiteSpace = /^[\n\r\t\s]+/, // °ø¹é
		rxNonTag = /^[^<\n]+/, // ÅÂ±× ¾Æ´Ñ ¿ä¼Ò
		rxExceptedOpeningTag = /^<[^<>]+>/, // ¾î´À Á¶°Çµµ Åë°úÇÏÁö ¾ÊÀº, ¿­¸° ¿¹¿Ü ÅÂ±×µé
		rxExceptedClosingTag = /^<\/[^<>]+>/, // ¾î´À Á¶°Çµµ Åë°úÇÏÁö ¾ÊÀº, ´ÝÈù ¿¹¿Ü ÅÂ±×µé

		// MS ÇÁ·Î±×·¥ÀÇ Å×ÀÌºí¿¡¼­ Æ¯È÷ »ç¿ëÇÏ´Â ÆÐÅÏ
		rxStyle = /(style[\s]*=[\s]*)(["'])([^"']*)(["'])/gi, // style ¼Ó¼º È¹µæ
		rxMsoStyle = /(mso-[^:]+[\s]*:[\s]*)([^;"]*)([;]?)/gi, // Mso-·Î ½ÃÀÛÇÏ´Â ½ºÅ¸ÀÏÀÌ ÀÖ´ÂÁö °Ë»ç
		rxClass = /class[\s]*=[\s]*["']([^"']*)["']/, // class ¼Ó¼º È¹µæ
		rxTableClassModify = /(class[\s]*=[\s]*["'])([^"']+)(["'])/gi,
		rxTableClassAdd = /(^<table)/gi,
		bColgroupAppeared, // [IE 8~11] MS Excel¿¡¼­ ¿­¸° Ã¤ »ðÀÔµÇ´Â colgroup ÅÂ±×¸¦ Ã³¸®ÇÏ±â À§ÇØ, ºÎµæÀÌÇÏ°Ô ¼öµ¿À¸·Î </colgroup>À» Ãß°¡ÇÏ±â À§ÇÑ flag. <table> ´ÜÀ§·Î »ç¿ë
		
		rxApplied; // °á°ú ¹®ÀÚ¿­ ÀÛ¾÷½Ã Àû¿ëÇÏ´Â ÆÐÅÏ

		/**
		 * ¿øº» StringÀÇ ¾Õ¿¡¼­ºÎÅÍ ÀÐ¾î ³ª°¡¸ç 
		 * ÆÐÅÏ°ú ÀÏÄ¡ÇÏ´Â ºÎºÐÀ» ÇÏ³ª¾¿ Ã³¸®ÇÏ°í,
		 * ÀÛ¾÷ÀÌ ³¡³­ ´ë»óÀº
		 * °á°ú ¹è¿­·Î º¸³¿°ú µ¿½Ã¿¡
		 * ¿ø·¡ÀÇ String¿¡¼­ Á¦°ÅÇÑ´Ù.
		 * ´õ ÀÌ»ó Ã³¸®ÇÒ StringÀÌ ¾øÀ» ¶§ Á¾·á.
		 * */
		while(sOriginalContent != ""){
			sResult = "",
			sMatch = "";

			/**
			 * ¿øº» StringÀÇ °¡Àå ¾Õ ºÎºÐÀº ¾Æ·¡ÀÇ ÆÐÅÏ ºÐ±â Áß ÇÏ³ª¿Í ÀÏÄ¡ÇÏ¸ç,
			 * sMatch, sResult, rxAppliedÀÇ 3°¡Áö º¯¼ö·Î ÀÛ¾÷ÇÑ´Ù.
			 * 
			 * sMatch : ÆÐÅÏ°ú ÀÏÄ¡ÇÏ´Â ºÎºÐÀ» ¿ì¼± È¹µæ. ÀÛ¾÷ ´ë»óÀÌ´Ù.
			 * sResult : sMatch¿¡¼­ Á¤Á¦°¡ ÀÌ·ç¾îÁø °á°ú¹°. ÀÌµéÀÇ ÁýÇÕÀÌÀÚ, ¹ÝÈ¯°ª°ú ¿¬°áµÈ aResult¿¡ ÀúÀåµÈ´Ù.
			 * rxApplied : ¿øº» String¿¡¼­ ÀÛ¾÷ÀÌ ³¡³­ ºÎºÐÀ» Áö¿ï ¶§ ÀçÈ°¿ë
			 * */
			if(rxOpeningAndClosingTag.test(sOriginalContent)){ // <tagName />
				sMatch = sOriginalContent.match(rxOpeningAndClosingTag)[0];
				
				sResult = sMatch;
				
				rxApplied = rxOpeningAndClosingTag;
			}else if(rxClosingCommentTag.test(sOriginalContent)){ // <! text-->
				sMatch = sOriginalContent.match(rxClosingCommentTag)[0];
				
				sResult = sMatch;
				
				rxApplied = rxClosingCommentTag; 
			}else if(rxOpeningCommentTag.test(sOriginalContent)){ // <!-- text>
				sMatch = sOriginalContent.match(rxOpeningCommentTag)[0];
			
				sResult = sMatch;
				
				rxApplied = rxOpeningCommentTag;
			}else if(rxOpeningTag.test(sOriginalContent)){ // <tagName>
				sMatch = sOriginalContent.match(rxOpeningTag)[0];
				
				// class attributeÀÇ °ª È¹µæ
				var sClassAttr;
				if(rxClass.test(sMatch)){
					sClassAttr = sMatch.match(rxClass)[1];
				}
				
				// ½ÇÁúÀûÀ¸·Î ½ºÅ¸ÀÏÀÌ³ª Å¬·¡½º Á¶ÀÛÀÌ ÀÌ·ç¾îÁö´Â ÂÊÀº ¿­¸° ÅÂ±× ºÎºÐ
				// &quot; ¸¦ ' ·Î Ä¡È¯
				sMatch = sMatch.replace(/&quot;/gi, "'");
				// mso- ·Î ½ÃÀÛÇÏ´Â style Á¦°Å
				sMatch = sMatch.replace(rxMsoStyle, "");
				
				var _widthAttribute, _heightAttribute, _widthStyle, _heightStyle, _nWidth, _nHeight,
				_bStyleReplaceNeed = false, // width, style ÀÌ attribute·Î Á¸ÀçÇÑ´Ù¸é, ÀÌ¸¦ style·Î º¯È¯ÇØ Áà¾ß ÇÒ ÇÊ¿ä°¡ ÀÖÀ½
				rxWidthAttribute = /([^\w-]width[\s]*=[\s]*)(["'])([A-Za-z0-9.]+)(["'])/i, 
				rxHeightAttribute = /([^\w-]height[\s]*=[\s]*)(["'])([A-Za-z0-9.]+)(["'])/i,
				rxWidthStyle = /(["';\s])(width[\s]*:[\s]*)([A-Za-z0-9.]+)([;]?)/i,
				rxHeightStyle = /(["';\s])(height[\s]*:[\s]*)([A-Za-z0-9.]+)([;]?)/i;
				
				/**
				 * ¸ðµç ¿­¸° ÅÂ±× °øÅëÃ³¸®»çÇ×.
				 * 
				 * width, height°¡ attribute¿¡ ÇÒ´çµÇ¾î ÀÖ°Å³ª, ±× ´ÜÀ§°¡ px°¡ ¾Æ´Ñ ptÀÎ °æ¿ì¿¡
				 * px ´ÜÀ§·Î style ¾ÈÀ¸·Î ¹Ù²ã³Ö´Â º¸Á¤ÀÌ ÀÌ·ç¾îÁø´Ù.
				 * __se_tbl Å¬·¡½º¸¦ °¡Áø SmartEditorÀÇ Ç¥´Â
				 * width, heightÀÇ ¸®»çÀÌÂ¡ÀÌ ¹ß»ýÇÒ ¶§
				 * ½Ç½Ã°£ º¯È­°¡ Àû¿ëµÇ´Â style¿¡ ±× °á°ú°ªÀ» px·Î ÀúÀåÇÏ±â ¶§¹®ÀÌ´Ù.
				 * @see hp_SE2M_TableEditor.js
				 * */
				
				// width attribute°¡ Á¸ÀçÇÑ´Ù¸é
				if(rxWidthAttribute.test(sMatch)){
					_widthAttribute = sMatch.match(rxWidthAttribute)[3];
					
					if(/pt/.test(_widthAttribute)){
						_nWidth = parseFloat(_widthAttribute, 10) * 96 / 72 + "px"; // pt¸¦ px·Î º¯È¯
					}else if(/px/.test(_widthAttribute)){ // º¯È¯À» °ÅÄ¥ ÇÊ¿ä ¾øÀ½
						_nWidth = _widthAttribute;
					}else if(!/px/.test(_widthAttribute)){ // ¼ýÀÚ¸¸ ÀÖ´Â °æ¿ì
						_nWidth = _widthAttribute + "px";
					}
					
					sMatch = sMatch.replace(rxWidthAttribute, "");
					
					// style·Î º¯È¯ÇØ ÁÙ ÇÊ¿ä°¡ ÀÖ´Ù.
					_bStyleReplaceNeed = true;
				}else{
					_bStyleReplaceNeed = false;
				}
				
				// width styleÀÌ Á¸ÀçÇÑ´Ù¸é
				if(rxWidthStyle.test(sMatch)){
					_widthStyle = sMatch.match(rxWidthStyle)[3];
					
					if(/pt/.test(_widthStyle)){
						_nWidth = parseFloat(_widthStyle, 10) * 96 / 72 + "px"; // pt¸¦ px·Î º¯È¯
					}
					
					sMatch = sMatch.replace(rxWidthStyle, "$1$2" + _nWidth + ";");
				}else{
					if(_bStyleReplaceNeed){
						// attribute¿¡¼­ style¿ëÀ¸·Î º¯È¯ÇÑ °ªÀ» »ç¿ë
						if(!!rxStyle.test(sMatch)){
							sMatch = sMatch.replace(rxStyle, "$1$2width:" + _nWidth + "; $3$4");
						}else{ // style¸¶Àú ¾ø´Ù¸é »õ·Î ¸¸µé¾î ÁØ´Ù.
							sMatch = sMatch.replace(/(>)/g, " style=\"width:" + _nWidth + ";\"$1");
						}
					}
				}
				
				// height attribute°¡ Á¸ÀçÇÑ´Ù¸é
				if(rxHeightAttribute.test(sMatch)){
					_heightAttribute = sMatch.match(rxHeightAttribute)[3];
					
					if(/pt/.test(_heightAttribute)){
						_nHeight = parseFloat(_heightAttribute, 10) * 96 / 72 + "px"; // pt¸¦ px·Î º¯È¯
					}else if(/px/.test(_heightAttribute)){ // º¯È¯À» °ÅÄ¥ ÇÊ¿ä ¾øÀ½
						_nHeight = _heightAttribute;
					}else if(!/px/.test(_heightAttribute)){ // ¼ýÀÚ¸¸ ÀÖ´Â °æ¿ì
						_nHeight = _heightAttribute + "px";
					}
					
					sMatch = sMatch.replace(rxHeightAttribute, "");
					
					// style·Î º¯È¯ÇØ ÁÙ ÇÊ¿ä°¡ ÀÖ´Ù.
					_bStyleReplaceNeed = true;
				}else{
					_bStyleReplaceNeed = false;
				}
				
				// height styleÀÌ Á¸ÀçÇÑ´Ù¸é
				if(rxHeightStyle.test(sMatch)){
					_heightStyle = sMatch.match(rxHeightStyle)[3];
					
					if(/pt/.test(_heightStyle)){
						_nHeight = parseFloat(_heightStyle, 10) * 96 / 72 + "px"; // pt¸¦ px·Î º¯È¯
					}
					
					sMatch = sMatch.replace(rxHeightStyle, "$1$2" + _nHeight + ";");
				}else{
					if(_bStyleReplaceNeed){
						// attribute¿¡¼­ style¿ëÀ¸·Î º¯È¯ÇÑ °ªÀ» »ç¿ë
						if(!!rxStyle.test(sMatch)){
							sMatch = sMatch.replace(rxStyle, "$1$2height:" + _nHeight + "; $3$4");
						}else{ // style¸¶Àú ¾ø´Ù¸é »õ·Î ¸¸µé¾î ÁØ´Ù.
							sMatch = sMatch.replace(/(>)/g, " style=\"height:" + _nHeight + ";\"$1");
						}
					}
				}
				
				/**
				 * °¢ ÅÂ±×¿¡ ¸Â´Â Ã³¸®°¡ Ãß°¡¼öÇàµÇ´Â ºÎºÐ.
				 * 
				 * ÅÂ±×¸íÀ» È®ÀÎÇÑ µÚ ºÐ±âÃ³¸®
				 * */
				sTagName = sMatch.replace(rxTagName, "$1");
				
				if(sTagName.toUpperCase() == "TABLE"){
					// table ÅÂ±×ÀÎ °æ¿ì "__se_tbl" Å¬·¡½º¸¦ ºÎ¿©ÇØ¾ß ÇÑ´Ù.
					if(sClassAttr){
						if(!/__se_tbl/g.test(sClassAttr)){
							sMatch = sMatch.replace(rxTableClassModify, "$1$2 __se_tbl$3");
						}
					}else{ // ÅÂ±×¿¡ class attribute°¡ ÀüÇô Á¤ÀÇµÇ¾î ÀÖÁö ¾ÊÀº °æ¿ì·Î, MS ExcelÀÌ ÀÌ¿¡ ÇØ´ç
						sMatch = sMatch.replace(rxTableClassAdd, "$1 class=\"__se_tbl\"");
					}
					
					// tr, td°¡ ¾Æ´Ñ table ÅÂ±×¿¡ width, height°¡ ÁöÁ¤µÇ¾î ÀÖ´Â °æ¿ì Á¦°Å
					if(rxWidthStyle.test(sMatch)){
						sMatch = sMatch.replace(rxWidthStyle, "$1");
					}
					if(rxHeightStyle.test(sMatch)){
						sMatch = sMatch.replace(rxHeightStyle, "$1");
					}
					
					// </table> ÅÂ±×°¡ µîÀåÇÏ±â Àü±îÁö ÀÛ¾÷Àº table ¸Æ¶ô¿¡¼­ ÀÌ·ç¾îÁø´Ù.
					isInTableContext = true;
					
					// <colgroup> ÀÛ¾÷¿ë flag ÃÊ±âÈ­
					bColgroupAppeared = false;
				}
				
				/**
				 * ¸ðµç ¼¿ÀÌ µ¿ÀÏÇÑ ³Êºñ¿Í ³ôÀÌ°¡ ¾Æ´Ñ °æ¿ì,
				 * <colgroup> ÀÌÇÏ <col>¿¡ °°Àº ¿­¿¡ ÇØ´çÇÏ´Â ¼¿ÀÇ ³Êºñ°¡ Á¤ÀÇµÇ¾î ÀÖÀ¸¸ç,
				 * °°Àº Çà¿¡ ÇØ´çÇÏ´Â ¼¿ÀÇ ³ôÀÌ´Â <tr>¿¡ Á¤ÀÇµÇ¾î ÀÖ´Ù.
				 * ÀÌ¸¦ ÀúÀåÇØ µÎ°í °¢ <td>ÀÇ ³Êºñ¿Í ³ôÀÌ¿¡ Àû¿ëÇÏ´Â µ¥ »ç¿ëÇÑ´Ù.
				 * 
				 * @XXX [SMARTEDITORSUS-1613] [NON-IE]
				 * MS Excel 2010 ±âÁØÀ¸·Î, 1È¸ ÀÌ»ó º´ÇÕµÈ Ç¥°¡ »ðÀÔµÉ ¶§´Â
				 * class, width, height¸¦ Á¦¿ÜÇÑ Á¤º¸´Â °ÅÀÇ ³Ñ¾î¿ÀÁö ¾Ê´Â´Ù.
				 * */
				else if(sTagName.toUpperCase() == "COL"){
					// <col>¿¡ Æ÷ÇÔµÈ width style Á¤º¸ ÀúÀå
					_widthStyle = sMatch.match(rxWidthStyle)[3];
					
					// span °¹¼ö¸¦ ¼¼¼­ row ¼öÀÎ  nTdLength ¾÷µ¥ÀÌÆ®
					var _nSpan;
					
					if(/span[\s]*=[\s]*"([\d]+)"/.test(sMatch)){
						_nSpan = sMatch.match(/span[\s]*=[\s]*"([\d]+)"/)[1];
					}
					
					if(_nSpan){
						_nSpan = parseInt(_nSpan, 10);
						for(var i = 0; i < _nSpan; i++){
							aColumnWidth.push(_widthStyle);
							nTdLength++;
						}
					}else{
						nTdLength++;
						aColumnWidth.push(_widthStyle);
					} 
				}else if(sTagName.toUpperCase() == "TR"){
					// height °ª Àû¿ë 
					if(!(rxHeightStyle.test(sMatch))){
						// Á¸ÀçÇÏÁö ¾ÊÀ¸¸é tableCreator.jsÀÇ ±âÁØ¿¡ µû¶ó 18px Àû¿ë
						if(!!rxStyle.test(sMatch)){
							sMatch = sMatch.replace(rxStyle, "$1$2height:18px; $3$4");
						}else{ // style¸¶Àú ¾ø´Ù¸é »õ·Î ¸¸µé¾î ÁØ´Ù.
							sMatch = sMatch.replace(/(>)/g, " style=\"height:18px;\"$1");
						}
						
						nRowHeight = null;
					}else{ // Á¸ÀçÇÏ¸é td¿¡ Àû¿ëÇÏ±â À§ÇØ ÀúÀå
						_heightStyle = sMatch.match(rxHeightStyle)[3];
						
						nRowHeight = _heightStyle;
					}
				}else if(sTagName.toUpperCase() == "TD"){
					/**
					 * [Chrome] ÀúÀåÇØ µÐ style Á¤ÀÇ·ÎºÎÅÍ, 
					 * class ¸íÀ¸·Î Àû¿ëÇØ¾ß ÇÒ styleÀÌ ÀÖ´Â °æ¿ì Ãß°¡ÇØ ÁØ´Ù.
					 * 
					 * MS Excel 2010¿¡ ÇÊ¿ä.
					 * */
					if(this.htBrowser.chrome){
						var aClass;
						if(sClassAttr && !/mso/i.test(sClassAttr)){
							// MsoTableGrid Å¬·¡½º°¡ Æ÷ÇÔµÈ °æ¿ì(MS Word)´Â Á¦¿Ü : style Á¤ÀÇ¸¦ ºÒ·¯¿Í¼­ Àû¿ëÇÏ¸é ¿ÀÈ÷·Á ·¹ÀÌ¾Æ¿ô ºñÁ¤»ó
							
							aClass = sClassAttr.split(" ");
						}
						
						if(aClass && aClass.length > 0){
							for(var i = 0, len = aClass.length; i < len; i++){
								var sClass = aClass[i];
								var sRx = sClass + "[\n\r\t\s]*{([^}]*)}";
								var rxClassForStyle = new RegExp(sRx);
								
								var sMatchedStyle;
								if(rxClassForStyle.test(this._sStyleFromClipboard)){
									sMatchedStyle = this._sStyleFromClipboard.match(rxClassForStyle)[1];
								}
								
								if(sMatchedStyle){
									// À§¿¡¼­ ¸ÅÄ¡µÇ´Â styleÀ» ÅÂ±× ¾È¿¡ Ãß°¡ÇØ ÁØ´Ù.
									if(!!rxStyle.test(sMatch)){
										sMatch = sMatch.replace(rxStyle, "$1$2" + sMatchedStyle + " $3$4");
									}else{ // style¸¶Àú ¾ø´Ù¸é »õ·Î ¸¸µé¾î ÁØ´Ù.
										sMatch = sMatch.replace(/(>)/g, " style=\"" + sMatchedStyle + "\"$1");
									}
								}
							}
						}
					}
					
					/**
					 * border Ã³¸®
					 * 
					 * MS Excel 2010 ±âÁØÀ¸·Î,
					 * 0.5pt µÎ²²·Î ³Ñ¾î¿Â border´Â 100% ¹èÀ²¿¡¼­ Ç¥ÇöµÇÁö ¾Ê±â¿¡
					 * ÀÏ°ý 1px·Î º¯È¯ÇÑ´Ù.
					 * 
					 * Åë»ó 0.84px ÀÌ»óÀÌ¸é 100% ¹èÀ²¿¡¼­ Ç¥ÇöµÈ´Ù.
					 * */
					 //var rxBorder = /(border)(-[^:]+)?([\s]*:[\s]*)([^;"']*)([;]?)/gi; // border ¼Ó¼º
					 var rxBorderWidth_pointFive_first = /(:[\s]*)(.5pt|0.5pt)/gi;
					 var rxBorderWidth_pointFive_rest = /([^:\d])(.5pt|0.5pt)/gi;
					sMatch = sMatch.replace(rxBorderWidth_pointFive_first, "$11px").replace(rxBorderWidth_pointFive_rest, "$11px");
					
					// °øÅë Ã³¸® ºÎºÐ¿¡¼­ ½ºÅ¸ÀÏ Ä¡È¯ ·ÎÁ÷À» °ÅÃÆ´Ù¸é, ½ºÅ¸ÀÏÀÌ Àû¿ëµÇ¾î ÀÖ¾î¾ß ÇÔ
					if(!(rxWidthStyle.test(sMatch))){
						// ½ºÅ¸ÀÏ °ªÀÌ ¾øÀ» ¶§, colgroup¿¡¼­ ÀúÀåÇÑ °ªÀÌ ÀÖÀ¸¸é ÀÌ¸¦ Àû¿ëÇÔ
						if(aColumnWidth.length > 0){ // ÀúÀåÇÑ °ª ÀÖÀ½
							if(!!rxStyle.test(sMatch)){
								sMatch = sMatch.replace(rxStyle, "$1$2width:" + aColumnWidth[nTdIndex] + "; $3$4");
							}else{ // style¸¶Àú ¾ø´Ù¸é »õ·Î ¸¸µé¾î ÁØ´Ù.
								sMatch = sMatch.replace(/([^\s])([\s]*>|>)/, "$1 style=\"width:" + aColumnWidth[nTdIndex] + ";\"$2");
							}
						}
					}
					
					if(!(rxHeightStyle.test(sMatch))){
						// ½ºÅ¸ÀÏ °ªÀÌ ¾øÀ» ¶§, td¿¡¼­ ÀúÀåÇÑ °ªÀÌ ÀÖÀ¸¸é ÀÌ¸¦ Àû¿ëÇÔ
						if(!nRowHeight){ // ÀúÀåÇÑ °ª ¾øÀ» ¶§´Â 18px °­Á¦ÇÒ´ç
							nRowHeight = "18px";
						}
						
						if(!!rxStyle.test(sMatch)){
							sMatch = sMatch.replace(rxStyle, "$1$2height:" + nRowHeight + "; $3$4");
						}else{ // style¸¶Àú ¾ø´Ù¸é »õ·Î ¸¸µé¾î ÁØ´Ù.
							sMatch = sMatch.replace(/([^\s])([\s]*>|>)/g, "$1 style=\"height:" + nRowHeight + ";\"$2");
						}
					}
					
					// Àû¿ëÇÒ ¶§¸¶´Ù nTdIndex Áõ°¡
					nTdIndex++;
				}else if(sTagName.toUpperCase() == "COLGROUP"){
					// <colgroup> ÀÛ¾÷¿ë flag ¾÷µ¥ÀÌÆ®
					bColgroupAppeared = true;
				}else if(sTagName.toUpperCase() == "TBODY"){
					// [IE 8~11] MS Excel, MS PowerPoint¿¡¼­ ¿­¸° Ã¤ »ðÀÔµÇ´Â <colgroup> Ã³¸®¸¦ À§ÇØ, ºÎµæÀÌÇÏ°Ô ¼öµ¿À¸·Î </colgroup> Ãß°¡
					if(bColgroupAppeared){
						sResult = "</colgroup>";
					}
				}
				
				// ¹®´Ü ±³Ã¼°¡ ¹ß»ýÇÏ´ÂÁö¸¦ ±â·ÏÇÏ´Â flag
				for(var i = 0, len = aMultiParagraphIndicator.length; i < len; i++){
					if(sTagName.toUpperCase() == aMultiParagraphIndicator[i]){ // p, div, table, iframe
						this._isPastedMultiParagraph = true; // ºÙ¿©³Ö¾îÁø ÄÁÅÙÃ÷°¡ ¿©·¯ ¹®´ÜÀ¸·Î ±¸¼ºµÇ¾î ÀÖ´ÂÁö È®ÀÎ
						bParagraphChangeStart = true; // »õ·Î¿î ¹®´ÜÀÌ ¿­·ÈÀ½À» Ç¥½Ã
						
						break;
					}
				}
				
				sResult += sMatch;
				
				rxApplied = rxOpeningTag;
			}else if(rxWhiteSpace.test(sOriginalContent)){ // °ø¹é¹®ÀÚ´Â ÀÏ´Ü ±×´ë·Î Åë°ú½ÃÅ´. Â÷ÈÄ Ã³¸® ¹æ¾ÈÀÌ ÀÖÀ»Áö ³íÀÇ ÇÊ¿ä
				sMatch = sOriginalContent.match(rxWhiteSpace)[0];
				
				sResult = sMatch;
				
				rxApplied = rxWhiteSpace;
			}else if(rxNonTag.test(sOriginalContent)){ // ÅÂ±× ¾Æ´Ô
				sMatch = sOriginalContent.match(rxNonTag)[0];

				sResult = sMatch;
				
				rxApplied = rxNonTag;
			}else if(rxCommentTag.test(sOriginalContent)){ // <!-- text -->
				sMatch = sOriginalContent.match(rxCommentTag)[0];
				
				sResult = sMatch;
				
				rxApplied = rxCommentTag;
			}else if(rxClosingTag.test(sOriginalContent)){ // </tagName>
				sMatch = sOriginalContent.match(rxClosingTag)[0];
				
				var sPreviousContent = aResult[nCurrentIndex -1]; // Á÷Àü¿¡ °á°ú ¹è¿­¿¡ »ðÀÔµÈ ÄÁÅÙÃ÷
				var bShouldBeEmpty = false;
				
				// <td> ³»¿¡ ¾Æ¹«·± ÄÁÅÙÃ÷µµ ¾ø´Ù¸é Ä¿¼­°¡ ´êÀ» ¼ö ¾ø±â ¶§¹®¿¡ Ã³¸®ÇØ ÁÖ´Â ºÎºÐ
				if(rxOpeningTag.test(sPreviousContent)){
					if(isInTableContext){
						if(!(/husky_bookmark/g.test(sPreviousContent))){
							// ÀÌ ½ÃÁ¡¿¡¼­ ¹Ù·Î Àü ÅÂ±×°¡ ¿­¸° ÅÂ±×¿´´Ù¸é, &nbsp;¸¦ ³Ö¾îÁà¾ß Ä¿¼­ À§Ä¡ °¡´É
							sResult = "&nbsp";
						}
					}
				}
				
				if(bShouldBeEmpty){
					sMatch = "";
				}
				
				// ÅÂ±×º° ºÐ±âÃ³¸®
				sTagName = sMatch.replace(rxTagName, "$1");

				/**
				 * ¸ðµç ¼¿ÀÌ µ¿ÀÏÇÑ ³Êºñ¿Í ³ôÀÌ°¡ ¾Æ´Ñ °æ¿ì,
				 * °¢ <td>ÀÇ ³Êºñ¿Í ³ôÀÌ¿¡ Àû¿ëÇÏ´Â µ¥ »ç¿ëÇß´ø
				 * ÀúÀå°ªµéÀ» ÃÊ±âÈ­ÇÑ´Ù.
				 * */
				if(sTagName.toUpperCase() == "TABLE"){
					aColumnWidth = [];
					isInTableContext = false;
					nTdLength = 0;
					nTdIndex = 0;
				}else if(sTagName.toUpperCase() == "TR"){
					nTdIndex = 0;
				}
				
				for(var i = 0, len = aMultiParagraphIndicator.length; i < len; i++){
					if(sTagName.toUpperCase() == aMultiParagraphIndicator[i]){ // p, div, table, iframe
						bParagraphChangeEnd = true; // »õ·Î¿î ¹®´ÜÀÌ ¸· ´ÝÇûÀ½À» Ç¥½Ã
						
						break;
					}
				}
				
				// ºó <td>¿´´Ù¸é &npsp;°¡ Ãß°¡µÇ¾î ÀÖ±â ¶§¹®¿¡ ¿¬»êÀÚ°¡ ´Ù¸¥ °æ¿ì¿Í´Â ´Ù¸§
				sResult += sMatch;
				
				rxApplied = rxClosingTag; 
			}
			// Áö±Ý±îÁöÀÇ Á¶°Ç¿¡ ºÎÇÕÇÏÁö ¾Ê´Â ¸ðµç ÅÂ±×´Â ¿¹¿Ü ÅÂ±×·Î Ã³¸®ÇÑ´Ù. MS WordÀÇ <o:p> µîÀÌ ÇØ´ç.
			else if(rxExceptedClosingTag.test(sOriginalContent)){ // </*unknown*> : similar to rxClosingCommentTag case
				sMatch = sOriginalContent.match(rxExceptedClosingTag)[0];
				
				sResult = sMatch;
				
				rxApplied = rxExceptedClosingTag; 
			}else if(rxExceptedOpeningTag.test(sOriginalContent)){ // <*unknown*> : similar to rxOpeningCommentTag case
				sMatch = sOriginalContent.match(rxExceptedOpeningTag)[0];
				
				sResult = sMatch;
				
				rxApplied = rxExceptedOpeningTag;
			}else{ // unreachable point
				throw new Error("Unknown Node : If the content isn't invalid, please let us know.");
			}
			
			// sResult·Î ÀÛ¾÷
			
			// Á÷Àü °ª ºñ±³¿¡ »ç¿ëÇÏ±â À§ÇØ Á¤º¸ °»½Å
			if(sResult != ""){
				sPreviousContent = sResult; // ÇöÀç sResult´Â, ´ÙÀ½ ÀÛ¾÷ ¶§ Á÷Àü °ªÀ» ÂüÁ¶ÇØ¾ß ÇÒ ÇÊ¿ä°¡ ÀÖ´Â °æ¿ì »ç¿ëµÈ´Ù.   
				nCurrentIndex++;
				
				// ¿øº» StringÀÇ ¸Ç ¾ÕºÎÅÍ Ã¹ ¹®´Ü ±³Ã¼°¡ ÀÏ¾î³ª±â±îÁöÀÇ ¸ðµç inline ¿ä¼ÒµéÀ» ÀúÀåÇØ µÎ°í È°¿ë
				var sGoesPreviousParagraph;
				if(!this._isPastedMultiParagraph){ 
					sGoesPreviousParagraph = sResult;
				}
				
				if(!bParagraphChangeStart){ // ¹®¸Æ ±³Ã¼°¡ ¾ÆÁ÷ ½ÃÀÛµÇÁö ¾Ê¾ÒÀ½
					// text_content -> <p>text_content
					if(!bParagraphIsOpen){
						if(nParagraphHierarchy == 0){ // ÃÖ»óÀ§ depth
							sResult = "<" + this.sParagraphContainer + ">" + sResult;
							bParagraphIsOpen = true;
						}
					}
				}else{ // ¹®¸Æ ±³Ã¼°¡ ½ÃÀÛµÊ
					// <p>text_content + <table> -> <p>text_content + </p> <table>
					if(bParagraphIsOpen){ // ¹®¸ÆÀÌ ¿­¸²
						sResult = "</" + this.sParagraphContainer + ">" + sResult;
						bParagraphIsOpen = false;
					}
					
					nParagraphChangeCount++;
					nParagraphHierarchy++;
				}
				
				// ¹®¸Æ ±³Ã¼°¡ ³¡³µ´Ù¸é ¹®´Ü ±³Ã¼ flag ÃÊ±âÈ­
				if(bParagraphChangeEnd){
					bParagraphChangeStart = false;
					bParagraphChangeEnd = false;
					
					nParagraphHierarchy--;
				}
				
				if(!this._isPastedMultiParagraph){
					this._aGoesPreviousParagraph.push(sGoesPreviousParagraph);
				}
				
				// ÃÖÁ¾ÀûÀ¸·Î ¹ÝÈ¯µÇ´Â Á¤Ã¼µÈ ÄÁÅÙÃ÷µéÀÌ ´ã±ä ¹è¿­
				aResult.push(sResult);
			}
			
			// Á¤Á¦°¡ ³¡³­ ÄÁÅÙÃ÷´Â ¿ø·¡ ÄÁÅÙÃ÷¿¡¼­ Á¦°Å
			sOriginalContent = sOriginalContent.replace(rxApplied, "");
		};
		// --while
		
		// ÃÖÁ¾ °á°ú ÇÑ ¹øµµ ¹®´Ü ±³Ã¼°¡ ¾ø¾ú´Ù¸é ¾Õ¿¡ ´Þ¸° ¹®¸Æ ±³Ã¼ ÅÂ±×¸¦ Á¦°ÅÇÏ°í, inlineÀ¸·Î »ðÀÔ ÁØºñ
		if(nParagraphChangeCount == 0){
			var rxParagraphContainer = new RegExp("^<" + this.sParagraphContainer + ">");
			
			aResult[0] = aResult[0].replace(rxParagraphContainer, "");
		}
		
		return aResult.join("");
	},
	
	/**
	 * ºÙ¿©³Ö±âµÈ ¿ÜºÎ ÇÁ·Î±×·¥ ÄÁÅÙÃ÷¸¦ ¿ø¹®¿¡ »ðÀÔµÉ À§Ä¡·Î ºÙ¿©³Ö´Â´Ù.
	 * */
	_loadPastedContents : function(){
		if(!this._isPastedMultiParagraph){ // ºÙ¿©³Ö¾îÁö´Â ÄÁÅÙÃ÷°¡ ÇÑ ´Ü¶ô ³»¿¡ µé¾î°¥ ¼ö ÀÖ´Â inline ¿ä¼Ò¸¸À¸·Î ±¸¼º 
			// this._saveOriginalContents()¿¡¼­ Ãß°¡µÈ ºÏ¸¶Å© Á¦°Å
			var oSelection = this.oApp.getSelection();
			oSelection.moveToStringBookmark(this._sBM);
			oSelection.select();
			oSelection.collapseToEnd();
			oSelection.removeStringBookmark(this._sBM);
			
			this.oApp.exec("PASTE_HTML", [this._sTarget]);
			
			return;
		}else{
			// this._aTarget ±¸¼º À§Ä¡¸¦ ÀÌ°÷À¸·Î ¹Ì·ë. »ç½Ç ÀÌ °÷À¸·Î fixÇÏ¸é this._aTargetµµ Áö¿ªº¯¼öÈ­ °¡´É
			// º»¹®¿¡ ºÙ¿©³ÖÀ» ¶§´Â Node ÇüÅÂ·Î º¯È¯
			var elTmp = document.createElement("DIV");
			elTmp.innerHTML = this._sTarget;
			this._aTarget = elTmp.childNodes;
		}

		// bookmark ±âÁØÀÇ Á¶ÀÛÀÌ ÁÖ¸¦ ÀÌ·é´Ù.
		var oSelection = this.oApp.getSelection(), // ÀÌ°Íµµ this·Î ¼±¾ðÇØ¾ß ÇÒ±î
		elStartBookmark = oSelection.getStringBookmark(this._sBM),
		elEndBookmark = oSelection.getStringBookmark(this._sBM, true);
		
		var elParent = elStartBookmark.parentNode,
		elPreviousParent = elParent.previousSibling, 
		elGrandParent = elParent.parentNode,
		aChildren,
		bParentIsBody = false;
		
		var elNextSibling = elEndBookmark.nextSibling;
		var rxParagraphParent = /^BODY|TD|DIV/i;
		
		/**
		 * ºÏ¸¶Å©¸¦ ±âÁØÀ¸·Î ºÎ¸ð°¡ p, div ÅÂ±×¸¦ ÀÚ½ÄÀ¸·Î ÃëÇÏ´Â ÅÂ±×¶ó¸é
		 * ¾ÆÁ÷ ºÏ¸¶Å©°¡ ¹®´Ü ÅÂ±×·Î °¨½ÎÁ® ÀÖÁö ¾Ê´Ù´Â ÀÇ¹ÌÀÌ°í,
		 * µû¶ó¼­ ¹®´ÜÀ¸·Î ºÏ¸¶Å©°¡ ¼ÓÇÑ ºÎºÐÀ» °¨½Î°í ½ÃÀÛÇÑ´Ù. 
		 * */
		if(!nhn.husky.SE2M_Utils.findAncestorByTagName(this.sParagraphContainer, elStartBookmark)){
			var _elTmpParagraphContainer = document.createElement(this.sParagraphContainer);
			
			aChildren = this.elBody.childNodes;
			for(var i = 0, len = aChildren.length; i < len; i++){
				_elTmpParagraphContainer.appendChild(aChildren[0]);
			}
			
			this.elBody.appendChild(_elTmpParagraphContainer);
			
			// elParent °»½Å. °æ¿ì¿¡ µû¶ó ºÏ¸¶Å©ÀÇ ºÎ¸ð°¡ ¾Æ´Ï¶ó <body>°¡ ÀâÇô ÀÖ´Â °æ¿ìµµ ÀÖ´Ù.
			elParent = elStartBookmark.parentNode;
		}

		// ºÙ¿©³Ö¾îÁø ³»¿ë Áß inline ¿ä¼Ò°¡ Ã³À½À¸·Î ³ª¿Â °æ¿ì, ÇöÀç ºÏ¸¶Å© ¾Õ¿¡ ¼øÂ÷ÀûÀ¸·Î »ðÀÔ
		if(this._aGoesPreviousParagraph.length > 0){
			var sGoesPreviousParagraph = this._aGoesPreviousParagraph.join("");
			var elTmp = document.createElement("DIV");
			elTmp.innerHTML = sGoesPreviousParagraph;
			
			var _aGoesPreviousParagraph = elTmp.childNodes;
			
			// ÇöÀç ºÏ¸¶Å© ¾ÕÀ¸·Î »ðÀÔ
			for(var i = 0, len = _aGoesPreviousParagraph.length; i < len; i++){
				elParent.insertBefore(_aGoesPreviousParagraph[0], elStartBookmark);
			}

			/**
			 * inline ¿ä¼ÒµéÀº this._aTarget[0]¿¡ ¹®´Ü ÅÂ±×·Î °¨½ÎÁ® µé¾î ÀÖ¾ú´Ù.
			 * ÀÌ¸¦ ¾ÕÀ¸·Î º»¹®¿¡ »ðÀÔµÉ ¿ä¼ÒµéÀÎ this._aTarget¿¡¼­ Á¦°ÅÇØ¾ß ÇÔ
			 * */
			elTmp.appendChild(this._aTarget[0]);
			// this._aTarget[0]¿¡´Â °³Çà¸¸ ³²°ÜÁø ÅØ½ºÆ® ³ëµå°¡ ³²°Ô µÈ´Ù. 
		}
		// -- inline »ðÀÔÀÛ¾÷ ¿Ï·á
		
		/**
		 * ¹®´Ü Áß°£¿¡ ºÏ¸¶Å©°¡ ÀÖ°í, 
		 * ÀÌ »çÀÌ¿¡ ¹®´ÜÀÌ »ðÀÔµÈ´Ù¸é,
		 * ±âÁ¸ ºÏ¸¶Å© ÀüÈÄÀÇ ÄÁÅÙÃ÷´Â µÎ °³ÀÇ ¹®´ÜÀ¸·Î ºÐ¸®µÇ¾î¾ß ÇÑ´Ù.
		 *
		 * ºÏ¸¶Å© µÚÀÇ inline ¿ä¼Ò¸¦ ºÐ¸®ÇÏ´Â µ¥ ±âÁ¸ ¹®´ÜÀÇ cloneÀ» »ç¿ëÇÑ´Ù.
		 * 
		 * ex)
		 * -»ðÀÔ Àü
		 * <p style="text-align:center;">
		 * 		inline1<HuskyBookmark/>inline2
		 * </p>
		 * 
		 * -»ðÀÔ ÈÄ
		 * <p style="text-align:center;">
		 * 		inline1
		 * </p>
		 * ºÙ¿©³Ö¾îÁø ¹®´Üµé
		 * <p style="text-align:center;"> (clone)
		 * 		<HuskyBookmark/>inline2
		 * </p>
		 * */
		
		// ÇöÀç ºÏ¸¶Å© ÀÌÀü ÇüÁ¦¸¦ °íÁ¤ÇØ µÐ´Ù.
		var elPreviousSibling = elStartBookmark.previousSibling;
		
		var elTarget = elStartBookmark; // this._markContainer()¿¡¼­ ±âÁØÁ¡À¸·Î »ç¿ëÇÏ¸ç, ÃÊ±â°ªÀº ½ÃÀÛ ºÏ¸¶Å©
		
		var elContainer; // cloneNodeÀÇ ´ë»óÀÎ ¹®´Ü
		var elContainerParent; // elContainerÀÇ ºÎ¸ð
		var elContainerClone; // ´ë»ó ¹®´ÜÀÇ clone
		var elContainerNextSibling; // elContainerÀÇ nextSibling. elContainer°¡ ¸¶Áö¸· ÀÚ½ÄÀÏ °æ¿ì ¾øÀ» ¼öµµ ÀÖ´Ù.
		
		/**
		 * cloneNodeÀÇ ´ë»óÀÌ µÇ´Â ¹®´ÜÀÎ elContainer¿Í ±× ºÎ¸ð¸¦ Ã¼Å©ÇØ µÐ´Ù. 
		 * ºÎ¸ð¸¦ ±âÁØÀ¸·Î cloneÀ» »ðÀÔÇÏ±â À§ÇÑ ÁØºñ´Ü°è·Î,
		 * ´ë»ó ¹®´ÜÀ» Ã£À» ¶§±îÁö ¹Ýº¹µÈ´Ù.
		 * */
		this._markContainer = jindo.$Fn(function(){
			var _sTargetNodeName = elTarget.nodeName;
			var _elParent = elTarget.parentNode;
			var _sParentNodeName = _elParent.nodeName;
			var _bContainerIsParagraph = false;
			var _bFinish = false;
			var _bNeedToRetry = false; // ¹Ýº¹ ¿©ºÎ
			
			if(_sTargetNodeName && _sTargetNodeName.toUpperCase() == this.sParagraphContainer){ // ÃÖÃÊ ¼³Á¤¿¡ µû¶ó P ¶Ç´Â DIV
				_bContainerIsParagraph = true;
			}
			
			if(rxParagraphParent.test(_sParentNodeName)){  // ºÎ¸ð°¡ BODY, TD, DIVÀÏ ¶§ Á¾·á
				_bFinish = true;
			}
			
			if(!_bContainerIsParagraph){
				_bNeedToRetry = true;
			}else{
				if(_bFinish){ // ¿©±â¼­ elContainer°¡ P ÅÂ±×°¡ ¾Æ´Ò ¼öµµ ÀÖ´Ù. ±× °æ¿ì ¹«ÇÑ·çÇÁ °¡´É¼ºµµ ÀÖÀ½.
					elContainer = elTarget;
					elContainerParent = _elParent;
					elContainerNextSibling = elTarget.nextSibling;
				}else{
					_bNeedToRetry = true;
				}
			}
			
			// elTargetÀ» ÇöÀç Å½»ö ´ë»óÀÇ ºÎ¸ð·Î ¼³Á¤ÇÑ µÚ ÀçÅ½»ö
			if(_bNeedToRetry){
				elTarget = _elParent;
				this._markContainer();
			}
		}, this).bind();
		
		this._markContainer();
		
		var rxBookmarkId = /(husky_bookmark_(start|end)_)([\d]+)/g;
		var TEMP_BOOKMARK_ID = "temp";
		var elTmpStartBookmark, elTmpParent;
		
		// clone ÀÛ¾÷Àº ÇÑ ¹ø¸¸ ÇØ ÁÖ¸é µÈ´Ù.
		/**
		 * ±âÁ¸ ´Ü¶ô ºÐ¸®¿¡ »ç¿ëµÇ´Â clone »ý¼º
		 * */
		elContainerClone = elContainer.cloneNode(true);
		
		/**
		 * ÀÛ¾÷´ë»ó : clone ¹®´Ü
		 * 
		 * clone¿¡´Â ¿øº» ¹®´ÜÀÇ ºÏ¸¶Å©µµ Æ÷ÇÔµÇ¾î ÀÖ´Ù.
		 * innerHTML·Î bookmarkÀÇ id¸¦ º¯°æÇÏ¿© ÀÓ½Ã ºÏ¸¶Å©·Î ¸¸µé¾î µÐ´Ù.
		 * 
		 * ±× µÚ, oSelectionÀ¸·Î Á¶ÀÛÇÏ±â À§ÇØ ¿ì¼± ÀÓ½Ã·Î elContainerParent¿¡ cloneÀ» »ðÀÔÇØ µÐ´Ù.
		 * */
		var sContainerCloneHTML = elContainerClone.innerHTML;
		
		sContainerCloneHTML = sContainerCloneHTML.replace(rxBookmarkId, "$1" + TEMP_BOOKMARK_ID);
		elContainerClone.innerHTML = sContainerCloneHTML;
		
		elContainerParent.appendChild(elContainerClone);
		
		// ÀÓ½Ã ºÏ¸¶Å© Å½»ö
		var elTmpStartBookmark = oSelection.getStringBookmark(TEMP_BOOKMARK_ID); 
		
		// ÀÓ½Ã ºÏ¸¶Å©ÀÇ ºÎ¸ð¸¦ Àâ°í
		var elTmpParent = elTmpStartBookmark.parentNode;
		
		// ±× ÀÚ½Ä Áß ÀÓ½Ã ºÏ¸¶Å© ÀÌÀü ¿ä¼Ò ¸ðµÎ Á¦°Å
		oSelection.moveToStringBookmark(TEMP_BOOKMARK_ID);
		oSelection.setStart(elContainerClone, 0);
		oSelection.setEndBefore(elTmpStartBookmark);
		oSelection.select();
		oSelection.deleteContents();

		/**
		 * ÀÛ¾÷´ë»ó : ¿øº» ¹®´Ü
		 * 
		 * ¿øº» ¹®´Ü¿¡¼­´Â ºÏ¸¶Å© µÚ ¿ä¼Ò¸¦ ¸ðµÎ Á¦°ÅÇÑ´Ù.
		 * */
		oSelection.moveToStringBookmark(this._sBM);
		oSelection.setStartAfter(elEndBookmark);
		oSelection.setEndAfter(elContainer.lastChild);
		oSelection.select();
		oSelection.deleteContents();
		
		/**
		 * ÀÛ¾÷´ë»ó : clone ¹®´Ü
		 * 
		 * ¿ø·¡ ºÏ¸¶Å©´Â ÀÌÁ¦ ÀÓ½Ã ºÏ¸¶Å© À§Ä¡·Î ¿Í¼­ Ä¿¼­¸¦ Àâ¾ÆÁà¾ß ÇÑ´Ù.
		 * ¿ø·¡ ºÏ¸¶Å©ÀÇ ÀÌµ¿ÀÌ ³¡³ª¸é ÀÓ½Ã ºÏ¸¶Å©´Â Á¦°ÅÇÑ´Ù.
		 * */
		// ÀÓ½Ã ºÏ¸¶Å© ¾Õ¿¡ ¿ø·¡ ºÏ¸¶Å©¸¦ »ðÀÔÇÏ¿© Ä¿¼­ Ç¥½Ã¸¦ ÁØºñÇÑ´Ù.
		elTmpParent.insertBefore(elEndBookmark, elTmpStartBookmark);
		elTmpParent.insertBefore(elStartBookmark, elEndBookmark);
		
		// ÀÓ½Ã ºÏ¸¶Å© Á¦°Å
		oSelection.removeStringBookmark(TEMP_BOOKMARK_ID);
		
		// insertAfter : elContainerNextSibling ¾Õ¿¡ elContainerCloneÀ» »ðÀÔ.
		var bInsertBefore = false;		
		if(elContainerNextSibling){
			bInsertBefore = true;
		}
		
		/**
		 * ¿øº» ¹®´Ü µÚ·Î Á¤Á¦µÈ ÄÁÅÙÃ÷¸¦ »ðÀÔÇÑ µÚ, clone ¹®´ÜÀ» ±× µÚ¿¡ ºÙ¿©³Ö´Â´Ù. 
		 * */
		if(bInsertBefore){
			// Á¤Á¦µÈ ÄÁÅÙÃ÷ ºÙ¿©³Ö±â
			for(var i = 0, len = this._aTarget.length; i < len; i++){
				var _elTarget = this._aTarget[0];
				
				elContainerParent.insertBefore(_elTarget, elContainerNextSibling); 
			}
			// clone ºÙ¿©³Ö±â
			elContainerParent.insertBefore(elContainerClone, elContainerNextSibling);
		}else{
			// Á¤Á¦µÈ ÄÁÅÙÃ÷ ºÙ¿©³Ö±â
			for(var i = 0, len = this._aTarget.length; i < len; i++){
				var _elTarget = this._aTarget[0];
				
				elContainerParent.appendChild(_elTarget); 
			}
			// clone ºÙ¿©³Ö±â
			elContainerParent.appendChild(elContainerClone);
		}
		
		// innerHTML·Î &nbsp;³ª ºó °ªÀ» °¡Áö°í ÀÖ´Â <font>¸¦ Á¦°ÅÇÏÁö ¾ÊÀ¸¸é º»¹®¿¡¼­ °ø°£À» Â÷ÁöÇÏ°í ÀÖ´Â ¹®Á¦°¡ ÀÖ´Ù.
		findAndRemoveMeaninglessTag("font", this.elBody, hasMeaningfulElementInTag);
		
		// ÁöÁ¤µÈ ¿¤¸®¸ÕÆ® ³»¿¡¼­ ÅÂ±×¸íÀ¸·Î µÈ ¿¤¸®¸ÕÆ®¸¦ Ã£°í, ±âÁØ¿¡ ºÎÇÕÇÏÁö ¾ÊÀ¸¸é Á¦°ÅÇÑ´Ù.
		function findAndRemoveMeaninglessTag(sTargetTagName, htmlElement, filter){
			var aElement = jindo.$$(sTargetTagName, htmlElement, {oneTimeOffCache : true});
			var rxMeaninglessParentContext = /^BODY|TABLE|TBODY|TD|TR/i;
			
			// Å¸°ÙÀ¸·Î ÁöÁ¤ÇÑ htmlElement¿Í ºÎ¸ð °ËÁõ ÈÄ, Á¶°Ç¿¡ ºÎÇÕÇÏ¸é Á¦°Å
			if(aElement.length > 0){
				for(var i = 0, len = aElement.length; i < len; i++){
					var _el = aElement[i];
					var _elParent = _el.parentNode;
					
					if(_elParent && rxMeaninglessParentContext.test(_elParent.nodeName)){
						if(!filter(_el)){
						_elParent.removeChild(_el);
						}
					}
				}
			}
		}
		
		/**
		 * ´ë»ó ¿¤¸®¸ÕÆ®°¡ nodeType == 1ÀÌ°í Ç¥½Ã¿¡ À¯¿ëÇÑ Element¸¦ ÀÚ½ÄÀ¸·Î °¡Áö°í ÀÖ´ÂÁö È®ÀÎ.
		 * innerHTMLÀÌ &nbsp; ÀÌ°Å³ª "" ÀÌ¸é Á¦°Å ´ë»óÀÌ´Ù.
		 * */
		function hasMeaningfulElementInTag(el){
			var sHtml = el.innerHTML;
			
			if(el.nodeType == 1 && (sHtml != "&nbsp;" && sHtml != "")){
				return true;
			}else{
				return false;
			}
		}
		
		// this._saveOriginalContents()¿¡¼­ Ãß°¡µÈ ºÏ¸¶Å© Á¦°Å
		var oSelection = this.oApp.getSelection();
		oSelection.moveToStringBookmark(this._sBM);
		oSelection.select();
		oSelection.collapseToEnd();
		oSelection.removeStringBookmark(this._sBM);
	}
});
//}
/**
 * @pluginDesc EnterÅ° ÀÔ·Â½Ã¿¡ ÇöÀç ÁÙÀ» P ÅÂ±×·Î °¨°Å³ª <br> ÅÂ±×¸¦ »ðÀÔÇÑ´Ù.
 */
nhn.husky.SE_WYSIWYGEnterKey = jindo.$Class({
	name : "SE_WYSIWYGEnterKey",

	$init : function(sLineBreaker){
		if(sLineBreaker == "BR"){
			this.sLineBreaker = "BR";
		}else{
			this.sLineBreaker = "P";
		}
		
		this.htBrowser = jindo.$Agent().navigator();
		
		// [SMARTEDITORSUS-227] IE ÀÎ °æ¿ì¿¡µµ ¿¡µðÅÍ Enter Ã³¸® ·ÎÁ÷À» »ç¿ëÇÏµµ·Ï ¼öÁ¤
		if(this.htBrowser.opera && this.sLineBreaker == "P"){
			this.$ON_MSG_APP_READY = function(){};
		}

		/**
		 *	[SMARTEDITORSUS-230] ¹ØÁÙ+»ö»óº¯°æ ÈÄ, ¿£ÅÍÄ¡¸é ½ºÅ©¸³Æ® ¿À·ù
		 *	[SMARTEDITORSUS-180] [IE9] ¹è°æ»ö Àû¿ë ÈÄ, ¿£ÅÍÅ° 2È¸ÀÌ»ó ÀÔ·Â½Ã Ä¿¼­À§Ä¡°¡ ´ÙÀ½ ¶óÀÎÀ¸·Î ÀÌµ¿ÇÏÁö ¾ÊÀ½
		 * 		¿À·ù Çö»ó : 	IE9 ¿¡¼­ ¿£ÅÍ ÈÄ »ý¼ºµÈ P ÅÂ±×°¡ "ºó SPAN ÅÂ±×¸¸ °¡Áö´Â °æ¿ì" P ÅÂ±× ¿µ¿ªÀÌ º¸ÀÌÁö ¾Ê°Å³ª Æ÷Ä¿½º°¡ À§·Î ¿Ã¶ó°¡ º¸ÀÓ
		 *		ÇØ°á ¹æ¹ý : 	Ä¿¼­ È¦´õ·Î IE ÀÌ¿Ü¿¡¼­´Â <br> À» »ç¿ë
		 *						- IE ¿¡¼­´Â ·»´õ¸µ ½Ã <br> ºÎºÐ¿¡¼­ ºñÁ¤»óÀûÀÎ P ÅÂ±×°¡ »ý¼ºµÇ¾î [SMARTEDITORSUS-230] ¿À·ù ¹ß»ý
		 *						unescape("%uFEFF") (BOM) À» Ãß°¡
		 *						- IE9 Ç¥ÁØ¸ðµå¿¡¼­ [SMARTEDITORSUS-180] ÀÇ ¹®Á¦°¡ ¹ß»ýÇÔ
		 *						(unescape("%u2028") (Line separator) ¸¦ »ç¿ëÇÏ¸é P °¡ º¸¿©Áö³ª »çÀÌµåÀÌÆåÆ®°¡ ¿ì·ÁµÇ¾î »ç¿ëÇÏÁö ¾ÊÀ½)
		 *	IE ºê¶ó¿ìÀú¿¡¼­ Enter Ã³¸® ½Ã, &nbsp; ¸¦ ³Ö¾îÁÖ¹Ç·Î ÇØ´ç ¹æ½ÄÀ» ±×´ë·Î »ç¿ëÇÏµµ·Ï ¼öÁ¤ÇÔ
		 */
		if(this.htBrowser.ie){
			this._addCursorHolder = this._addCursorHolderSpace;
			
			if(this.htBrowser.nativeVersion < 9 || document.documentMode < 9){
				this._addExtraCursorHolder = function(){};
				this._addBlankTextAllSpan = function(){};
			}
		}else{
			this._addExtraCursorHolder = function(){};
			this._addBlankText = function(){};
			this._addBlankTextAllSpan = function(){};
		}
	},
	
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["sLineBreaker", this.sLineBreaker]);
		
		this.oSelection = this.oApp.getEmptySelection();
		this.tmpTextNode = this.oSelection._document.createTextNode(unescape("%u00A0"));	// °ø¹é(&nbsp;) Ãß°¡ ½Ã »ç¿ëÇÒ ³ëµå
		jindo.$Fn(this._onKeyDown, this).attach(this.oApp.getWYSIWYGDocument(), "keydown");
	},
	
	_onKeyDown : function(oEvent){
		var oKeyInfo = oEvent.key();
		
		if(oKeyInfo.shift){
			return;
		}
		
		if(oKeyInfo.enter){
			if(this.sLineBreaker == "BR"){
				this._insertBR(oEvent);
			}else{
				this._wrapBlock(oEvent);
			}
		}
	},
	
	/**
	 * [SMARTEDITORSUS-950] ¿¡µðÅÍ Àû¿ë ÆäÀÌÁöÀÇ Compatible meta IE=edge ¼³Á¤ ½Ã ÁÙ°£°Ý ¹ú¾îÁü ÀÌ½´ (<BR>)
	 */
	$ON_REGISTER_CONVERTERS : function(){
		this.oApp.exec("ADD_CONVERTER", ["IR_TO_DB", jindo.$Fn(this.onIrToDB, this).bind()]);
	},
	
	/**
	 * IR_TO_DB º¯È¯±â Ã³¸®
	 *	Chrome, FireFoxÀÎ °æ¿ì¿¡¸¸ ¾Æ·¡¿Í °°Àº Ã³¸®¸¦ ÇÕ´Ï´Ù. 
	 *	: ÀúÀå ½Ã º»¹® ¿µ¿ª¿¡¼­ P ¾Æ·¡ÀÇ ¸ðµç ÇÏÀ§ ÅÂ±× Áß °¡Àå ¸¶Áö¸· childNode°¡ BRÀÎ °æ¿ì¸¦ Å½»öÇÏ¿© ÀÌ¸¦ &nbsp;·Î º¯°æÇØ ÁÝ´Ï´Ù.
	 */
	onIrToDB : function(sHTML){
		var sContents = sHTML,
			rxRegEx = /<br(\s[^>]*)?\/?>((?:<\/span>)?<\/p>)/gi,
			rxRegExWhitespace = /(<p[^>]*>)(?:[\s^>]*)(<\/p>)/gi;
			
		sContents = sContents.replace(rxRegEx, "&nbsp;$2");
		sContents = sContents.replace(rxRegExWhitespace, "$1&nbsp;$2");
		
		return sContents;
	},
	
	// [IE] Selection ³»ÀÇ ³ëµå¸¦ °¡Á®¿Í ºó ³ëµå¿¡ unescape("%uFEFF") (BOM) À» Ãß°¡
	_addBlankText : function(oSelection){
		var oNodes = oSelection.getNodes(),
			i, nLen, oNode, oNodeChild, tmpTextNode;
			
		for(i=0, nLen=oNodes.length; i<nLen; i++){
			oNode = oNodes[i];

			if(oNode.nodeType !== 1 || oNode.tagName !== "SPAN"){
				continue;
			}
			
			if(oNode.id.indexOf(oSelection.HUSKY_BOOMARK_START_ID_PREFIX) > -1 ||
				oNode.id.indexOf(oSelection.HUSKY_BOOMARK_END_ID_PREFIX) > -1){
				continue;
			}

			oNodeChild = oNode.firstChild;
			
			if(!oNodeChild ||
				(oNodeChild.nodeType == 3 && nhn.husky.SE2M_Utils.isBlankTextNode(oNodeChild)) ||
				(oNodeChild.nodeType == 1 && oNode.childNodes.length == 1 &&
					(oNodeChild.id.indexOf(oSelection.HUSKY_BOOMARK_START_ID_PREFIX) > -1 || oNodeChild.id.indexOf(oSelection.HUSKY_BOOMARK_END_ID_PREFIX) > -1))){
				tmpTextNode = oSelection._document.createTextNode(unescape("%uFEFF"));
				oNode.appendChild(tmpTextNode);
			}
		}
	},
	
	// [IE ÀÌ¿Ü] ºó ³ëµå ³»¿¡ Ä¿¼­¸¦ Ç¥½ÃÇÏ±â À§ÇÑ Ã³¸®
	_addCursorHolder : function(elWrapper){
		var elStyleOnlyNode = elWrapper;
		
		if(elWrapper.innerHTML == "" || (elStyleOnlyNode = this._getStyleOnlyNode(elWrapper))){
			elStyleOnlyNode.innerHTML = "<br>";
		}
		
		if(!elStyleOnlyNode){
			elStyleOnlyNode = this._getStyleNode(elWrapper);
		}
		
		return elStyleOnlyNode;
	},
	
	// [IE] ºó ³ëµå ³»¿¡ Ä¿¼­¸¦ Ç¥½ÃÇÏ±â À§ÇÑ Ã³¸® (_addSpace »ç¿ë)
	_addCursorHolderSpace : function(elWrapper){
		var elNode;
		
		this._addSpace(elWrapper);
		
		elNode = this._getStyleNode(elWrapper);
		
		if(elNode.innerHTML == "" && elNode.nodeName.toLowerCase() != "param"){
			try{
				elNode.innerHTML = unescape("%uFEFF");
			}catch(e) {
			}
		}
		
		return elNode;
	},
	
	_wrapBlock : function(oEvent, sWrapperTagName){
		var oSelection = this.oApp.getSelection(),
			sBM = oSelection.placeStringBookmark(),
			oLineInfo = oSelection.getLineInfo(),
			oStart = oLineInfo.oStart,
			oEnd = oLineInfo.oEnd,
			oSWrapper,
			oEWrapper,
			elStyleOnlyNode;
		
		// line broke by sibling
		// or
		// the parent line breaker is just a block container
		if(!oStart.bParentBreak || oSelection.rxBlockContainer.test(oStart.oLineBreaker.tagName)){
			oEvent.stop();
			
			//	¼±ÅÃµÈ ³»¿ëÀº »èÁ¦
			oSelection.deleteContents();
			if(!!oStart.oNode.parentNode && oStart.oNode.parentNode.nodeType !== 11){
				//	LineBreaker ·Î °¨½Î¼­ ºÐ¸®		
				oSWrapper = this.oApp.getWYSIWYGDocument().createElement(this.sLineBreaker);
				oSelection.moveToBookmark(sBM);	//oSelection.moveToStringBookmark(sBM, true);
				oSelection.setStartBefore(oStart.oNode);
				this._addBlankText(oSelection);
				oSelection.surroundContents(oSWrapper);
				oSelection.collapseToEnd();
				
				oEWrapper = this.oApp.getWYSIWYGDocument().createElement(this.sLineBreaker);
				oSelection.setEndAfter(oEnd.oNode);
				this._addBlankText(oSelection);
				oSelection.surroundContents(oEWrapper);
				oSelection.moveToStringBookmark(sBM, true);	// [SMARTEDITORSUS-180] Æ÷Ä¿½º ¸®¼Â
				oSelection.collapseToEnd();					// [SMARTEDITORSUS-180] Æ÷Ä¿½º ¸®¼Â
				oSelection.removeStringBookmark(sBM);
				
				oSelection.select();
				
				//	Cursor Holder Ãß°¡	
				// insert a cursor holder(br) if there's an empty-styling-only-tag surrounding current cursor
				elStyleOnlyNode = this._addCursorHolder(oSWrapper);
				
				if(oEWrapper.lastChild !== null && oEWrapper.lastChild.tagName == "BR"){
					oEWrapper.removeChild(oEWrapper.lastChild);
				}
				
				elStyleOnlyNode = this._addCursorHolder(oEWrapper);
	
				if(oEWrapper.nextSibling && oEWrapper.nextSibling.tagName == "BR"){
					oEWrapper.parentNode.removeChild(oEWrapper.nextSibling);
				}
	
				oSelection.selectNodeContents(elStyleOnlyNode);
				oSelection.collapseToStart();
				oSelection.select();
				
				this.oApp.exec("CHECK_STYLE_CHANGE", []);
				
				sBM = oSelection.placeStringBookmark();
				setTimeout(jindo.$Fn(function(sBM){
					var elBookmark = oSelection.getStringBookmark(sBM);
					if(!elBookmark){return;}

					oSelection.moveToStringBookmark(sBM);
					oSelection.select();
					oSelection.removeStringBookmark(sBM);
				}, this).bind(sBM), 0);
				
				return;
			}
		}

		var elBookmark;
		
		// ¾Æ·¡´Â ±âº»ÀûÀ¸·Î ºê¶ó¿ìÀú ±âº» ±â´É¿¡ ¸Ã°Ü¼­ Ã³¸®ÇÔ
		if(this.htBrowser.firefox){
			elBookmark = oSelection.getStringBookmark(sBM, true);
			
			if(elBookmark && elBookmark.nextSibling && elBookmark.nextSibling.tagName == "IFRAME"){
				setTimeout(jindo.$Fn(function(sBM){
					var elBookmark = oSelection.getStringBookmark(sBM);
					if(!elBookmark){return;}

					oSelection.moveToStringBookmark(sBM);
					oSelection.select();
					oSelection.removeStringBookmark(sBM);
				}, this).bind(sBM), 0);
			}else{
				oSelection.removeStringBookmark(sBM);
			}
		}else if(this.htBrowser.ie){
			elBookmark = oSelection.getStringBookmark(sBM, true);
			
			var elParentNode = elBookmark.parentNode,
				bAddUnderline = false,
				bAddLineThrough = false;

			if(!elBookmark || !elParentNode){// || elBookmark.nextSibling){
				oSelection.removeStringBookmark(sBM);
				return;
			}
		
			oSelection.removeStringBookmark(sBM);

			// -- [SMARTEDITORSUS-1452]
			var bAddCursorHolder = (elParentNode.tagName === "DIV" && elParentNode.parentNode.tagName === "LI");
			if (elParentNode.innerHTML !== "" && elParentNode.innerHTML !== unescape("%uFEFF")) {
			
				if (bAddCursorHolder) {
				
					setTimeout(jindo.$Fn(function() {
						var oSelection = this.oApp.getSelection();
						oSelection.fixCommonAncestorContainer();
						var elLowerNode = oSelection.commonAncestorContainer;
						elLowerNode = oSelection._getVeryFirstRealChild(elLowerNode);

						if (elLowerNode && (elLowerNode.innerHTML === "" || elLowerNode.innerHTML === unescape("%uFEFF"))) {
							elLowerNode.innerHTML = unescape("%uFEFF");
						}
					}, this).bind(elParentNode), 0);
				}
			} else {
					
				if (bAddCursorHolder) {
					var oSelection = this.oApp.getSelection();
					oSelection.fixCommonAncestorContainer();
					var elLowerNode = oSelection.commonAncestorContainer;
					elLowerNode = oSelection._getVeryFirstRealChild(elLowerNode);
					jindo.$Element(elLowerNode).leave();

					setTimeout(jindo.$Fn(function() {
						var oSelection = this.oApp.getSelection();
						oSelection.fixCommonAncestorContainer();
						var elLowerNode = oSelection.commonAncestorContainer;
						elLowerNode = oSelection._getVeryFirstRealChild(elLowerNode);

						if (elLowerNode && (elLowerNode.innerHTML === "" || elLowerNode.innerHTML === unescape("%uFEFF"))) {
							elLowerNode.innerHTML = unescape("%uFEFF");
						}
					}, this).bind(elParentNode), 0);
				}
			}
			// -- [SMARTEDITORSUS-1452]



			bAddUnderline = (elParentNode.tagName === "U" || nhn.husky.SE2M_Utils.findAncestorByTagName("U", elParentNode) !== null);
			bAddLineThrough = (elParentNode.tagName === "S" || elParentNode.tagName === "STRIKE" ||
							(nhn.husky.SE2M_Utils.findAncestorByTagName("S", elParentNode) !== null && nhn.husky.SE2M_Utils.findAncestorByTagName("STRIKE", elParentNode) !== null));
			
			// [SMARTEDITORSUS-26] Enter ÈÄ¿¡ ¹ØÁÙ/Ãë¼Ò¼±ÀÌ º¹»çµÇÁö ¾Ê´Â ¹®Á¦¸¦ Ã³¸® (ºê¶ó¿ìÀú Enter Ã³¸® ÈÄ ½ÇÇàµÇµµ·Ï setTimeout »ç¿ë)
			if(bAddUnderline || bAddLineThrough){
				setTimeout(jindo.$Fn(this._addTextDecorationTag, this).bind(bAddUnderline, bAddLineThrough), 0);
				
				return;
			}

			// [SMARTEDITORSUS-180] ºó SPAN ÅÂ±×¿¡ ÀÇÇØ ¿£ÅÍ ÈÄ ¿£ÅÍ°¡ µÇÁö ¾ÊÀº °ÍÀ¸·Î º¸ÀÌ´Â ¹®Á¦ (ºê¶ó¿ìÀú Enter Ã³¸® ÈÄ ½ÇÇàµÇµµ·Ï setTimeout »ç¿ë)
			setTimeout(jindo.$Fn(this._addExtraCursorHolder, this).bind(elParentNode), 0);
		}else{
			oSelection.removeStringBookmark(sBM);
		}
	},
	
	
	// [IE9 standard mode] ¿£ÅÍ ÈÄÀÇ »ó/ÇÏ´Ü P ÅÂ±×¸¦ È®ÀÎÇÏ¿© BOM, °ø¹é(&nbsp;) Ãß°¡
	_addExtraCursorHolder : function(elUpperNode){
		var oNodeChild,
			oPrevChild,
			elHtml;
		
		elUpperNode = this._getStyleOnlyNode(elUpperNode);
		
		// ¿£ÅÍ ÈÄÀÇ »ó´Ü SPAN ³ëµå¿¡ BOM Ãß°¡
		//if(!!elUpperNode && /^(B|EM|I|LABEL|SPAN|STRONG|SUB|SUP|U|STRIKE)$/.test(elUpperNode.tagName) === false){
		if(!!elUpperNode && elUpperNode.tagName === "SPAN"){ // SPAN ÀÎ °æ¿ì¿¡¸¸ ¹ß»ýÇÔ
			oNodeChild = elUpperNode.lastChild;
									
			while(!!oNodeChild){	// ºó Text Á¦°Å
				oPrevChild = oNodeChild.previousSibling;
				
				if(oNodeChild.nodeType !== 3){
					oNodeChild = oPrevChild;
					continue;
				}
				
				if(nhn.husky.SE2M_Utils.isBlankTextNode(oNodeChild)){
					oNodeChild.parentNode.removeChild(oNodeChild);
				}
				
				oNodeChild = oPrevChild;
			}
			
			elHtml = elUpperNode.innerHTML;

			if(elHtml === "" || elHtml.replace(unescape("%uFEFF"), '') === ""){
				elUpperNode.innerHTML = unescape("%uFEFF");
			}
		}

		// ¿£ÅÍ ÈÄ¿¡ ºñ¾îÀÖ´Â ÇÏ´Ü SPAN ³ëµå¿¡ BOM Ãß°¡
		var oSelection = this.oApp.getSelection(),
			sBM,
			elLowerNode,
			elParent;

		if(!oSelection.collapsed){
			return;
		}

		oSelection.fixCommonAncestorContainer();
		elLowerNode = oSelection.commonAncestorContainer;
		
		if(!elLowerNode){
			return;
		}
		
		elLowerNode = oSelection._getVeryFirstRealChild(elLowerNode);
		
		if(elLowerNode.nodeType === 3){
			elLowerNode = elLowerNode.parentNode;
		}
		
		if(!elLowerNode || elLowerNode.tagName !== "SPAN"){
			return;
		}

		elHtml = elLowerNode.innerHTML;
		
		if(elHtml === "" || elHtml.replace(unescape("%uFEFF"), '') === ""){
			elLowerNode.innerHTML = unescape("%uFEFF");
		}
					
		var elParentP = nhn.husky.SE2M_Utils.findAncestorByTagName("P", elLowerNode);
		var elParentLi = nhn.husky.SE2M_Utils.findAncestorByTagName("LI", elLowerNode);
		elParent = elParentP || elParentLi;
		
		oSelection.selectNodeContents(elLowerNode);
		
		sBM = oSelection.placeStringBookmark();

		this._addSpace(elParent.previousSibling);	// »ó´Ü P ³ëµå¿¡ °ø¹é¹®ÀÚ Ãß°¡
		this._addSpace(elParent);					// ÇÏ´Ü P ³ëµå¿¡ °ø¹é¹®ÀÚ Ãß°¡

		oSelection.moveToBookmark(sBM);		
		oSelection.selectNodeContents(elLowerNode);
		oSelection.collapseToStart();		
		oSelection.select();

		oSelection.removeStringBookmark(sBM);
	},
	
	// [IE] P ÅÂ±× °¡Àå µÚ ÀÚ½Ä³ëµå·Î °ø¹é(&nbsp;)À» °ªÀ¸·Î ÇÏ´Â ÅØ½ºÆ® ³ëµå¸¦ Ãß°¡
	_addSpace : function(elNode){
		var tmpTextNode, elChild, elNextChild, bHasNBSP, aImgChild, elLastImg;

		if(!elNode){
			return;
		}
		
		if(elNode.nodeType === 3){
			return elNode.parentNode;
		}
		
		if(elNode.tagName !== "P"){
			return elNode;
		}
		
		aImgChild = jindo.$Element(elNode).child(function(v){  
			return (v.$value().nodeType === 1 && v.$value().tagName === "IMG");
		}, 1);
		
		if(aImgChild.length > 0){
			elLastImg = aImgChild[aImgChild.length - 1].$value();
			elChild = elLastImg.nextSibling;
			
			while(elChild){
				elNextChild = elChild.nextSibling;
				
				if (elChild.nodeType === 3 && (elChild.nodeValue === "&nbsp;" || elChild.nodeValue === unescape("%u00A0"))) {
					elNode.removeChild(elChild);
				}
			
				elChild = elNextChild;
			}
			return elNode;
		}
		
		elChild = elNode.firstChild;
		elNextChild = elChild;
		bHasNBSP = false;
		
		while(elChild){	// &nbsp;¸¦ ºÙÀÏ²¨´Ï±î P ¹Ù·Î ¾Æ·¡ÀÇ "%uFEFF"´Â Á¦°ÅÇÔ
			elNextChild = elChild.nextSibling;
			
			if(elChild.nodeType === 3){
				if(elChild.nodeValue === unescape("%uFEFF")){
					elNode.removeChild(elChild);
				}
				
				if(!bHasNBSP && (elChild.nodeValue === "&nbsp;" || elChild.nodeValue === unescape("%u00A0"))){
					bHasNBSP = true;
				}
			}
			
			elChild = elNextChild;
		}
		
		if(!bHasNBSP){
			tmpTextNode = this.tmpTextNode.cloneNode();
			elNode.appendChild(tmpTextNode);
		}
		
		return elNode;	// [SMARTEDITORSUS-418] return ¿¤¸®¸ÕÆ® Ãß°¡
	},
	
	// [IE] ¿£ÅÍ ÈÄ¿¡ Ãë¼Ò¼±/¹ØÁÙ ÅÂ±×¸¦ ÀÓÀÇ·Î Ãß°¡ (Ãë¼Ò¼±/¹ØÁÙ¿¡ »ö»óÀ» Ç¥½ÃÇÏ±â À§ÇÔ)
	_addTextDecorationTag : function(bAddUnderline, bAddLineThrough){
		var oTargetNode, oNewNode,
			oSelection = this.oApp.getSelection();
			
		if(!oSelection.collapsed){
			return;
		}
					
		oTargetNode = oSelection.startContainer;

		while(oTargetNode){
			if(oTargetNode.nodeType === 3){
				oTargetNode = nhn.DOMFix.parentNode(oTargetNode);
				break;
			}
			
			if(!oTargetNode.childNodes || oTargetNode.childNodes.length === 0){
				oTargetNode.innerHTML = unescape("%uFEFF");
				break;
			}
			
			oTargetNode = oTargetNode.firstChild;	
		}
							
		if(!oTargetNode){
			return;
		}
		
		if(oTargetNode.tagName === "U" || oTargetNode.tagName === "S" || oTargetNode.tagName === "STRIKE"){
			return;
		}
		
		var elStyleOnlyNode;
		
		if(oTargetNode.innerHTML == "" || (elStyleOnlyNode = this._getStyleOnlyNode(oTargetNode))){	
			this._addSpace(elStyleOnlyNode, oTargetNode);
		}
		
		if(bAddUnderline){
			oNewNode = oSelection._document.createElement("U");
			oTargetNode.appendChild(oNewNode);
			oTargetNode = oNewNode;
		}

		if(bAddLineThrough){
			oNewNode = oSelection._document.createElement("STRIKE");
			oTargetNode.appendChild(oNewNode);
		}
		
		oNewNode.innerHTML = unescape("%uFEFF");
		oSelection.selectNodeContents(oNewNode);	
		oSelection.collapseToEnd(); // End ·Î ÇØ¾ß »õ·Î »ý¼ºµÈ ³ëµå ¾ÈÀ¸·Î Selection ÀÌ µé¾î°¨
		oSelection.select();
	},
	
	// [IE9 standard mode] _getStyleOnlyNode ¿¡¼­ ³ëµå¸¦ °Ë»öÇÏ ¶§ ºó ³ëµå°¡ ÀÖÀ¸¸é BOM Ãß°¡ 
	_addBlankTextAllSpan : function(elNode){
		var aSpanList,
			nSpanLen,
			sInnerHtml,
			i;
		
		if(!elNode){
			return;
		}
		
		aSpanList = jindo.$Element(elNode).child(function(v){
			return (v.$value().nodeType === 1 && v.$value().tagName === "SPAN");
		});
		
		nSpanLen = aSpanList.length;

		for(i=0; i<nSpanLen; i++){
			sInnerHtml = aSpanList[i].html();
			
			if(sInnerHtml === ""){
				aSpanList[i].html(unescape("%uFEFF"));
			}
		}
	},
	
	// returns inner-most styling node
	// -> returns span3 from <span1><span2><span3>aaa</span></span></span>
	_getStyleNode : function(elNode){			
		while(elNode.firstChild && this.oSelection._isBlankTextNode(elNode.firstChild)){
			elNode.removeChild(elNode.firstChild);
		}
		
		var elFirstChild = elNode.firstChild;

		if(!elFirstChild){
			return elNode;
		}
				
		if(elFirstChild.nodeType === 3 || 
			(elFirstChild.nodeType === 1 && 
				(elFirstChild.tagName == "IMG" || elFirstChild.tagName == "BR" || elFirstChild.tagName == "HR" || elFirstChild.tagName == "IFRAME"))){
			return elNode;
		}

		return this._getStyleNode(elNode.firstChild);
	},
	
	// returns inner-most styling only node if there's any.
	// -> returns span3 from <span1><span2><span3></span></span></span>
	_getStyleOnlyNode : function(elNode){
		if(!elNode){
			return null;
		}

		// the final styling node must allow appending children
		// -> this doesn't seem to work for FF
		if(!elNode.insertBefore){
			return null;
		}
		
		if(elNode.tagName == "IMG" || elNode.tagName == "BR" || elNode.tagName == "HR" || elNode.tagName == "IFRAME"){
			return null;
		}
	
		while(elNode.firstChild && this.oSelection._isBlankTextNode(elNode.firstChild)){
			elNode.removeChild(elNode.firstChild);
		}

		if(elNode.childNodes.length>1){
			return null;
		}

		if(!elNode.firstChild){
			return elNode;
		}
		
		// [SMARTEDITORSUS-227] TEXT_NODE °¡ return µÇ´Â ¹®Á¦¸¦ ¼öÁ¤ÇÔ. IE ¿¡¼­ TEXT_NODE ÀÇ innrHTML ¿¡ Á¢±ÙÇÏ¸é ¿À·ù ¹ß»ý
		if(elNode.firstChild.nodeType === 3){
			return nhn.husky.SE2M_Utils.isBlankTextNode(elNode.firstChild) ? elNode : null;
			//return (elNode.firstChild.textContents === null || elNode.firstChild.textContents === "") ? elNode : null;
		}

		return this._getStyleOnlyNode(elNode.firstChild);
	},
	
	_insertBR : function(oEvent){
		oEvent.stop();

		var oSelection = this.oApp.getSelection();

		var elBR = this.oApp.getWYSIWYGDocument().createElement("BR");
		oSelection.insertNode(elBR);
		oSelection.selectNode(elBR);
		oSelection.collapseToEnd();
		
		if(!this.htBrowser.ie){
			var oLineInfo = oSelection.getLineInfo();
			var oEnd = oLineInfo.oEnd;

			// line break by Parent
			// <div> 1234<br></div>ÀÎ°æ¿ì, FF¿¡¼­´Â ´ÙÀ½ ¶óÀÎÀ¸·Î Ä¿¼­ ÀÌµ¿ÀÌ ¾È ÀÏ¾î³².
			// ±×·¡¼­  <div> 1234<br><br type='_moz'/></div> ÀÌ¿Í °°ÀÌ »ý¼ºÇØÁÖ¾î¾ß ¿¡µðÅÍ »ó¿¡ 2ÁÙ·Î µÇ¾î º¸ÀÓ.
			if(oEnd.bParentBreak){
				while(oEnd.oNode && oEnd.oNode.nodeType == 3 && oEnd.oNode.nodeValue == ""){
					oEnd.oNode = oEnd.oNode.previousSibling;
				}

				var nTmp = 1;
				if(oEnd.oNode == elBR || oEnd.oNode.nextSibling == elBR){
					nTmp = 0;
				}

				if(nTmp === 0){
					oSelection.pasteHTML("<br type='_moz'/>");
					oSelection.collapseToEnd();
				}
			}
		}

		// the text cursor won't move to the next line without this
		oSelection.insertNode(this.oApp.getWYSIWYGDocument().createTextNode(""));
		oSelection.select();
	}
});
//}
/**
 * ColorPicker Component
 * @author gony
 */
 nhn.ColorPicker = jindo.$Class({
	elem : null,
	huePanel : null,
	canvasType : "Canvas",
	_hsvColor  : null,
 	$init : function(oElement, oOptions) {
		this.elem = jindo.$Element(oElement).empty();
		this.huePanel   = null;
		this.cursor     = jindo.$Element("<div>").css("overflow", "hidden");
		this.canvasType = jindo.$(oElement).filters?"Filter":jindo.$("<canvas>").getContext?"Canvas":null;

		if(!this.canvasType) {
			return false;
		}
		
		this.option({
			huePanel : null,
			huePanelType : "horizontal"
		});
		
		this.option(oOptions);
		if (this.option("huePanel")) {
			this.huePanel = jindo.$Element(this.option("huePanel")).empty();
		}	

		// rgb
		this._hsvColor = this._hsv(0,100,100); // #FF0000

		// event binding
		for(var name in this) {
			if (/^_on[A-Z][a-z]+[A-Z][a-z]+$/.test(name)) {
				this[name+"Fn"] = jindo.$Fn(this[name], this);
			}	
		}

		this._onDownColorFn.attach(this.elem, "mousedown");
		if (this.huePanel) {
			this._onDownHueFn.attach(this.huePanel, "mousedown");
		}	

		// paint
		this.paint();
	},
	rgb : function(rgb) {
		this.hsv(this._rgb2hsv(rgb.r, rgb.g, rgb.b));
	},
	hsv : function(hsv) {
		if (typeof hsv == "undefined") {
			return this._hsvColor;
		}	

		var rgb = null;
		var w = this.elem.width();
		var h = this.elem.height();
		var cw = this.cursor.width();
		var ch = this.cursor.height();
		var x = 0, y = 0;

		if (this.huePanel) {
			rgb = this._hsv2rgb(hsv.h, 100, 100);
			this.elem.css("background", "#"+this._rgb2hex(rgb.r, rgb.g, rgb.b));

			x = hsv.s/100 * w;
			y = (100-hsv.v)/100 * h;
		} else {
			var hw = w / 2;
			if (hsv.v > hsv.s) {
				hsv.v = 100;
				x = hsv.s/100 * hw;
			} else {
				hsv.s = 100;
				x = (100-hsv.v)/100 * hw + hw;
			}
			y = hsv.h/360 * h;
		}

		x = Math.max(Math.min(x-1,w-cw), 1);
		y = Math.max(Math.min(y-1,h-ch), 1);

		this.cursor.css({left:x+"px",top:y+"px"});

		this._hsvColor = hsv;
		rgb = this._hsv2rgb(hsv.h, hsv.s, hsv.v);

		this.fireEvent("colorchange", {type:"colorchange", element:this, currentElement:this, rgbColor:rgb, hexColor:"#"+this._rgb2hex(rgb.r, rgb.g, rgb.b), hsvColor:hsv} );
	},
	paint : function() {
		if (this.huePanel) {
			// paint color panel
			this["_paintColWith"+this.canvasType]();

			// paint hue panel
			this["_paintHueWith"+this.canvasType]();
		} else {
			// paint color panel
			this["_paintOneWith"+this.canvasType]();
		}

		// draw cursor
		this.cursor.appendTo(this.elem);
		this.cursor.css({position:"absolute",top:"1px",left:"1px",background:"white",border:"1px solid black"}).width(3).height(3);

		this.hsv(this._hsvColor);
	},
	_paintColWithFilter : function() {
		// white : left to right
		jindo.$Element("<div>").css({
			position : "absolute",
			top      : 0,
			left     : 0,
			width    : "100%",
			height   : "100%",
			filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#FFFFFFFF',EndColorStr='#00FFFFFF')"
		}).appendTo(this.elem);

		// black : down to up
		jindo.$Element("<div>").css({
			position : "absolute",
			top      : 0,
			left     : 0,
			width    : "100%",
			height   : "100%",
			filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr='#00000000',EndColorStr='#FF000000')"
		}).appendTo(this.elem);
	},
	_paintColWithCanvas : function() {
		var cvs = jindo.$Element("<canvas>").css({width:"100%",height:"100%"});		
		cvs.appendTo(this.elem.empty());
		
		var ctx = cvs.attr("width", cvs.width()).attr("height", cvs.height()).$value().getContext("2d");
		var lin = null;
		var w   = cvs.width();
		var h   = cvs.height();

		// white : left to right
		lin = ctx.createLinearGradient(0,0,w,0);
		lin.addColorStop(0, "rgba(255,255,255,1)");
		lin.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = lin;
		ctx.fillRect(0,0,w,h);

		// black : down to top
		lin = ctx.createLinearGradient(0,0,0,h);
		lin.addColorStop(0, "rgba(0,0,0,0)");
		lin.addColorStop(1, "rgba(0,0,0,1)");
		ctx.fillStyle = lin;
		ctx.fillRect(0,0,w,h);
	},
	_paintOneWithFilter : function() {
		var sp, ep, s_rgb, e_rgb, s_hex, e_hex;
		var h = this.elem.height();

		for(var i=1; i < 7; i++) {
			sp = Math.floor((i-1)/6 * h);
			ep = Math.floor(i/6 * h);

			s_rgb = this._hsv2rgb((i-1)/6*360, 100, 100);
			e_rgb = this._hsv2rgb(i/6*360, 100, 100);
			s_hex = "#FF"+this._rgb2hex(s_rgb.r, s_rgb.g, s_rgb.b);
			e_hex = "#FF"+this._rgb2hex(e_rgb.r, e_rgb.g, e_rgb.b);

			jindo.$Element("<div>").css({
				position : "absolute",
				left   : 0,
				width  : "100%",
				top    : sp + "px",
				height : (ep-sp) + "px",
				filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr='"+s_hex+"',EndColorStr='"+e_hex+"')"
			}).appendTo(this.elem);
		}

		// white : left to right
		jindo.$Element("<div>").css({
			position : "absolute",
			top      : 0,
			left     : 0,
			width    : "50%",
			height   : "100%",
			filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#FFFFFFFF',EndColorStr='#00FFFFFF')"
		}).appendTo(this.elem);

		// black : down to up
		jindo.$Element("<div>").css({
			position : "absolute",
			top      : 0,
			right    : 0,
			width    : "50%",
			height   : "100%",
			filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#00000000',EndColorStr='#FF000000')"
		}).appendTo(this.elem);
	},
	_paintOneWithCanvas : function() {
		var rgb = {r:0, g:0, b:0};		
		var cvs = jindo.$Element("<canvas>").css({width:"100%",height:"100%"});
		cvs.appendTo(this.elem.empty());
		
		var ctx = cvs.attr("width", cvs.width()).attr("height", cvs.height()).$value().getContext("2d");
		
		var w = cvs.width();
		var h = cvs.height();
		var lin = ctx.createLinearGradient(0,0,0,h);

		for(var i=0; i < 7; i++) {
			rgb = this._hsv2rgb(i/6*360, 100, 100);
			lin.addColorStop(i/6, "rgb("+rgb.join(",")+")");
		}
		ctx.fillStyle = lin;
		ctx.fillRect(0,0,w,h);

		lin = ctx.createLinearGradient(0,0,w,0);
		lin.addColorStop(0, "rgba(255,255,255,1)");
		lin.addColorStop(0.5, "rgba(255,255,255,0)");
		lin.addColorStop(0.5, "rgba(0,0,0,0)");
		lin.addColorStop(1, "rgba(0,0,0,1)");
		ctx.fillStyle = lin;
		ctx.fillRect(0,0,w,h);
	},
	_paintHueWithFilter : function() {
		var sp, ep, s_rgb, e_rgb, s_hex, e_hex;
		var vert = (this.option().huePanelType == "vertical");		
		var w = this.huePanel.width();
		var h = this.huePanel.height();
		var elDiv = null;

		var nPanelBorderWidth = parseInt(this.huePanel.css('borderWidth'), 10);
		if (!!isNaN(nPanelBorderWidth)) { nPanelBorderWidth = 0; }		
		w -= nPanelBorderWidth * 2; // borderWidth¸¦ Á¦¿ÜÇÑ ³»Ãø ÆøÀ» ±¸ÇÔ  
		
		for(var i=1; i < 7; i++) {
			sp = Math.floor((i-1)/6 * (vert?h:w));
			ep = Math.floor(i/6 * (vert?h:w));

			s_rgb = this._hsv2rgb((i-1)/6*360, 100, 100);
			e_rgb = this._hsv2rgb(i/6*360, 100, 100);
			s_hex = "#FF"+this._rgb2hex(s_rgb.r, s_rgb.g, s_rgb.b);
			e_hex = "#FF"+this._rgb2hex(e_rgb.r, e_rgb.g, e_rgb.b);

			elDiv = jindo.$Element("<div>").css({
				position : "absolute",
				filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType="+(vert?0:1)+",StartColorStr='"+s_hex+"',EndColorStr='"+e_hex+"')"
			});
			
			var width = (ep - sp) + 1; // IE¿¡¼­ ÆøÀ» ³ÐÇôÁÖÁö ¾ÊÀ¸¸é È®´ë ½Ã ¹ú¾îÁü, ±×·¡¼­ 1px º¸Á¤ 			
			elDiv.appendTo(this.huePanel);
			elDiv.css(vert?"left":"top", 0).css(vert?"width":"height", '100%');
			elDiv.css(vert?"top":"left", sp + "px").css(vert?"height":"width", width + "px");
		}
	},
	_paintHueWithCanvas : function() {
		var opt = this.option(), rgb;
		var vtc = (opt.huePanelType == "vertical");
		
		var cvs = jindo.$Element("<canvas>").css({width:"100%",height:"100%"});
		cvs.appendTo(this.huePanel.empty());
		
		var ctx = cvs.attr("width", cvs.width()).attr("height", cvs.height()).$value().getContext("2d");
		var lin = ctx.createLinearGradient(0,0,vtc?0:cvs.width(),vtc?cvs.height():0);

		for(var i=0; i < 7; i++) {
			rgb = this._hsv2rgb(i/6*360, 100, 100);
			lin.addColorStop(i/6, "rgb("+rgb.join(",")+")");
		}
		ctx.fillStyle = lin;
		ctx.fillRect(0,0,cvs.width(),cvs.height());
	},
	_rgb2hsv : function(r,g,b) {
		var h = 0, s = 0, v = Math.max(r,g,b), min = Math.min(r,g,b), delta = v - min;
		s = (v ? delta/v : 0);
		
		if (s) {
			if (r == v) {
				h = 60 * (g - b) / delta;
			} else if (g == v) {
				h = 120 + 60 * (b - r) / delta;
			} else if (b == v) {
				h = 240 + 60 * (r - g) / delta;
			}	

			if (h < 0) {
				h += 360;
			}	
		}
		
		h = Math.floor(h);
		s = Math.floor(s * 100);
		v = Math.floor(v / 255 * 100);

		return this._hsv(h,s,v);
	},
	_hsv2rgb : function(h,s,v) {
		h = (h % 360) / 60; s /= 100; v /= 100;

		var r=0, g=0, b=0;
		var i = Math.floor(h);
		var f = h-i;
		var p = v*(1-s);
		var q = v*(1-s*f);
		var t = v*(1-s*(1-f));

		switch (i) {
			case 0: r=v; g=t; b=p; break;
			case 1: r=q; g=v; b=p; break;
			case 2: r=p; g=v; b=t; break;
			case 3: r=p; g=q; b=v; break;
			case 4: r=t; g=p; b=v; break;
			case 5: r=v; g=p; b=q;break;
			case 6: break;
		}

		r = Math.floor(r*255);
		g = Math.floor(g*255);
		b = Math.floor(b*255);

		return this._rgb(r,g,b);
	},
	_rgb2hex : function(r,g,b) {
		r = r.toString(16); 
		if (r.length == 1) {
			r = '0'+r;
		}
		
		g = g.toString(16); 
		if (g.length==1) {
			g = '0'+g;
		}
		
		b = b.toString(16); 
		if (b.length==1) {
			b = '0'+b;
		}	

		return r+g+b;
	},
	_hex2rgb : function(hex) {
		var m = hex.match(/#?([0-9a-f]{6}|[0-9a-f]{3})/i);
		if (m[1].length == 3) {
			m = m[1].match(/./g).filter(function(c) {
				return c+c; 
			});
		} else {
			m = m[1].match(/../g);
		}
		return {
			r : Number("0x" + m[0]),
			g : Number("0x" + m[1]),
			b : Number("0x" + m[2])
		};
	},
	_rgb : function(r,g,b) {
		var ret = [r,g,b];

		ret.r = r;
		ret.g = g;
		ret.b = b;

		return ret;
	},
	_hsv : function(h,s,v) {
		var ret = [h,s,v];

		ret.h = h;
		ret.s = s;
		ret.v = v;

		return ret;
	},
	_onDownColor : function(e) {
		if (!e.mouse().left) {
			return false;
		}	

		var pos = e.pos();

		this._colPagePos = [pos.pageX, pos.pageY];
		this._colLayerPos = [pos.layerX, pos.layerY];

		this._onUpColorFn.attach(document, "mouseup");
		this._onMoveColorFn.attach(document, "mousemove");

		this._onMoveColor(e);
	},
	_onUpColor : function(e) {
		this._onUpColorFn.detach(document, "mouseup");
		this._onMoveColorFn.detach(document, "mousemove");
	},
	_onMoveColor : function(e) {
		var hsv = this._hsvColor;
		var pos = e.pos();
		var x = this._colLayerPos[0] + (pos.pageX - this._colPagePos[0]);
		var y = this._colLayerPos[1] + (pos.pageY - this._colPagePos[1]);
		var w = this.elem.width();
		var h = this.elem.height();

		x = Math.max(Math.min(x, w), 0);
		y = Math.max(Math.min(y, h), 0);

		if (this.huePanel) {
			hsv.s = hsv[1] = x / w * 100;
			hsv.v = hsv[2] = (h - y) / h * 100;
		} else {
			hsv.h = y/h*360;

			var hw = w/2;

			if (x < hw) {
				hsv.s = x/hw * 100;
				hsv.v = 100;
			} else {
				hsv.s = 100;
				hsv.v = (w-x)/hw * 100;
			}
		}

		this.hsv(hsv);

		e.stop();
	},
	_onDownHue : function(e) {
		if (!e.mouse().left) {
			return false;
		}	

		var pos = e.pos();

		this._huePagePos  = [pos.pageX, pos.pageY];
		this._hueLayerPos = [pos.layerX, pos.layerY];

		this._onUpHueFn.attach(document, "mouseup");
		this._onMoveHueFn.attach(document, "mousemove");

		this._onMoveHue(e);
	},
	_onUpHue : function(e) {
		this._onUpHueFn.detach(document, "mouseup");
		this._onMoveHueFn.detach(document, "mousemove");
	},
	_onMoveHue : function(e) {
		var hsv = this._hsvColor;
		var pos = e.pos();
		var cur = 0, len = 0;
		var x = this._hueLayerPos[0] + (pos.pageX - this._huePagePos[0]);
		var y = this._hueLayerPos[1] + (pos.pageY - this._huePagePos[1]);

		if (this.option().huePanelType == "vertical") {
			cur = y;
			len = this.huePanel.height();
		} else {
			cur = x;
			len = this.huePanel.width();
		}

		hsv.h = hsv[0] = (Math.min(Math.max(cur, 0), len)/len * 360)%360;

		this.hsv(hsv);

		e.stop();
	}
 }).extend(jindo.Component);
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of Accessibility about SmartEditor2.
 * @name hp_SE2M_Accessibility.js
 */
nhn.husky.SE2M_Accessibility = jindo.$Class({
	name : "SE2M_Accessibility",
	
	/*
	 * elAppContainer : mandatory
	 * sLocale, sEditorType : optional
	 */
	$init: function(elAppContainer, sLocale, sEditorType) {
		this._assignHTMLElements(elAppContainer);
		
        if(!!sLocale){
           this.sLang = sLocale;
        }   
            
        if(!!sEditorType){
            this.sType = sEditorType;
        }
	},          

	_assignHTMLElements : function(elAppContainer){
		this.elHelpPopupLayer = jindo.$$.getSingle("DIV.se2_accessibility", elAppContainer);
		this.welHelpPopupLayer = jindo.$Element(this.elHelpPopupLayer);	

		//close buttons
		this.oCloseButton = jindo.$$.getSingle("BUTTON.se2_close", this.elHelpPopupLayer);
		this.oCloseButton2 = jindo.$$.getSingle("BUTTON.se2_close2", this.elHelpPopupLayer);
		
		this.nDefaultTop = 150;
		
		// [SMARTEDITORSUS-1594] Æ÷Ä¿½º Å½»ö¿¡ »ç¿ëÇÏ±â À§ÇØ ÇÒ´ç
		this.elAppContainer = elAppContainer;
		// --[SMARTEDITORSUS-1594]
	},
	
	$ON_MSG_APP_READY : function(){
		this.htAccessOption = nhn.husky.SE2M_Configuration.SE2M_Accessibility || {};
		this.oApp.exec("REGISTER_HOTKEY", ["alt+F10", "FOCUS_TOOLBAR_AREA", []]); 
        this.oApp.exec("REGISTER_HOTKEY", ["alt+COMMA", "FOCUS_BEFORE_ELEMENT", []]);
        this.oApp.exec("REGISTER_HOTKEY", ["alt+PERIOD", "FOCUS_NEXT_ELEMENT", []]);

        if ((this.sType == 'basic' || this.sType == 'light') && (this.sLang != 'ko_KR'))  {
        	 	//do nothing
                return;
        } else {
                this.oApp.exec("REGISTER_HOTKEY", ["alt+0", "OPEN_HELP_POPUP", []]);  
                
                //[SMARTEDITORSUS-1327] IE 7/8¿¡¼­ ALT+0À¸·Î ÆË¾÷ ¶ç¿ì°í escÅ¬¸¯½Ã ÆË¾÷Ã¢ ´ÝÈ÷°Ô ÇÏ·Á¸é ¾Æ·¡ ºÎºÐ ²À ÇÊ¿äÇÔ. (targetÀº document°¡ µÇ¾î¾ß ÇÔ!)
                this.oApp.exec("REGISTER_HOTKEY", ["esc", "CLOSE_HELP_POPUP", [], document]);  
        }   

		//[SMARTEDITORSUS-1353]
		if (this.htAccessOption.sTitleElementId) {
			this.oApp.registerBrowserEvent(document.getElementById(this.htAccessOption.sTitleElementId), "keydown", "MOVE_TO_EDITAREA", []);
		}
	},
	
	$ON_MOVE_TO_EDITAREA : function(weEvent) {
		var TAB_KEY_CODE = 9;
		if (weEvent.key().keyCode == TAB_KEY_CODE) {
			if(weEvent.key().shift) {return;}
			this.oApp.delayedExec("FOCUS", [], 0);
		}
	},
	
	$LOCAL_BEFORE_FIRST : function(sMsg){
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("CLOSE_HELP_POPUP", [this.oCloseButton]), this).attach(this.oCloseButton, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("CLOSE_HELP_POPUP", [this.oCloseButton2]), this).attach(this.oCloseButton2, "click");
	
		//·¹ÀÌ¾îÀÇ ÀÌµ¿ ¹üÀ§ ¼³Á¤.
		var elIframe = this.oApp.getWYSIWYGWindow().frameElement;
        this.htOffsetPos = jindo.$Element(elIframe).offset();
        this.nEditorWidth = elIframe.offsetWidth;

        this.htInitialPos = this.welHelpPopupLayer.offset();
        var htScrollXY = this.oApp.oUtils.getScrollXY();

        this.nLayerWidth = 590;   
        this.nLayerHeight = 480;   		

        this.htTopLeftCorner = {x:parseInt(this.htOffsetPos.left, 10), y:parseInt(this.htOffsetPos.top, 10)};
        //[css markup] left:11 top:74·Î µÇ¾î ÀÖÀ½
	},

	/**
	 * [SMARTEDITORSUS-1594]
	 * SE2M_Configuration_General¿¡¼­ Æ÷Ä¿½º¸¦ ÀÌµ¿ÇÒ ¿¡µðÅÍ ¿µ¿ª ÀÌÈÄÀÇ ¿¤·¹¸ÕÆ®¸¦ ÁöÁ¤ÇØ µÎ¾ú´Ù¸é, ¼³Á¤°ªÀ» µû¸¥´Ù.
	 * ÁöÁ¤ÇÏÁö ¾Ê¾Ò°Å³ª ºó StringÀÌ¶ó¸é, elAppContainer¸¦ ±âÁØÀ¸·Î ÀÚµ¿ Å½»öÇÑ´Ù.
	 * */
	$ON_FOCUS_NEXT_ELEMENT : function() {
		// Æ÷Ä¿½º Ä³½Ì
		this._currentNextFocusElement = null; // »õ·Î¿î Æ÷Ä¿½º ÀÌµ¿ÀÌ ¹ß»ýÇÒ ¶§¸¶´Ù Ä³½Ì ÃÊ±âÈ­
		
		if(this.htAccessOption.sNextElementId){
			this._currentNextFocusElement = document.getElementById(this.htAccessOption.sNextElementId); 
		}else{
			this._currentNextFocusElement = this._findNextFocusElement(this.elAppContainer);
		}
		
		if(this._currentNextFocusElement){
			window.focus(); // [SMARTEDITORSUS-1360] IE7¿¡¼­´Â element¿¡ ´ëÇÑ focus¸¦ ÁÖ±â À§ÇØ ¼±ÇàµÇ¾î¾ß ÇÑ´Ù.
			this._currentNextFocusElement.focus();
		}else if(parent && parent.nhn && parent.nhn.husky && parent.nhn.husky.EZCreator && parent.nhn.husky.EZCreator.elIFrame){
			parent.focus();
			if(this._currentNextFocusElement = this._findNextFocusElement(parent.nhn.husky.EZCreator.elIFrame)){
				this._currentNextFocusElement.focus();
			}
		}
	},

	/**
	 * [SMARTEDITORSUS-1594] DIV#smart_editor2 ´ÙÀ½ ¿ä¼Ò¿¡¼­ °¡Àå °¡±î¿î Æ÷Ä¿½º¿ë ÅÂ±×¸¦ Å½»ö 
	 * */
	_findNextFocusElement : function(targetElement){
		var target = null;
		
		var el = targetElement.nextSibling;

		while(el){
			if(el.nodeType !== 1){ // Element Node¸¸À» ´ë»óÀ¸·Î ÇÑ´Ù.
				// ´ë»ó ³ëµå ´ë½Å nextSiblingÀ» Ã£µÇ, ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¥ ¼öµµ ÀÖ´Ù.
				// document.body±îÁö °Å½½·¯ ¿Ã¶ó°¡°Ô µÇ¸é Å½»ö Á¾·á
				el = this._switchToSiblingOrNothing(el);
				if(!el){
					break;
				}else{
					continue;
				}
			}
			
			// ´ë»ó ³ëµå¸¦ ±âÁØÀ¸·Î, ÀüÀ§¼øÈ¸·Î Á¶°Ç¿¡ ºÎÇÕÇÏ´Â ³ëµå Å½»ö
			this._recursivePreorderTraversalFilter(el, this._isFocusTag);	
			
			if(this._nextFocusElement){
				target = this._nextFocusElement;
				
				// Å½»ö¿¡ »ç¿ëÇß´ø º¯¼ö ÃÊ±âÈ­
				this._bStopFindingNextElement = false;
				this._nextFocusElement = null;
				
				break;
			}else{
				// ´ë»ó ³ëµå ´ë½Å nextSiblingÀ» Ã£µÇ, ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¥ ¼öµµ ÀÖ´Ù.
				// document.body±îÁö °Å½½·¯ ¿Ã¶ó°¡°Ô µÇ¸é Å½»ö Á¾·á
				el = this._switchToSiblingOrNothing(el);
				if(!el){
					break;
				}
			}
		}
	
		// targetÀÌ Á¸ÀçÇÏÁö ¾ÊÀ¸¸é null ¹ÝÈ¯
		return target;
	},
	
	/**
	 * [SMARTEDITORSUS-1594] ´ë»ó ³ëµå¸¦ ±âÁØÀ¸·Î ÇÏ¿©, nextSibling ¶Ç´Â previousSiblingÀ» Ã£´Â´Ù.
	 * nextSibling ¶Ç´Â previousSiblingÀÌ ¾ø´Ù¸é,
	 * ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¡¸é¼­ Ã¹ nextSibling ¶Ç´Â previousSiblingÀ» Ã£´Â´Ù.
	 * documentÀÇ body±îÁö ¿Ã¶ó°¡µµ nextSibling ¶Ç´Â previousSiblingÀÌ ³ªÅ¸³ªÁö ¾Ê´Â´Ù¸é
	 * Å½»ö ´ë»óÀ¸·Î nullÀ» ¹ÝÈ¯ÇÑ´Ù.
	 * @param {NodeElement} ´ë»ó ³ëµå (ÁÖÀÇ:NodeElement¿¡ ´ëÇÑ null Ã¼Å© ¾ÈÇÔ)
	 * @param {Boolean} »ý·«ÇÏ°Å³ª falseÀÌ¸é nextSiblingÀ» Ã£°í, trueÀÌ¸é previousSiblingÀ» Ã£´Â´Ù. 
	 * */
	_switchToSiblingOrNothing : function(targetElement, isPreviousOrdered){
		var el = targetElement;
		
		if(isPreviousOrdered){
			if(el.previousSibling){
				el = el.previousSibling;
			}else{
				// ÇüÁ¦°¡ ¾ø´Ù¸é ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¡¸é¼­ Å½»ö
				
				// ÀÌ ·çÇÁÀÇ Á¾·á Á¶°Ç
				// 1. ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¡´Ù°¡ elÀÌ document.body°¡ µÇ´Â ½ÃÁ¡
				// - ´õ ÀÌ»ó previousSiblingÀ» Å½»öÇÒ ¼ö ¾øÀ½
				// 2. elÀÌ ºÎ¸ð·Î ´ëÃ¼µÈ µÚ previousSiblingÀÌ Á¸ÀçÇÏ´Â °æ¿ì
				while(el.nodeName.toUpperCase() != "BODY" && !el.previousSibling){
					el = el.parentNode;
				}

				if(el.nodeName.toUpperCase() == "BODY"){
					el = null;
				}else{
					el = el.previousSibling;
				}
			}
		}else{
			if(el.nextSibling){
				el = el.nextSibling;
			}else{
				// ÇüÁ¦°¡ ¾ø´Ù¸é ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¡¸é¼­ Å½»ö
				
				// ÀÌ ·çÇÁÀÇ Á¾·á Á¶°Ç
				// 1. ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¡´Ù°¡ elÀÌ document.body°¡ µÇ´Â ½ÃÁ¡
				// - ´õ ÀÌ»ó nextSiblingÀ» Å½»öÇÒ ¼ö ¾øÀ½
				// 2. elÀÌ ºÎ¸ð·Î ´ëÃ¼µÈ µÚ nextSiblingÀÌ Á¸ÀçÇÏ´Â °æ¿ì
				while(el.nodeName.toUpperCase() != "BODY" && !el.nextSibling){
					el = el.parentNode;
				}

				if(el.nodeName.toUpperCase() == "BODY"){
					el = null;
				}else{
					el = el.nextSibling;
				}
			}
		}
		
		return el;
	},
	
	/**
	 * [SMARTEDITORSUS-1594] ´ë»ó ³ëµå¸¦ ±âÁØÀ¸·Î ÇÏ´Â Æ®¸®¸¦ ÀüÀ§¼øÈ¸¸¦ °ÅÃÄ, ÇÊÅÍ Á¶°Ç¿¡ ºÎÇÕÇÏ´Â Ã¹ ³ëµå¸¦ Ã£´Â´Ù.
	 * @param {NodeElement} Å½»öÇÏ·Á´Â Æ®¸®ÀÇ ·çÆ® ³ëµå
	 * @param {Function} ÇÊÅÍ Á¶°ÇÀ¸·Î »ç¿ëÇÒ ÇÔ¼ö
	 * @param {Boolean} »ý·«ÇÏ°Å³ª falseÀÌ¸é ¼ø¼ö ÀüÀ§¼øÈ¸(·çÆ® - ÁÂÃø - ¿ìÃø ¼ø)·Î Å½»öÇÏ°í, trueÀÌ¸é ¹Ý´ë ¹æÇâÀÇ ÀüÀ§¼øÈ¸(·çÆ® - ¿ìÃø - ÁÂÃø)·Î Å½»öÇÑ´Ù.
	 * */
	_recursivePreorderTraversalFilter : function(node, filterFunction, isReversed){
		var self = this;
		
		// ÇöÀç ³ëµå¸¦ ±âÁØÀ¸·Î ÇÊÅÍ¸µ
		var _bStopFindingNextElement = filterFunction.apply(node);
		
		if(_bStopFindingNextElement){
			// ÃÖÃÊ·Î Æ÷Ä¿½º ÅÂ±×¸¦ Ã£´Â´Ù¸é Å½»ö Áß´Ü¿ë flag º¯°æ
			self._bStopFindingNextElement = true;
			
			if(isReversed){
				self._previousFocusElement = node;
			}else{
				self._nextFocusElement = node;
			}

			return;
		}else{
			// ÇÊÅÍ¸µ Á¶°Ç¿¡ ºÎÇÕÇÏÁö ¾Ê´Â´Ù¸é, ÀÚ½ÄµéÀ» ±âÁØÀ¸·Î ¹Ýº¹ÇÏ°Ô µÈ´Ù.
			if(isReversed){
				for(var len = node.childNodes.length, i = len - 1; i >= 0; i--){
					self._recursivePreorderTraversalFilter(node.childNodes[i], filterFunction, true);
					if(!!this._bStopFindingNextElement){
						break;
					}
				}
			}else{
				for(var i=0, len = node.childNodes.length; i < len; i++){
					self._recursivePreorderTraversalFilter(node.childNodes[i], filterFunction);
					if(!!this._bStopFindingNextElement){
						break;
					}
				}
			}
		}
	},
	
	/**
	 * [SMARTEDITORSUS-1594] ÇÊÅÍ ÇÔ¼ö·Î, ÀÌ ³ëµå°¡ tab Å°·Î Æ÷Ä¿½º¸¦ ÀÌµ¿ÇÏ´Â ÅÂ±×¿¡ ÇØ´çÇÏ´ÂÁö È®ÀÎÇÑ´Ù.
	 * */
	_isFocusTag : function(){
		var self = this;
		
		// tab Å°·Î Æ÷Ä¿½º¸¦ Àâ¾ÆÁÖ´Â ÅÂ±× ¸ñ·Ï
		var aFocusTagViaTabKey = ["A", "BUTTON", "INPUT", "TEXTAREA"];
		
		// Æ÷Ä¿½º ÅÂ±×°¡ ÇöÀç ³ëµå¿¡ Á¸ÀçÇÏ´ÂÁö È®ÀÎÇÏ±â À§ÇÑ flag
		var bFocusTagExists = false;
		
		for(var i = 0, len = aFocusTagViaTabKey.length; i < len; i++){
			if(self.nodeType === 1 && self.nodeName && self.nodeName.toUpperCase() == aFocusTagViaTabKey[i] && !self.disabled && jindo.$Element(self).visible()){
				bFocusTagExists = true;
				break;
			}
		}
		
		return bFocusTagExists;
	},
	
	/**
	 * [SMARTEDITORSUS-1594]
	 * SE2M_Configuration_General¿¡¼­ Æ÷Ä¿½º¸¦ ÀÌµ¿ÇÒ ¿¡µðÅÍ ¿µ¿ª ÀÌÀüÀÇ ¿¤·¹¸ÕÆ®¸¦ ÁöÁ¤ÇØ µÎ¾ú´Ù¸é, ¼³Á¤°ªÀ» µû¸¥´Ù.
	 * ÁöÁ¤ÇÏÁö ¾Ê¾Ò°Å³ª ºó StringÀÌ¶ó¸é, elAppContainer¸¦ ±âÁØÀ¸·Î ÀÚµ¿ Å½»öÇÑ´Ù.
	 * */
	$ON_FOCUS_BEFORE_ELEMENT : function() {
		// Æ÷Ä¿½º Ä³½Ì
		this._currentPreviousFocusElement = null; // »õ·Î¿î Æ÷Ä¿½º ÀÌµ¿ÀÌ ¹ß»ýÇÒ ¶§¸¶´Ù Ä³½Ì ÃÊ±âÈ­
		
		if(this.htAccessOption.sBeforeElementId){
			this._currentPreviousFocusElement = document.getElementById(this.htAccessOption.sBeforeElementId);
		}else{
			this._currentPreviousFocusElement = this._findPreviousFocusElement(this.elAppContainer); // »ðÀÔµÉ ´ë»ó
		}
		
		if(this._currentPreviousFocusElement){
			window.focus(); // [SMARTEDITORSUS-1360] IE7¿¡¼­´Â element¿¡ ´ëÇÑ focus¸¦ ÁÖ±â À§ÇØ ¼±ÇàµÇ¾î¾ß ÇÑ´Ù.
			this._currentPreviousFocusElement.focus();
		}else if(parent && parent.nhn && parent.nhn.husky && parent.nhn.husky.EZCreator && parent.nhn.husky.EZCreator.elIFrame){
			parent.focus();
			if(this._currentPreviousFocusElement = this._findPreviousFocusElement(parent.nhn.husky.EZCreator.elIFrame)){
				this._currentPreviousFocusElement.focus();
			}
		}
	},
	
	/**
	 * [SMARTEDITORSUS-1594] DIV#smart_editor2 ÀÌÀü ¿ä¼Ò¿¡¼­ °¡Àå °¡±î¿î Æ÷Ä¿½º¿ë ÅÂ±×¸¦ Å½»ö
	 * */
	_findPreviousFocusElement : function(targetElement){
		var target = null;
		
		var el = targetElement.previousSibling;
		
		while(el){
			if(el.nodeType !== 1){  // Element Node¸¸À» ´ë»óÀ¸·Î ÇÑ´Ù. 
				// ´ë»ó ³ëµå ´ë½Å previousSiblingÀ» Ã£µÇ, ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¥ ¼öµµ ÀÖ´Ù.
				// document.body±îÁö °Å½½·¯ ¿Ã¶ó°¡°Ô µÇ¸é Å½»ö Á¾·á
				el = this._switchToSiblingOrNothing(el, /*isReversed*/true);
				if(!el){
					break;
				}else{
					continue;
				}
			}
			
			// ´ë»ó ³ëµå¸¦ ±âÁØÀ¸·Î, ¿ª ÀüÀ§¼øÈ¸·Î Á¶°Ç¿¡ ºÎÇÕÇÏ´Â ³ëµå Å½»ö
			this._recursivePreorderTraversalFilter(el, this._isFocusTag, true);
			
			if(this._previousFocusElement){
				target = this._previousFocusElement;
				
				// Å½»ö¿¡ »ç¿ëÇß´ø º¯¼ö ÃÊ±âÈ­
				this._bStopFindingNextElement = false;
				this._previousFocusElement = null;
				
				break;
			}else{
				// ´ë»ó ³ëµå ´ë½Å previousSiblingÀ» Ã£µÇ, ºÎ¸ð¸¦ °Å½½·¯ ¿Ã¶ó°¥ ¼öµµ ÀÖ´Ù.
				// document.body±îÁö °Å½½·¯ ¿Ã¶ó°¡°Ô µÇ¸é Å½»ö Á¾·á
				el = this._switchToSiblingOrNothing(el, /*isReversed*/true);
				if(!el){
					break;
				}
			}
		}
		
		// targetÀÌ Á¸ÀçÇÏÁö ¾ÊÀ¸¸é null ¹ÝÈ¯
		return target;
	},
	
	$ON_FOCUS_TOOLBAR_AREA : function(){
		this.oButton = jindo.$$.getSingle("BUTTON.se2_font_family", this.elAppContainer);
		if(this.oButton && !this.oButton.disabled){	// [SMARTEDITORSUS-1369] IE9ÀÌÇÏ¿¡¼­ disabled ¿ä¼Ò¿¡ Æ÷Ä¿½º¸¦ ÁÖ¸é ¿À·ù ¹ß»ý
			window.focus();
			this.oButton.focus();
		}
	},
	
	$ON_OPEN_HELP_POPUP : function() {
        this.oApp.exec("DISABLE_ALL_UI", [{aExceptions: ["se2_accessibility"]}]);
        this.oApp.exec("SHOW_EDITING_AREA_COVER");
        this.oApp.exec("SELECT_UI", ["se2_accessibility"]);

        //¾Æ·¡ ÄÚµå ¾ø¾î¾ß ºí·Î±×¿¡¼­µµ µ¿ÀÏÇÑ À§Ä¡¿¡ ÆË¾÷ ¶ä..
        //this.elHelpPopupLayer.style.top = this.nDefaultTop+"px";
        
        this.nCalcX = this.htTopLeftCorner.x + this.oApp.getEditingAreaWidth() - this.nLayerWidth;
        this.nCalcY = this.htTopLeftCorner.y - 30;	// ºí·Î±×¹öÀüÀÌ ¾Æ´Ñ °æ¿ì ¿¡µðÅÍ¿µ¿ªÀ» ¹þ¾î³ª´Â ¹®Á¦°¡ ÀÖ±â ¶§¹®¿¡ ±âº»Åø¹Ù(30px) Å©±â¸¸Å­ ¿Ã·ÁÁÜ 

        this.oApp.exec("SHOW_DIALOG_LAYER", [this.elHelpPopupLayer, {
                elHandle: this.elTitle,
                nMinX : this.htTopLeftCorner.x + 0,
                nMinY : this.nDefaultTop + 77,
                nMaxX : this.nCalcX,
                nMaxY : this.nCalcY
        }]);
	
        // offset (nTop:Numeric,  nLeft:Numeric)
        this.welHelpPopupLayer.offset(this.nCalcY, (this.nCalcX)/2); 
       
        //[SMARTEDITORSUS-1327] IE¿¡¼­ Æ÷Ä¿½º ÀÌ½´·Î IE¿¡ ´ëÇØ¼­¸¸ window.focus½ÇÇàÇÔ. 
        if(jindo.$Agent().navigator().ie) {
        	window.focus();
        }
        
		var self = this;
		setTimeout(function(){
			try{
				self.oCloseButton2.focus();
			}catch(e){
			}
		},200);
	},
	
	$ON_CLOSE_HELP_POPUP : function() {
		this.oApp.exec("ENABLE_ALL_UI");		// ¸ðµç UI È°¼ºÈ­.
		this.oApp.exec("DESELECT_UI", ["helpPopup"]);  
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER", []);
		this.oApp.exec("HIDE_EDITING_AREA_COVER");		// ÆíÁý ¿µ¿ª È°¼ºÈ­.
		
		this.oApp.exec("FOCUS");
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of changing the background color
 * @name hp_SE2M_BGColor.js
 */
nhn.husky.SE2M_BGColor = jindo.$Class({
	name : "SE2M_BGColor",
	rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,
	
	$init : function(elAppContainer){
		this._assignHTMLElements(elAppContainer);
	},
	
	_assignHTMLElements : function(elAppContainer){
		//@ec[
		this.elLastUsed = jindo.$$.getSingle("SPAN.husky_se2m_BGColor_lastUsed", elAppContainer);
	
		this.elDropdownLayer = jindo.$$.getSingle("DIV.husky_se2m_BGColor_layer", elAppContainer);
		this.elBGColorList = jindo.$$.getSingle("UL.husky_se2m_bgcolor_list", elAppContainer);
		this.elPaletteHolder = jindo.$$.getSingle("DIV.husky_se2m_BGColor_paletteHolder", this.elDropdownLayer);
		//@ec]

		this._setLastUsedBGColor("#777777");
	},
	
	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", ["getLastUsedBackgroundColor", jindo.$Fn(this.getLastUsedBGColor, this).bind()]);
  	},
	
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["BGColorA", "click", "APPLY_LAST_USED_BGCOLOR"]);
		this.oApp.exec("REGISTER_UI_EVENT", ["BGColorB", "click", "TOGGLE_BGCOLOR_LAYER"]);

		this.oApp.registerBrowserEvent(this.elBGColorList, "click", "EVENT_APPLY_BGCOLOR", []);
	},
	
	//@lazyload_js APPLY_LAST_USED_BGCOLOR,TOGGLE_BGCOLOR_LAYER[
	$ON_TOGGLE_BGCOLOR_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "BGCOLOR_LAYER_SHOWN", [], "BGCOLOR_LAYER_HIDDEN", []]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['bgcolor']);
	},
	
	$ON_BGCOLOR_LAYER_SHOWN : function(){
		this.oApp.exec("SELECT_UI", ["BGColorB"]);
		this.oApp.exec("SHOW_COLOR_PALETTE", ["APPLY_BGCOLOR", this.elPaletteHolder]);
	},

	$ON_BGCOLOR_LAYER_HIDDEN : function(){
		this.oApp.exec("DESELECT_UI", ["BGColorB"]);
		this.oApp.exec("RESET_COLOR_PALETTE", []);
	},

	$ON_EVENT_APPLY_BGCOLOR : function(weEvent){
		var elButton = weEvent.element;

		// Safari/Chrome/Opera may capture the event on Span
		while(elButton.tagName == "SPAN"){elButton = elButton.parentNode;}
		if(elButton.tagName != "BUTTON"){return;}

		var sBGColor, sFontColor;

		sBGColor = elButton.style.backgroundColor;
		sFontColor = elButton.style.color;

		this.oApp.exec("APPLY_BGCOLOR", [sBGColor, sFontColor]);
	},
	
	$ON_APPLY_LAST_USED_BGCOLOR : function(){
		this.oApp.exec("APPLY_BGCOLOR", [this.sLastUsedColor]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['bgcolor']);
	},

	$ON_APPLY_BGCOLOR : function(sBGColor, sFontColor){
		if(!this.rxColorPattern.test(sBGColor)){
			alert(this.oApp.$MSG("SE_Color.invalidColorCode"));
			return;
		}
		this._setLastUsedBGColor(sBGColor);

		var oStyle = {"backgroundColor": sBGColor};
		if(sFontColor){oStyle.color = sFontColor;}
		
		this.oApp.exec("SET_WYSIWYG_STYLE", [oStyle]);
		
		this.oApp.exec("HIDE_ACTIVE_LAYER");
	},
	//@lazyload_js]

	_setLastUsedBGColor : function(sBGColor){
		this.sLastUsedColor = sBGColor;
		this.elLastUsed.style.backgroundColor = this.sLastUsedColor;
	},
	
	getLastUsedBGColor : function(){
		return (!!this.sLastUsedColor) ? this.sLastUsedColor : '#777777';
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations directly related to the color palette
 * @name hp_SE2M_ColorPalette.js
 */
 nhn.husky.SE2M_ColorPalette = jindo.$Class({
	name : "SE2M_ColorPalette",
	elAppContainer : null,
	bUseRecentColor : false, 
	nLimitRecentColor : 17,
	rxRGBColorPattern : /rgb\((\d+), ?(\d+), ?(\d+)\)/i,
	rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,
	aRecentColor : [],	// ÃÖ±Ù »ç¿ëÇÑ »ö ¸ñ·Ï, °¡Àå ÃÖ±Ù¿¡ µî·ÏÇÑ »öÀÇ index°¡ °¡Àå ÀÛÀ½
	URL_COLOR_LIST : "",
	URL_COLOR_ADD : "",
	URL_COLOR_UPDATE : "",
	sRecentColorTemp : "<li><button type=\"button\" title=\"{RGB_CODE}\" style=\"background:{RGB_CODE}\"><span><span>{RGB_CODE}</span></span></button></li>",
	
	$init : function(elAppContainer){
	 	this.elAppContainer = elAppContainer;
	},
	
	$ON_MSG_APP_READY : function(){},
	
	_assignHTMLElements : function(oAppContainer){
		var htConfiguration = nhn.husky.SE2M_Configuration.SE2M_ColorPalette;
		if(htConfiguration){
			this.bUseRecentColor = htConfiguration.bUseRecentColor || false;
			this.URL_COLOR_ADD = htConfiguration.addColorURL || "http://api.se2.naver.com/1/colortable/TextAdd.nhn";
			this.URL_COLOR_UPDATE = htConfiguration.updateColorURL || "http://api.se2.naver.com/1/colortable/TextUpdate.nhn";
			this.URL_COLOR_LIST = htConfiguration.colorListURL || "http://api.se2.naver.com/1/colortable/TextList.nhn";
		}
		
		this.elColorPaletteLayer = jindo.$$.getSingle("DIV.husky_se2m_color_palette", oAppContainer);

		this.elColorPaletteLayerColorPicker = jindo.$$.getSingle("DIV.husky_se2m_color_palette_colorpicker", this.elColorPaletteLayer);
		this.elRecentColorForm = jindo.$$.getSingle("form", this.elColorPaletteLayerColorPicker);
		
		this.elBackgroundColor = jindo.$$.getSingle("ul.husky_se2m_bgcolor_list", oAppContainer);
		this.elInputColorCode = jindo.$$.getSingle("INPUT.husky_se2m_cp_colorcode", this.elColorPaletteLayerColorPicker);
		
		this.elPreview = jindo.$$.getSingle("SPAN.husky_se2m_cp_preview", this.elColorPaletteLayerColorPicker);
		this.elCP_ColPanel = jindo.$$.getSingle("DIV.husky_se2m_cp_colpanel", this.elColorPaletteLayerColorPicker);
		this.elCP_HuePanel = jindo.$$.getSingle("DIV.husky_se2m_cp_huepanel", this.elColorPaletteLayerColorPicker);

		this.elCP_ColPanel.style.position = "relative";
		this.elCP_HuePanel.style.position = "relative";

		this.elColorPaletteLayerColorPicker.style.display = "none";
		
		this.elMoreBtn = jindo.$$.getSingle("BUTTON.husky_se2m_color_palette_more_btn", this.elColorPaletteLayer);
		this.welMoreBtn = jindo.$Element(this.elMoreBtn);
		
		this.elOkBtn = jindo.$$.getSingle("BUTTON.husky_se2m_color_palette_ok_btn", this.elColorPaletteLayer);
		
		if(this.bUseRecentColor){
			this.elColorPaletteLayerRecent = jindo.$$.getSingle("DIV.husky_se2m_color_palette_recent", this.elColorPaletteLayer);
			this.elRecentColor = jindo.$$.getSingle("ul.se2_pick_color", this.elColorPaletteLayerRecent);
			this.elDummyNode = jindo.$$.getSingle("ul.se2_pick_color > li", this.elColorPaletteLayerRecent) || null;
			
			this.elColorPaletteLayerRecent.style.display = "none";
		}
	},
	
	$LOCAL_BEFORE_FIRST : function(){
		this._assignHTMLElements(this.elAppContainer);
		
		if(this.elDummyNode){
			jindo.$Element(jindo.$$.getSingle("ul.se2_pick_color > li", this.elColorPaletteLayerRecent)).leave();
		}

		if( this.bUseRecentColor ){
			this._ajaxRecentColor(this._ajaxRecentColorCallback);
		}
		
		this.oApp.registerBrowserEvent(this.elColorPaletteLayer, "click", "EVENT_CLICK_COLOR_PALETTE");
		this.oApp.registerBrowserEvent(this.elBackgroundColor, "mouseover", "EVENT_MOUSEOVER_COLOR_PALETTE");
		this.oApp.registerBrowserEvent(this.elColorPaletteLayer, "mouseover", "EVENT_MOUSEOVER_COLOR_PALETTE");
		this.oApp.registerBrowserEvent(this.elBackgroundColor, "mouseout", "EVENT_MOUSEOUT_COLOR_PALETTE");
		this.oApp.registerBrowserEvent(this.elColorPaletteLayer, "mouseout", "EVENT_MOUSEOUT_COLOR_PALETTE");
	},
	
	$ON_EVENT_MOUSEOVER_COLOR_PALETTE : function(oEvent){
		var elHovered = oEvent.element;
		while(elHovered && elHovered.tagName && elHovered.tagName.toLowerCase() != "li"){
			elHovered = elHovered.parentNode;
		}
		//Á¶°Ç Ãß°¡-by cielo 2010.04.20
		if(!elHovered || !elHovered.nodeType || elHovered.nodeType == 9){return;}
		if(elHovered.className == "" || (!elHovered.className) || typeof(elHovered.className) == 'undefined'){jindo.$Element(elHovered).addClass("hover");}
	},
	
	$ON_EVENT_MOUSEOUT_COLOR_PALETTE : function(oEvent){
		var elHovered = oEvent.element;
		
		while(elHovered && elHovered.tagName && elHovered.tagName.toLowerCase() != "li"){
			elHovered = elHovered.parentNode;
		}
		if(!elHovered){return;}
		if(elHovered.className == "hover"){jindo.$Element(elHovered).removeClass("hover");}
	},
	
	$ON_EVENT_CLICK_COLOR_PALETTE : function(oEvent){
		var elClicked = oEvent.element;
		
		while(elClicked.tagName == "SPAN"){elClicked = elClicked.parentNode;}
		
		if(elClicked.tagName && elClicked.tagName == "BUTTON"){
			if(elClicked == this.elMoreBtn){
				this.oApp.exec("TOGGLE_COLOR_PICKER");
				return;
			}
			
			this.oApp.exec("APPLY_COLOR", [elClicked]);
		}
	},
	
	$ON_APPLY_COLOR : function(elButton){
		var sColorCode = this.elInputColorCode.value,
			welColorParent = null;
		
		if(sColorCode.indexOf("#") == -1){
			sColorCode = "#" + sColorCode;
			this.elInputColorCode.value = sColorCode;
		}
		
		// ÀÔ·Â ¹öÆ°ÀÎ °æ¿ì
		if(elButton == this.elOkBtn){
			if(!this._verifyColorCode(sColorCode)){
				this.elInputColorCode.value = "";
				alert(this.oApp.$MSG("SE_Color.invalidColorCode"));
				this.elInputColorCode.focus();
				
				return;
			}
			
			this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [sColorCode,true]);
			
			return;
		}
		
		// »ö»ó ¹öÆ°ÀÎ °æ¿ì
		welColorParent = jindo.$Element(elButton.parentNode.parentNode.parentNode);
		sColorCode = elButton.title;
		
		if(welColorParent.hasClass("husky_se2m_color_palette")){				// ÅÛÇÃ¸´ »ö»ó Àû¿ë
			this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [sColorCode, nhn.husky.SE2M_Configuration.SE2M_ColorPalette.bAddRecentColorFromDefault]);
		}else if(welColorParent.hasClass("husky_se2m_color_palette_recent")){	// ÃÖ±Ù »ö»ó Àû¿ë
			this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [sColorCode,true]);
		}
	},
	
	$ON_RESET_COLOR_PALETTE : function(){
		this._initColor();
	},
	
	$ON_TOGGLE_COLOR_PICKER : function(){
		if(this.elColorPaletteLayerColorPicker.style.display == "none"){
			this.oApp.exec("SHOW_COLOR_PICKER");
		}else{
			this.oApp.exec("HIDE_COLOR_PICKER");
		}
	},
	
	$ON_SHOW_COLOR_PICKER : function(){
		this.elColorPaletteLayerColorPicker.style.display = "";

		this.cpp = new nhn.ColorPicker(this.elCP_ColPanel, {huePanel:this.elCP_HuePanel});
		var fn = jindo.$Fn(function(oEvent) {
			this.elPreview.style.backgroundColor = oEvent.hexColor;
			this.elInputColorCode.value = oEvent.hexColor;
		}, this).bind();
		this.cpp.attach("colorchange", fn);

		this.$ON_SHOW_COLOR_PICKER = this._showColorPickerMain;
		this.$ON_SHOW_COLOR_PICKER();
	},
		
	$ON_HIDE_COLOR_PICKER : function(){
		this.elColorPaletteLayerColorPicker.style.display = "none";
		this.welMoreBtn.addClass("se2_view_more");
		this.welMoreBtn.removeClass("se2_view_more2");
	},
	
	$ON_SHOW_COLOR_PALETTE : function(sCallbackCmd, oLayerContainer){
		this.sCallbackCmd = sCallbackCmd;
		this.oLayerContainer = oLayerContainer;

		this.oLayerContainer.insertBefore(this.elColorPaletteLayer, null);

		this.elColorPaletteLayer.style.display = "block";
		
		this.oApp.delayedExec("POSITION_TOOLBAR_LAYER", [this.elColorPaletteLayer.parentNode.parentNode], 0);
	},

	$ON_HIDE_COLOR_PALETTE : function(){
		this.elColorPaletteLayer.style.display = "none";
	},
	
	$ON_COLOR_PALETTE_APPLY_COLOR : function(sColorCode , bAddRecentColor){
		bAddRecentColor = (!bAddRecentColor)? false : bAddRecentColor;
		sColorCode = this._getHexColorCode(sColorCode);
		
		//´õº¸±â ·¹ÀÌ¾î¿¡¼­ Àû¿ëÇÑ »ö»ó¸¸ ÃÖ±Ù »ç¿ëÇÑ »ö¿¡ Ãß°¡ÇÑ´Ù. 
		if( this.bUseRecentColor && !!bAddRecentColor ){
			this.oApp.exec("ADD_RECENT_COLOR", [sColorCode]);
		}
		this.oApp.exec(this.sCallbackCmd, [sColorCode]);
	},

	$ON_EVENT_MOUSEUP_COLOR_PALETTE : function(oEvent){
		var elButton = oEvent.element;
		if(! elButton.style.backgroundColor){return;}
		
		this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [elButton.style.backgroundColor,false]);
	},
	
	$ON_ADD_RECENT_COLOR : function(sRGBCode){
		var bAdd = (this.aRecentColor.length === 0);
		
		this._addRecentColor(sRGBCode);
		
		if(bAdd){
			this._ajaxAddColor();
		}else{
			this._ajaxUpdateColor();
		}
				
		this._redrawRecentColorElement();
	},
	
	_verifyColorCode : function(sColorCode){
		return this.rxColorPattern.test(sColorCode);
	},
	
	_getHexColorCode : function(sColorCode){
		if(this.rxRGBColorPattern.test(sColorCode)){
			var dec2Hex = function(sDec){
				var sTmp = parseInt(sDec, 10).toString(16);
				if(sTmp.length<2){sTmp = "0"+sTmp;}
				return sTmp.toUpperCase();
			};
			
			var sR = dec2Hex(RegExp.$1);
			var sG = dec2Hex(RegExp.$2);
			var sB = dec2Hex(RegExp.$3);
			sColorCode = "#"+sR+sG+sB;
		}
		
		return sColorCode;
	},
	
	_addRecentColor : function(sRGBCode){
		var waRecentColor = jindo.$A(this.aRecentColor);
				
		waRecentColor = waRecentColor.refuse(sRGBCode);
		waRecentColor.unshift(sRGBCode);
		
		if(waRecentColor.length() > this.nLimitRecentColor){
			waRecentColor.length(this.nLimitRecentColor);
		}
		
		this.aRecentColor = waRecentColor.$value();
	},
	
	_redrawRecentColorElement : function(){
		var aRecentColorHtml = [],
			nRecentColor = this.aRecentColor.length,
			i;
		
		if(nRecentColor === 0){
			return;
		}
		
		for(i=0; i<nRecentColor; i++){
			aRecentColorHtml.push(this.sRecentColorTemp.replace(/\{RGB_CODE\}/gi, this.aRecentColor[i]));
		}
		
		this.elRecentColor.innerHTML = aRecentColorHtml.join("");
		
		this.elColorPaletteLayerRecent.style.display = "block";
	},
	
	_ajaxAddColor : function(){		
		jindo.$Ajax(this.URL_COLOR_ADD, {
			type : "jsonp",
			onload: function(){}
		}).request({
			text_key : "colortable",
			text_data : this.aRecentColor.join(",")
		});
	},
	
	_ajaxUpdateColor : function(){		
		jindo.$Ajax(this.URL_COLOR_UPDATE, {
			type : "jsonp",
			onload: function(){}
		}).request({
			text_key : "colortable",
			text_data : this.aRecentColor.join(",")
		});
	},

	_showColorPickerMain : function(){
		this._initColor();
		this.elColorPaletteLayerColorPicker.style.display = "";
		this.welMoreBtn.removeClass("se2_view_more");
		this.welMoreBtn.addClass("se2_view_more2");
	},
	
	_initColor : function(){
		if(this.cpp){this.cpp.rgb({r:0,g:0,b:0});}
		this.elPreview.style.backgroundColor = '#'+'000000';
		this.elInputColorCode.value = '#'+'000000';
		this.oApp.exec("HIDE_COLOR_PICKER");
	},
	
	_ajaxRecentColor : function(fCallback){
		jindo.$Ajax(this.URL_COLOR_LIST, {
			type : "jsonp",
			onload : jindo.$Fn(fCallback, this).bind()
		}).request();
	},

	_ajaxRecentColorCallback : function(htResponse){
		var aColorList = htResponse.json()["result"],
			waColorList,
			i, nLen;
			
		if(!aColorList || !!aColorList.error){
			return;
		}
		
		waColorList = jindo.$A(aColorList).filter(this._verifyColorCode, this);
		
		if(waColorList.length() > this.nLimitRecentColor){
			waColorList.length(this.nLimitRecentColor);
		}
		
		aColorList = waColorList.reverse().$value();

		for(i = 0, nLen = aColorList.length; i < nLen; i++){
			this._addRecentColor(this._getHexColorCode(aColorList[i]));
		}
		
		this._redrawRecentColorElement();
	}
}).extend(jindo.Component);
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the basic editor commands
 * @name hp_SE_ExecCommand.js
 */
nhn.husky.SE2M_ExecCommand = jindo.$Class({
	name : "SE2M_ExecCommand",
	oEditingArea : null,
	oUndoOption : null,
	_rxTable : /^(TBODY|TR|TD)$/i,

	$init : function(oEditingArea){
		this.oEditingArea = oEditingArea;
		this.nIndentSpacing = 40;
		
		this.rxClickCr = new RegExp('^bold|underline|italic|strikethrough|justifyleft|justifycenter|justifyright|justifyfull|insertorderedlist|insertunorderedlist|outdent|indent$', 'i');
	},

	$BEFORE_MSG_APP_READY : function(){
		// the right document will be available only when the src is completely loaded
		if(this.oEditingArea && this.oEditingArea.tagName == "IFRAME"){
			this.oEditingArea = this.oEditingArea.contentWindow.document;
		}
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+b", "EXECCOMMAND", ["bold", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+u", "EXECCOMMAND", ["underline", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+i", "EXECCOMMAND", ["italic", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+d", "EXECCOMMAND", ["strikethrough", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["meta+b", "EXECCOMMAND", ["bold", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["meta+u", "EXECCOMMAND", ["underline", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["meta+i", "EXECCOMMAND", ["italic", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["meta+d", "EXECCOMMAND", ["strikethrough", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["tab", "INDENT"]);
		this.oApp.exec("REGISTER_HOTKEY", ["shift+tab", "OUTDENT"]);
		//this.oApp.exec("REGISTER_HOTKEY", ["tab", "EXECCOMMAND", ["indent", false, false]]);
		//this.oApp.exec("REGISTER_HOTKEY", ["shift+tab", "EXECCOMMAND", ["outdent", false, false]]);

		this.oApp.exec("REGISTER_UI_EVENT", ["bold", "click", "EXECCOMMAND", ["bold", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["underline", "click", "EXECCOMMAND", ["underline", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["italic", "click", "EXECCOMMAND", ["italic", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["lineThrough", "click", "EXECCOMMAND", ["strikethrough", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["superscript", "click", "EXECCOMMAND", ["superscript", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["subscript", "click", "EXECCOMMAND", ["subscript", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifyleft", "click", "EXECCOMMAND", ["justifyleft", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifycenter", "click", "EXECCOMMAND", ["justifycenter", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifyright", "click", "EXECCOMMAND", ["justifyright", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifyfull", "click", "EXECCOMMAND", ["justifyfull", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["orderedlist", "click", "EXECCOMMAND", ["insertorderedlist", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["unorderedlist", "click", "EXECCOMMAND", ["insertunorderedlist", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["outdent", "click", "EXECCOMMAND", ["outdent", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["indent", "click", "EXECCOMMAND", ["indent", false, false]]);

//		this.oApp.exec("REGISTER_UI_EVENT", ["styleRemover", "click", "EXECCOMMAND", ["RemoveFormat", false, false]]);

		this.oNavigator = jindo.$Agent().navigator();
		
		if(!this.oNavigator.safari && !this.oNavigator.chrome){
			this._getDocumentBR = function(){};
			this._fixDocumentBR	= function(){};
		}
		
		if(!this.oNavigator.ie){
			this._fixCorruptedBlockQuote = function(){};
			
			if(!this.oNavigator.chrome){
				this._insertBlankLine = function(){};
			}
		}
		
		if(!this.oNavigator.firefox){
			this._extendBlock = function(){};
		}
	},

	$ON_INDENT : function(){
		this.oApp.delayedExec("EXECCOMMAND", ["indent", false, false], 0);
	},
	
	$ON_OUTDENT : function(){
		this.oApp.delayedExec("EXECCOMMAND", ["outdent", false, false], 0);
	},

	/**
	 * TBODY, TR, TD »çÀÌ¿¡ ÀÖ´Â ÅØ½ºÆ®³ëµåÀÎÁö ÆÇº°ÇÑ´Ù.
	 * @param oNode {Node} °Ë»çÇÒ ³ëµå
	 * @return {Boolean} TBODY, TR, TD »çÀÌ¿¡ ÀÖ´Â ÅØ½ºÆ®³ëµåÀÎÁö ¿©ºÎ
	 */
	_isTextBetweenTable : function(oNode){
		var oTmpNode;
		if(oNode && oNode.nodeType === 3){	// ÅØ½ºÆ® ³ëµå
			if((oTmpNode = oNode.previousSibling) && oTmpNode.nodeName.match(this._rxTable)){
				return true;
			}
			if((oTmpNode = oNode.nextSibling) && oTmpNode.nodeName.match(this._rxTable)){
				return true;
			}
		}
		return false;
	},

	$BEFORE_EXECCOMMAND : function(sCommand, bUserInterface, vValue, htOptions){
		var elTmp, oSelection;
		
		//º»¹®¿¡ ÀüÇô Å¬¸¯ÀÌ ÇÑ¹øµµ ¾È ÀÏ¾î³­ »óÅÂ¿¡¼­ Å©·Ò°ú IE¿¡¼­ EXECCOMMAND°¡ Á¤»óÀûÀ¸·Î ¾È ¸ÔÈ÷´Â Çö»ó. 
		this.oApp.exec("FOCUS");
		this._bOnlyCursorChanged = false;
		oSelection = this.oApp.getSelection();
		// [SMARTEDITORSUS-1584] IE¿¡¼­ Å×ÀÌºí°ü·Ã ÅÂ±× »çÀÌÀÇ ÅØ½ºÆ®³ëµå°¡ Æ÷ÇÔµÈ Ã¤·Î execCommand °¡ ½ÇÇàµÇ¸é 
		// Å×ÀÌºí ÅÂ±×µé »çÀÌ¿¡ ´õ¹Ì P ÅÂ±×°¡ Ãß°¡µÈ´Ù. 
		// Å×ÀÌºí°ü·Ã ÅÂ±× »çÀÌ¿¡ ÅÂ±×°¡ ÀÖÀ¸¸é ¹®¹ý¿¡ ¾î±ß³ª±â ¶§¹®¿¡ getContents ½Ã ÀÌ ´õ¹Ì P ÅÂ±×µéÀÌ ¹ÛÀ¸·Î ºüÁ®³ª°¡°Ô µÈ´Ù.
		// ¶§¹®¿¡ execCommand ½ÇÇàµÇ±â Àü¿¡ ¼¿·º¼Ç¿¡ Å×ÀÌºí°ü·Ã ÅÂ±× »çÀÌÀÇ ÅØ½ºÆ®³ëµå¸¦ Ã£¾Æ³» Áö¿öÁØ´Ù.
		for(var i = 0, aNodes = oSelection.getNodes(), oNode;oNode = aNodes[i]; i++){
			if(this._isTextBetweenTable(oNode)){
				// TODO: ³ëµå¸¦ »èÁ¦ÇÏÁö ¾Ê°í Selection ¿¡¼­¸¸ »¬¼ö ÀÖ´Â ¹æ¹ýÀº ¾øÀ»±î?
				oNode.parentNode.removeChild(oNode);
			}
		}

		if(/^insertorderedlist|insertunorderedlist$/i.test(sCommand)){
			this._getDocumentBR();
		}
		
		if(/^justify*/i.test(sCommand)){
			this._removeSpanAlign();
		}
		
		if(sCommand.match(/^bold|underline|italic|strikethrough|superscript|subscript$/i)){
			this.oUndoOption = {bMustBlockElement:true};
			
			if( nhn.CurrentSelection.isCollapsed()){
				this._bOnlyCursorChanged = true;

				//[SMARTEDITORSUS-228] ±Û²Ã È¿°ú¸¦ ¹Ì¸® ÁöÁ¤ ÇÑ ÈÄ¿¡ ÅØ½ºÆ® ÀÔ·Â ½Ã, »ö»ó º¯°æÀº Àû¿ëµÇ³ª ±½°Ô ±â¿ïÀÓ ¹ØÁÙ Ãë¼Ò¼± µîÀÇ È¿°ú´Â Àû¿ë¾ÈµÊ
				if( this.oNavigator.ie ){
					if(oSelection.startContainer.tagName == "BODY" && oSelection.startOffset === 0){
						elTmp = this.oApp.getWYSIWYGDocument().createElement("SPAN");					
						elTmp.innerHTML = unescape("%uFEFF");
						oSelection.insertNode(elTmp);
						oSelection.select();	
					}
				}
			}			
		}

		if(sCommand == "indent" || sCommand == "outdent"){
			if(!htOptions){htOptions = {};}
			htOptions["bDontAddUndoHistory"] = true;
		}
		if((!htOptions || !htOptions["bDontAddUndoHistory"]) && !this._bOnlyCursorChanged){
			if(/^justify*/i.test(sCommand)){
				this.oUndoOption = {sSaveTarget:"BODY"};
			}else if(sCommand === "insertorderedlist" || sCommand === "insertunorderedlist"){
				this.oUndoOption = {bMustBlockContainer:true};
			}
			
			this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [sCommand, this.oUndoOption]);
		}
		if(this.oNavigator.ie && this.oApp.getWYSIWYGDocument().selection){
			if(this.oApp.getWYSIWYGDocument().selection.type === "Control"){
				oSelection = this.oApp.getSelection();
				oSelection.select();
			}
		}
		
		if(sCommand == "insertorderedlist" || sCommand == "insertunorderedlist"){
			this._insertBlankLine();
		}
	},

	$ON_EXECCOMMAND : function(sCommand, bUserInterface, vValue){
		var bSelectedBlock = false;
		var htSelectedTDs = {};
		var oSelection = this.oApp.getSelection();
				
		bUserInterface = (bUserInterface == "" || bUserInterface)?bUserInterface:false;
		vValue = (vValue == "" || vValue)?vValue:false;
		
		this.oApp.exec("IS_SELECTED_TD_BLOCK",['bIsSelectedTd',htSelectedTDs]);
		bSelectedBlock = htSelectedTDs.bIsSelectedTd;

		if( bSelectedBlock){
			if(sCommand == "indent"){
				this.oApp.exec("SET_LINE_BLOCK_STYLE", [null, jindo.$Fn(this._indentMargin, this).bind()]);
			}else if(sCommand == "outdent"){
				this.oApp.exec("SET_LINE_BLOCK_STYLE", [null, jindo.$Fn(this._outdentMargin, this).bind()]);
			}else{ 
				this._setBlockExecCommand(sCommand, bUserInterface, vValue);
			}
		} else {
			switch(sCommand){
			case "indent":
			case "outdent":
            	this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [sCommand]);
            	
				// bookmark ¼³Á¤
				var sBookmark = oSelection.placeStringBookmark();				

				if(sCommand === "indent"){
					this.oApp.exec("SET_LINE_STYLE", [null, jindo.$Fn(this._indentMargin, this).bind(), {bDoNotSelect : true, bDontAddUndoHistory : true}]);
				}else{
					this.oApp.exec("SET_LINE_STYLE", [null, jindo.$Fn(this._outdentMargin, this).bind(), {bDoNotSelect : true, bDontAddUndoHistory : true}]);
				}
		
				oSelection.moveToStringBookmark(sBookmark);
				oSelection.select();
				oSelection.removeStringBookmark(sBookmark); //bookmark »èÁ¦
						
                setTimeout(jindo.$Fn(function(sCommand){
                	this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [sCommand]);	
                }, this).bind(sCommand), 25);

				break;
			
			case "justifyleft":
			case "justifycenter":
			case "justifyright":
			case "justifyfull":
				var oSelectionClone = this._extendBlock();	// FF

				this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
				
				if(!!oSelectionClone){
					oSelectionClone.select();
				}
				
				break;
				
			default:
				// [SMARTEDITORSUS-1143] IE9, IE10¿¡ Á¸ÀçÇÏ´Â 'ºó ÅØ½ºÆ® ³ëµå'¿¡µµ ÆùÆ® ½ºÅ¸ÀÏÀÌ Àû¿ëµÇ¸é ·¹ÀÌ¾Æ¿ôÀÌ ±úÁö´Â ¹®Á¦°¡ ¹ß»ý 
				// jindo.$Element#child ´Â ºó ÅØ½ºÆ® ³ëµå¸¦ °¡Á®¿ÀÁö ¾Ê±â ¶§¹®¿¡ HuskyRange ¸Þ¼­µå·Î Ã³¸®
				if(this.oNavigator.ie && this.oNavigator.nativeVersion > 8){
					var welBody = $Element(this.oEditingArea.body);
					var elEmptyTextNode = welBody.$value().previousSibling;
					
					// ºó ÅØ½ºÆ® ³ëµå¸¦ °É·¯³»±â À§ÇÑ ÆÐÅÏ
					var whiteSpaceStartPattern = /^\s/;
					var nonEmptyTextPattern = /\S/g;
					
					var oSelection = this.oApp.getSelection();
//					var oIESelection = this.oEditingArea.selection.createRange();
					
					if(oSelection == ""){
						this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
					}else{
						// ¿ì¼± ÆùÆ® ½ºÅ¸ÀÏÀ» Àû¿ë ÈÄ, 'ºó ÅØ½ºÆ® ³ëµå' Ã³¸®
						this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
						
						var aNode = oSelection.getNodes();
						var aStyleTag = ["STRONG", "U", "EM", "STRIKE"];
						
						if(aNode.length > 0){
							for(index in aNode){
								var elChildNode = aNode[index];
								
								// selection ¿¡ Æ÷ÇÔµÈ 'ºó ÅØ½ºÆ® ³ëµå' ¿¡µµ Àû¿ëµÇ¾î ¹ö¸° ÆùÆ® ½ºÅ¸ÀÏÀ» Á¦°ÅÇÑ´Ù.
								if((whiteSpaceStartPattern.test(elChildNode.nodeValue)) && (!nonEmptyTextPattern.test(elChildNode.nodeValue)) && (elChildNode.nodeType == 3)){ // ºó ÅØ½ºÆ® ³ëµå
									var elChildNodeClone = elChildNode.cloneNode();
									
									// ÆùÆ® ½ºÅ¸ÀÏÀÌ Àû¿ëµÇ¸é, ÇØ´ç ½ºÅ¸ÀÏ ÅÂ±×°¡ 'ºó ÅØ½ºÆ® ³ëµå'¸¦ ºÎ¸ð·Î¼­ °¨½Î°í ÀÖ´Ù.
									var elParentNode = elChildNode.parentNode;
									
									for(index in aStyleTag){
										if(elParentNode.tagName == aStyleTag[index]){
											elParentNode.removeChild(elChildNode);
											
											var elGrandparentNode = elParentNode.parentNode;
											
											// insertAfter()
											if(elGrandparentNode.lastChild == elParentNode){
												elGrandparentNode.appendChild(elChildNodeClone);
											}else{
												elGrandparentNode.insertBefore(elChildNodeClone, elParentNode.nextSibling);
											}
											
											if(elParentNode.childNodes.length == 0){
												elGrandparentNode.removeChild(elParentNode);
											}
										}
									}
								}
							}
						}
					}
				}else{
					this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
				}
				// --[SMARTEDITORSUS-1143]
				
				//if(this.oNavigator.firefox){
					//this.oEditingArea.execCommand("styleWithCSS", bUserInterface, false);
				//}
				// [SMARTEDITORSUS-1143] IE9, IE10¿¡ Á¸ÀçÇÏ´Â 'ºó ÅØ½ºÆ® ³ëµå' °ü·Ã ÀÌ½´·Î ºÐ±âÃ³¸® 
				//this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
				// --[SMARTEDITORSUS-1143]
			}
		}

		this._countClickCr(sCommand);
	},

	$AFTER_EXECCOMMAND : function(sCommand, bUserInterface, vValue, htOptions){
		if(this.elP1 && this.elP1.parentNode){
			this.elP1.parentNode.removeChild(this.elP1);
		}

		if(this.elP2 && this.elP2.parentNode){
			this.elP2.parentNode.removeChild(this.elP2);
		}
		
		if(/^insertorderedlist|insertunorderedlist$/i.test(sCommand)){
			// this._fixDocumentBR();	// Chrome/Safari
			this._fixCorruptedBlockQuote(sCommand === "insertorderedlist" ? "OL" : "UL");	// IE
		}
		
		if((/^justify*/i.test(sCommand))){
			this._fixAlign(sCommand === "justifyfull" ? "justify" : sCommand.substring(7));
		}

		if(sCommand == "indent" || sCommand == "outdent"){
			if(!htOptions){htOptions = {};}
			htOptions["bDontAddUndoHistory"] = true;
		}
		
		if((!htOptions || !htOptions["bDontAddUndoHistory"]) && !this._bOnlyCursorChanged){
			this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [sCommand, this.oUndoOption]);
		}

		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},
		
	_removeSpanAlign : function(){
		var oSelection = this.oApp.getSelection(),
			aNodes = oSelection.getNodes(),
			elNode = null;
			
		for(var i=0, nLen=aNodes.length; i<nLen; i++){
			elNode = aNodes[i];
			
			// [SMARTEDITORSUS-704] SPAN¿¡¼­ Àû¿ëµÈ AlignÀ» Á¦°Å
			if(elNode.tagName && elNode.tagName === "SPAN"){
				elNode.style.textAlign = "";
				elNode.removeAttribute("align");
			}
		}
	},
	
	// [SMARTEDITORSUS-851] align, text-alignÀ» fixÇØ¾ß ÇÒ ´ë»ó ³ëµå¸¦ Ã£À½
	_getAlignNode : function(elNode){
		if(elNode.tagName && (elNode.tagName === "P" || elNode.tagName === "DIV")){
			return elNode;
		}
		
		elNode = elNode.parentNode;
		
		while(elNode && elNode.tagName){
			if(elNode.tagName === "P" || elNode.tagName === "DIV"){
				return elNode;
			}
			
			elNode = elNode.parentNode;
		}
	},
	
	_fixAlign : function(sAlign){
		var oSelection = this.oApp.getSelection(),
			aNodes = [],
			elNode = null,
			elParentNode = null;
			
		var removeTableAlign = !this.oNavigator.ie ? function(){} : function(elNode){
			if(elNode.tagName && elNode.tagName === "TABLE"){
				elNode.removeAttribute("align");
				
				return true;
			}
			
			return false;
		};
		
		if(oSelection.collapsed){
			aNodes[0] = oSelection.startContainer;	// collapsedÀÎ °æ¿ì¿¡´Â getNodesÀÇ °á°ú´Â []
		}else{
			aNodes = oSelection.getNodes();
		}
		
		for(var i=0, nLen=aNodes.length; i<nLen; i++){
			elNode = aNodes[i];
			
			if(elNode.nodeType === 3){
				elNode = elNode.parentNode;
			}
			
			if(elParentNode && (elNode === elParentNode || jindo.$Element(elNode).isChildOf(elParentNode))){
				continue;
			}
			
			elParentNode = this._getAlignNode(elNode);
			
			if(elParentNode && elParentNode.align !== elParentNode.style.textAlign){ // [SMARTEDITORSUS-704] align ¼Ó¼º°ú text-align ¼Ó¼ºÀÇ °ªÀ» ¸ÂÃçÁÜ
				elParentNode.style.textAlign = sAlign;
				elParentNode.setAttribute("align", sAlign);
			}
		}
	},
	
	_getDocumentBR : function(){
		var i, nLen;
		
		// [COM-715] <Chrome/Safari> ¿ä¾à±Û »ðÀÔ > ´õº¸±â ¿µ¿ª¿¡¼­ ±âÈ£¸Å±â±â, ¹øÈ£¸Å±â±â ¼³Á¤ÇÒ¶§¸¶´Ù ¿ä¾à±Û ¹Ú½º°¡ ¾Æ·¡·Î ÀÌµ¿µÊ
		// ExecCommand¸¦ Ã³¸®ÇÏ±â Àü¿¡ ÇöÀçÀÇ BRÀ» ÀúÀå
		
		this.aBRs = this.oApp.getWYSIWYGDocument().getElementsByTagName("BR");
		this.aBeforeBRs = [];
		
		for(i=0, nLen=this.aBRs.length; i<nLen; i++){
			this.aBeforeBRs[i] = this.aBRs[i];
		}
	},
	
	_fixDocumentBR : function(){
		// [COM-715] ExecCommand°¡ Ã³¸®µÈ ÈÄ¿¡ ¾÷µ¥ÀÌÆ®µÈ BRÀ» Ã³¸® Àü¿¡ ÀúÀåÇÑ BR°ú ºñ±³ÇÏ¿© »ý¼ºµÈ BRÀ» Á¦°Å
		
		if(this.aBeforeBRs.length === this.aBRs.length){	// this.aBRs gets updated automatically when the document is updated
			return;
		}
		
		var waBeforeBRs = jindo.$A(this.aBeforeBRs),
			i, iLen = this.aBRs.length;
		
		for(i=iLen-1; i>=0; i--){
			if(waBeforeBRs.indexOf(this.aBRs[i])<0){
				this.aBRs[i].parentNode.removeChild(this.aBRs[i]);
			}
		}
	},
	
	_setBlockExecCommand : function(sCommand, bUserInterface, vValue){
		var aNodes, aChildrenNode, htSelectedTDs = {};
		this.oSelection = this.oApp.getSelection();
		this.oApp.exec("GET_SELECTED_TD_BLOCK",['aTdCells',htSelectedTDs]);
		aNodes = htSelectedTDs.aTdCells;

		for( var j = 0; j < aNodes.length ; j++){
			
			this.oSelection.selectNodeContents(aNodes[j]);
			this.oSelection.select();
			
			if(this.oNavigator.firefox){
				this.oEditingArea.execCommand("styleWithCSS", bUserInterface, false); //styleWithCSS´Â ffÀü¿ëÀÓ.
			}
			
			aChildrenNode = this.oSelection.getNodes();
			for( var k = 0; k < aChildrenNode.length ; k++ ) {
				if(aChildrenNode[k].tagName == "UL" || aChildrenNode[k].tagName == "OL" ){
					jindo.$Element(aChildrenNode[k]).css("color",vValue);
				}
			}			
			this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
		}
	},
	
	_indentMargin : function(elDiv){
		var elTmp = elDiv,
			aAppend, i, nLen, elInsertTarget, elDeleteTarget, nCurMarginLeft;
		
		while(elTmp){
			if(elTmp.tagName && elTmp.tagName === "LI"){
				elDiv = elTmp;
				break;
			}
			elTmp = elTmp.parentNode;
		}
		
		if(elDiv.tagName === "LI"){
			//<OL>
			//	<OL>
			// 		<LI>22</LI>
			//	</OL>
			//	<LI>33</LI>
			//</OL>
			//¿Í °°Àº ÇüÅÂ¶ó¸é 33À» µé¿©¾²±â ÇßÀ» ¶§, »ó´ÜÀÇ silbling OL°ú ÇÕÃÄ¼­ ¾Æ·¡¿Í °°ÀÌ ¸¸µé¾î ÁÜ.
			//<OL>
			//	<OL>
			// 		<LI>22</LI>
			//		<LI>33</LI>
			//	</OL>
			//</OL>
			if(elDiv.previousSibling && elDiv.previousSibling.tagName && elDiv.previousSibling.tagName === elDiv.parentNode.tagName){
				// ÇÏ´Ü¿¡ ¶Ç´Ù¸¥ OLÀÌ ÀÖ¾î ¾Æ·¡¿Í °°Àº ÇüÅÂ¶ó¸é,
				//<OL>
				//	<OL>
				// 		<LI>22</LI>
				//	</OL>
				//	<LI>33</LI>
				//	<OL>
				// 		<LI>44</LI>
				//	</OL>
				//</OL>
				//22,33,44¸¦ ÇÕÃÄ¼­ ¾Æ·¡¿Í °°ÀÌ ¸¸µé¾î ÁÜ.
				//<OL>
				//	<OL>
				// 		<LI>22</LI>
				//		<LI>33</LI>
				// 		<LI>44</LI>
				//	</OL>
				//</OL>
				if(elDiv.nextSibling && elDiv.nextSibling.tagName && elDiv.nextSibling.tagName === elDiv.parentNode.tagName){
					aAppend = [elDiv];
					
					for(i=0, nLen=elDiv.nextSibling.childNodes.length; i<nLen; i++){
						aAppend.push(elDiv.nextSibling.childNodes[i]);
					}
					
					elInsertTarget = elDiv.previousSibling;
					elDeleteTarget = elDiv.nextSibling;
					
					for(i=0, nLen=aAppend.length; i<nLen; i++){
						elInsertTarget.insertBefore(aAppend[i], null);
					}
					
					elDeleteTarget.parentNode.removeChild(elDeleteTarget);
				}else{
					elDiv.previousSibling.insertBefore(elDiv, null);
				}

				return;
			}
			
			//<OL>
			//	<LI>22</LI>
			//	<OL>
			// 		<LI>33</LI>
			//	</OL>
			//</OL>
			//¿Í °°Àº ÇüÅÂ¶ó¸é 22À» µé¿©¾²±â ÇßÀ» ¶§, ÇÏ´ÜÀÇ silbling OL°ú ÇÕÄ£´Ù.
			if(elDiv.nextSibling && elDiv.nextSibling.tagName && elDiv.nextSibling.tagName === elDiv.parentNode.tagName){
				elDiv.nextSibling.insertBefore(elDiv, elDiv.nextSibling.firstChild);
				return;
			}
			
			elTmp = elDiv.parentNode.cloneNode(false);
			elDiv.parentNode.insertBefore(elTmp, elDiv);
			elTmp.appendChild(elDiv);
			return;
		}
		
		nCurMarginLeft = parseInt(elDiv.style.marginLeft, 10);
		
		if(!nCurMarginLeft){
			nCurMarginLeft = 0;
		}

		nCurMarginLeft += this.nIndentSpacing;
		elDiv.style.marginLeft = nCurMarginLeft+"px";
	},
	
	_outdentMargin : function(elDiv){
		var elTmp = elDiv,
			elParentNode, elInsertBefore, elNewParent, elInsertParent, oDoc, nCurMarginLeft;
		
		while(elTmp){
			if(elTmp.tagName && elTmp.tagName === "LI"){
				elDiv = elTmp;
				break;
			}
			elTmp = elTmp.parentNode;
		}
		
		if(elDiv.tagName === "LI"){
			elParentNode = elDiv.parentNode;
			elInsertBefore = elDiv.parentNode;
			
			// LI¸¦ ÀûÀý À§Ä¡·Î ÀÌµ¿.
			// À§¿¡ ´Ù¸¥ li/ol/ul°¡ ÀÖ´Â°¡?
			if(elDiv.previousSibling && elDiv.previousSibling.tagName && elDiv.previousSibling.tagName.match(/LI|UL|OL/)){
				// À§¾Æ·¡·Î sibling li/ol/ul°¡ ÀÖ´Ù¸é ol/ul¸¦ 2°³·Î ³ª´©¾î¾ßµÊ
				if(elDiv.nextSibling && elDiv.nextSibling.tagName && elDiv.nextSibling.tagName.match(/LI|UL|OL/)){
					elNewParent = elParentNode.cloneNode(false);
					
					while(elDiv.nextSibling){
						elNewParent.insertBefore(elDiv.nextSibling, null);
					}
					
					elParentNode.parentNode.insertBefore(elNewParent, elParentNode.nextSibling);
					elInsertBefore = elNewParent;
				// ÇöÀç LI°¡ ¸¶Áö¸· LI¶ó¸é ºÎ¸ð OL/UL ÇÏ´Ü¿¡ »ðÀÔ
				}else{
					elInsertBefore = elParentNode.nextSibling;
				}
			}
			elParentNode.parentNode.insertBefore(elDiv, elInsertBefore);
			
			// ³»¾î¾²±â ÇÑ LI ¿Ü¿¡ ´Ù¸¥ LI°¡ Á¸Àç ÇÏÁö ¾ÊÀ» °æ¿ì ºÎ¸ð ³ëµå Áö¿öÁÜ
			if(!elParentNode.innerHTML.match(/LI/i)){
				elParentNode.parentNode.removeChild(elParentNode);
			}

			// OLÀÌ³ª UL À§·Î±îÁö ³»¾î¾²±â°¡ µÈ »óÅÂ¶ó¸é LI¸¦ ¹þ°Ü³¿
			if(!elDiv.parentNode.tagName.match(/OL|UL/)){
				elInsertParent = elDiv.parentNode;
				elInsertBefore = elDiv;

				// ³»¿ë¹°À» P·Î °¨½Î±â
				oDoc = this.oApp.getWYSIWYGDocument();
				elInsertParent = oDoc.createElement("P");
				elInsertBefore = null;
				
				elDiv.parentNode.insertBefore(elInsertParent, elDiv);

				while(elDiv.firstChild){
					elInsertParent.insertBefore(elDiv.firstChild, elInsertBefore);
				}
				elDiv.parentNode.removeChild(elDiv);
			}
			return;
		}
		nCurMarginLeft = parseInt(elDiv.style.marginLeft, 10);
		
		if(!nCurMarginLeft){
			nCurMarginLeft = 0;
		}

		nCurMarginLeft -= this.nIndentSpacing;
		
		if(nCurMarginLeft < 0){
			nCurMarginLeft = 0;
		}
		
		elDiv.style.marginLeft = nCurMarginLeft+"px";
	},
	
	// Fix IE's execcommand bug
	// When insertorderedlist/insertunorderedlist is executed on a blockquote, the blockquote will "suck in" directly neighboring OL, UL's if there's any.
	// To prevent this, insert empty P tags right before and after the blockquote and remove them after the execution.
	// [SMARTEDITORSUS-793] Chrome ¿¡¼­ µ¿ÀÏÇÑ ÀÌ½´ ¹ß»ý, Chrome Àº ºó P ÅÂ±×·Î´Â Ã³¸®µÇÁö ¾ÊÀ¸ &nbsp; Ãß°¡
	_insertBlankLine : function(){
		var oSelection = this.oApp.getSelection();
		var elNode = oSelection.commonAncestorContainer;
		this.elP1 = null;
		this.elP2 = null;

		while(elNode){
			if(elNode.tagName == "BLOCKQUOTE"){
				this.elP1 = jindo.$("<p>&nbsp;</p>", this.oApp.getWYSIWYGDocument());
				elNode.parentNode.insertBefore(this.elP1, elNode);

				this.elP2 = jindo.$("<p>&nbsp;</p>", this.oApp.getWYSIWYGDocument());
				elNode.parentNode.insertBefore(this.elP2, elNode.nextSibling);
				
				break;
			}
			elNode = elNode.parentNode;
		}
	},

	// Fix IE's execcommand bug
	// When insertorderedlist/insertunorderedlist is executed on a blockquote with all the child nodes selected, 
	// eg:<blockquote>[selection starts here]blah...[selection ends here]</blockquote>
	// , IE will change the blockquote with the list tag and create <OL><OL><LI>blah...</LI></OL></OL>.
	// (two OL's or two UL's depending on which command was executed)
	//
	// It can also happen when the cursor is located at bogus positions like 
	// * below blockquote when the blockquote is the last element in the document
	// 
	// [IE] ÀÎ¿ë±¸ ¾È¿¡¼­ ±Û¸Ó¸® ±âÈ£¸¦ Àû¿ëÇßÀ» ¶§, ÀÎ¿ë±¸ ¹Û¿¡ Àû¿ëµÈ ¹øÈ£¸Å±â±â/±Û¸Ó¸® ±âÈ£°¡ ÀÎ¿ë±¸ ¾ÈÀ¸·Î »¡·Á µé¾î°¡´Â ¹®Á¦ Ã³¸®
	_fixCorruptedBlockQuote : function(sTagName){
		var aNodes = this.oApp.getWYSIWYGDocument().getElementsByTagName(sTagName),
			elCorruptedBlockQuote, elTmpParent, elNewNode, aLists,
			i, nLen, nPos, el, oSelection;
		
		for(i=0, nLen=aNodes.length; i<nLen; i++){
			if(aNodes[i].firstChild && aNodes[i].firstChild.tagName == sTagName){
				elCorruptedBlockQuote = aNodes[i];
				break;
			}
		}
		
		if(!elCorruptedBlockQuote){return;}

		elTmpParent = elCorruptedBlockQuote.parentNode;

		// (1) changing outerHTML will cause loss of the reference to the node, so remember the idx position here
		nPos = this._getPosIdx(elCorruptedBlockQuote);
		el = this.oApp.getWYSIWYGDocument().createElement("DIV");
		el.innerHTML = elCorruptedBlockQuote.outerHTML.replace("<"+sTagName, "<BLOCKQUOTE");
		elCorruptedBlockQuote.parentNode.insertBefore(el.firstChild, elCorruptedBlockQuote);
		elCorruptedBlockQuote.parentNode.removeChild(elCorruptedBlockQuote);

		// (2) and retrieve the new node here
		elNewNode = elTmpParent.childNodes[nPos];

		// garbage <OL></OL> or <UL></UL> will be left over after setting the outerHTML, so remove it here.
		aLists = elNewNode.getElementsByTagName(sTagName);
		
		for(i=0, nLen=aLists.length; i<nLen; i++){
			if(aLists[i].childNodes.length<1){
				aLists[i].parentNode.removeChild(aLists[i]);
			}
		}

		oSelection = this.oApp.getEmptySelection();
		oSelection.selectNodeContents(elNewNode);
		oSelection.collapseToEnd();
		oSelection.select();
	},
	
	_getPosIdx : function(refNode){
		var idx = 0;
		for(var node = refNode.previousSibling; node; node = node.previousSibling){idx++;}

		return idx;
	},
	
	_countClickCr : function(sCommand) {
		if (!sCommand.match(this.rxClickCr)) {
			return;
		}	

		this.oApp.exec('MSG_NOTIFY_CLICKCR', [sCommand.replace(/^insert/i, '')]);
	}, 
	
	_extendBlock : function(){
		// [SMARTEDITORSUS-663] [FF] block´ÜÀ§·Î È®ÀåÇÏ¿© Range¸¦ »õ·Î ÁöÁ¤ÇØÁÖ´Â°ÍÀÌ ¿ø·¡ ½ºÆåÀÌ¹Ç·Î
		// ÇØ°áÀ» À§ÇØ¼­´Â ÇöÀç ¼±ÅÃµÈ ºÎºÐÀ» BlockÀ¸·Î extendÇÏ¿© execCommand API°¡ Ã³¸®µÉ ¼ö ÀÖµµ·Ï ÇÔ

		var oSelection = this.oApp.getSelection(),
			oStartContainer = oSelection.startContainer,
			oEndContainer = oSelection.endContainer,
			aChildImg = [],
			aSelectedImg = [],
			oSelectionClone = oSelection.cloneRange();
		
		// <p><img><br/><img><br/><img></p> ÀÏ ¶§ ÀÌ¹ÌÁö°¡ ÀÏºÎ¸¸ ¼±ÅÃµÇ¸é ¹ß»ý
		// - container ³ëµå´Â P ÀÌ°í container ³ëµåÀÇ ÀÚ½Ä³ëµå Áß ÀÌ¹ÌÁö°¡ ¿©·¯°³ÀÎµ¥ ¼±ÅÃµÈ ÀÌ¹ÌÁö°¡ ±× Áß ÀÏºÎÀÎ °æ¿ì
		
		if(!(oStartContainer === oEndContainer && oStartContainer.nodeType === 1 && oStartContainer.tagName === "P")){
			return;
		}

		aChildImg = jindo.$A(oStartContainer.childNodes).filter(function(value, index, array){
			return (value.nodeType === 1 && value.tagName === "IMG");
		}).$value();
		
		aSelectedImg = jindo.$A(oSelection.getNodes()).filter(function(value, index, array){
			return (value.nodeType === 1 && value.tagName === "IMG");
		}).$value();
		
		if(aChildImg.length <= aSelectedImg.length){
			return;
		}
		
		oSelection.selectNode(oStartContainer);
		oSelection.select();
		
		return oSelectionClone;
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to changing the font color
 * @name hp_SE_FontColor.js
 */
nhn.husky.SE2M_FontColor = jindo.$Class({
	name : "SE2M_FontColor",
	rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,

	$init : function(elAppContainer){
		this._assignHTMLElements(elAppContainer);
	},
	
	_assignHTMLElements : function(elAppContainer){
		//@ec[
		this.elLastUsed = jindo.$$.getSingle("SPAN.husky_se2m_fontColor_lastUsed", elAppContainer);

		this.elDropdownLayer = jindo.$$.getSingle("DIV.husky_se2m_fontcolor_layer", elAppContainer);
		this.elPaletteHolder = jindo.$$.getSingle("DIV.husky_se2m_fontcolor_paletteHolder", this.elDropdownLayer);
		//@ec]

		this._setLastUsedFontColor("#000000");
	},

	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", ["getLastUsedFontColor", jindo.$Fn(this.getLastUsedFontColor, this).bind()]);
  	},
    	
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["fontColorA", "click", "APPLY_LAST_USED_FONTCOLOR"]);
		this.oApp.exec("REGISTER_UI_EVENT", ["fontColorB", "click", "TOGGLE_FONTCOLOR_LAYER"]);
	},

	//@lazyload_js APPLY_LAST_USED_FONTCOLOR,TOGGLE_FONTCOLOR_LAYER[
	$ON_TOGGLE_FONTCOLOR_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "FONTCOLOR_LAYER_SHOWN", [], "FONTCOLOR_LAYER_HIDDEN", []]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['fontcolor']);
	},
	
	$ON_FONTCOLOR_LAYER_SHOWN : function(){
		this.oApp.exec("SELECT_UI", ["fontColorB"]);
		this.oApp.exec("SHOW_COLOR_PALETTE", ["APPLY_FONTCOLOR", this.elPaletteHolder]);
	},

	$ON_FONTCOLOR_LAYER_HIDDEN : function(){
		this.oApp.exec("DESELECT_UI", ["fontColorB"]);
		this.oApp.exec("RESET_COLOR_PALETTE", []);
	},
	
	$ON_APPLY_LAST_USED_FONTCOLOR : function(){
		this.oApp.exec("APPLY_FONTCOLOR", [this.sLastUsedColor]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['fontcolor']);
	},
	
	$ON_APPLY_FONTCOLOR : function(sFontColor){
		if(!this.rxColorPattern.test(sFontColor)){
			alert(this.oApp.$MSG("SE_FontColor.invalidColorCode"));
			return;
		}

		this._setLastUsedFontColor(sFontColor);
		
		this.oApp.exec("SET_WYSIWYG_STYLE", [{"color":sFontColor}]);

		// [SMARTEDITORSUS-907] ¸ðµç ºê¶ó¿ìÀú¿¡¼­ SET_WYSIWYG_STYLE·Î »ö»óÀ» ¼³Á¤ÇÏµµ·Ï º¯°æ
		// var oAgent = jindo.$Agent().navigator();
		// if( oAgent.ie || oAgent.firefox ){	// [SMARTEDITORSUS-658] Firefox Ãß°¡
		//	this.oApp.exec("SET_WYSIWYG_STYLE", [{"color":sFontColor}]);
		// } else {
		// 	var bDontAddUndoHistory = false;
			
		// 	if(this.oApp.getSelection().collapsed){
		// 		bDontAddUndoHistory = true;
		// 	}
			
		// 	this.oApp.exec("EXECCOMMAND", ["ForeColor", false, sFontColor, { "bDontAddUndoHistory" : bDontAddUndoHistory }]);
			
		// 	if(bDontAddUndoHistory){
		// 		this.oApp.exec("RECORD_UNDO_ACTION", ["FONT COLOR", {bMustBlockElement : true}]);
		// 	}
		// }
		
		this.oApp.exec("HIDE_ACTIVE_LAYER");
	},
	//@lazyload_js]
	
	_setLastUsedFontColor : function(sFontColor){
		this.sLastUsedColor = sFontColor;
		this.elLastUsed.style.backgroundColor = this.sLastUsedColor;
	},
	
	getLastUsedFontColor : function(){
		return (!!this.sLastUsedColor) ? this.sLastUsedColor : '#000000';
	}
});
//}
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to changing the font name using Select element
 * @name SE2M_FontNameWithLayerUI.js
 * @trigger MSG_STYLE_CHANGED,SE2M_TOGGLE_FONTNAME_LAYER
 */
nhn.husky.SE2M_FontNameWithLayerUI = jindo.$Class({
	name : "SE2M_FontNameWithLayerUI",

	$init : function(elAppContainer, aAdditionalFontList){
		this.elLastHover = null;
		this._assignHTMLElements(elAppContainer);
		
		this.htBrowser = jindo.$Agent().navigator();
		this.aAdditionalFontList = aAdditionalFontList || [];
	},
	
	addAllFonts : function(){
		var aDefaultFontList, aFontList, htMainFont, aFontInUse, i;
		
		// family name -> display name ¸ÅÇÎ (À¥ÆùÆ®´Â µÎ°³°¡ ´Ù¸§)
		this.htFamilyName2DisplayName = {};
		this.htAllFonts = {};
		
		this.aBaseFontList = [];
		this.aDefaultFontList = [];
		this.aTempSavedFontList = [];
		
		this.htOptions =  this.oApp.htOptions.SE2M_FontName;
		
		if(this.htOptions){
			aDefaultFontList = this.htOptions.aDefaultFontList || [];
			aFontList = this.htOptions.aFontList;
			htMainFont = this.htOptions.htMainFont;
			aFontInUse = this.htOptions.aFontInUse;
			
			//add Font
			if(this.htBrowser.ie && aFontList){
				for(i=0; i<aFontList.length; i++){
					this.addFont(aFontList[i].id, aFontList[i].name, aFontList[i].size, aFontList[i].url, aFontList[i].cssUrl);
				}
			}

			for(i=0; i<aDefaultFontList.length; i++){
				this.addFont(aDefaultFontList[i][0], aDefaultFontList[i][1], 0, "", "", 1);
			} 

			//set Main Font
			//if(mainFontSelected=='true') {
			if(htMainFont && htMainFont.id) {
				//this.setMainFont(mainFontId, mainFontName, mainFontSize, mainFontUrl, mainFontCssUrl);
				this.setMainFont(htMainFont.id, htMainFont.name, htMainFont.size, htMainFont.url, htMainFont.cssUrl);
			}
			// add font in use
			if(this.htBrowser.ie && aFontInUse){
				for(i=0; i<aFontInUse.length; i++){
					this.addFontInUse(aFontInUse[i].id, aFontInUse[i].name, aFontInUse[i].size, aFontInUse[i].url, aFontInUse[i].cssUrl);
				}
			}
		}
		
		// [SMARTEDITORSUS-245] ¼­ºñ½º Àû¿ë ½Ã ±Û²ÃÁ¤º¸¸¦ ³Ñ±âÁö ¾ÊÀ¸¸é ±âº» ±Û²Ã ¸ñ·ÏÀÌ º¸ÀÌÁö ¾Ê´Â ¿À·ù
		if(!this.htOptions || !this.htOptions.aDefaultFontList || this.htOptions.aDefaultFontList.length === 0){
			this.addFont("µ¸¿ò,Dotum", "µ¸¿ò", 0, "", "", 1, null, true);
			this.addFont("µ¸¿òÃ¼,DotumChe,AppleGothic", "µ¸¿òÃ¼", 0, "", "", 1);
			this.addFont("±¼¸²,Gulim", "±¼¸²", 0, "", "", 1, null, true);
			this.addFont("±¼¸²Ã¼,GulimChe", "±¼¸²Ã¼", 0, "", "", 1, null, true);
			this.addFont("¹ÙÅÁ,Batang,AppleMyungjo", "¹ÙÅÁ", 0, "", "", 1);
			this.addFont("¹ÙÅÁÃ¼,BatangChe", "¹ÙÅÁÃ¼", 0, "", "", 1, null, true);
			this.addFont("±Ã¼­,Gungsuh,GungSeo", "±Ã¼­", 0, "", "", 1);
			this.addFont('Arial', 'Arial', 0, "", "", 1, "abcd");
			this.addFont('Tahoma', 'Tahoma', 0, "", "", 1, "abcd");
			this.addFont('Times New Roman', 'Times New Roman', 0, "", "", 1, "abcd");
			this.addFont('Verdana', 'Verdana', 0, "", "", 1, "abcd");
			this.addFont('Courier New', 'Courier New', 0, "", "", 1, "abcd");
		}
		
		// [SMARTEDITORSUS-1436] ±Û²Ã ¸®½ºÆ®¿¡ ±Û²Ã Á¾·ù Ãß°¡ÇÏ±â ±â´É
		if(!!this.aAdditionalFontList && this.aAdditionalFontList.length > 0){
			for(i = 0, nLen = this.aAdditionalFontList.length; i < nLen; i++){
				this.addFont(this.aAdditionalFontList[i][0], this.aAdditionalFontList[i][1], 0, "", "", 1);
			}
		}
	},
	
	$ON_MSG_APP_READY : function(){
		this.bDoNotRecordUndo = false;

		this.oApp.exec("ADD_APP_PROPERTY", ["addFont", jindo.$Fn(this.addFont, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["addFontInUse", jindo.$Fn(this.addFontInUse, this).bind()]);
		// ºí·Î±×µî ÆÑÅä¸® ÆùÆ® Æ÷ÇÔ ¿ë
		this.oApp.exec("ADD_APP_PROPERTY", ["setMainFont", jindo.$Fn(this.setMainFont, this).bind()]);
		// ¸ÞÀÏµî ´Ü¼ø ÆùÆ® ÁöÁ¤ ¿ë
		this.oApp.exec("ADD_APP_PROPERTY", ["setDefaultFont", jindo.$Fn(this.setDefaultFont, this).bind()]);
		
		this.oApp.exec("REGISTER_UI_EVENT", ["fontName", "click", "SE2M_TOGGLE_FONTNAME_LAYER"]);
	},
	
	$AFTER_MSG_APP_READY : function(){
		this._initFontName();
		this._attachIEEvent();
	},
	
	_assignHTMLElements : function(elAppContainer){
		//@ec[
		this.oDropdownLayer = jindo.$$.getSingle("DIV.husky_se_fontName_layer", elAppContainer);

		this.elFontNameLabel = jindo.$$.getSingle("SPAN.husky_se2m_current_fontName", elAppContainer);

		this.elFontNameList = jindo.$$.getSingle("UL", this.oDropdownLayer);
		this.elInnerLayer = this.elFontNameList.parentNode;
		this.elFontItemTemplate = jindo.$$.getSingle("LI", this.oDropdownLayer);
		this.aLIFontNames = jindo.$A(jindo.$$("LI", this.oDropdownLayer)).filter(function(v,i,a){return (v.firstChild !== null);})._array;

		this.elSeparator = jindo.$$.getSingle("LI.husky_seditor_font_separator", this.oDropdownLayer);
		this.elNanumgothic = jindo.$$.getSingle("LI.husky_seditor_font_nanumgothic", this.oDropdownLayer);
		this.elNanummyeongjo = jindo.$$.getSingle("LI.husky_seditor_font_nanummyeongjo", this.oDropdownLayer);
		this.elNanumgothiccoding = jindo.$$.getSingle("LI.husky_seditor_font_nanumgothiccoding", this.oDropdownLayer);
		//@ec]
		
		this.sDefaultText = this.elFontNameLabel.innerHTML;
	},
	
	//$LOCAL_BEFORE_FIRST : function(){
	_initFontName : function(){
		this._addNanumFont();
		
		this.addAllFonts();

		this.oApp.registerBrowserEvent(this.oDropdownLayer, "mouseover", "EVENT_FONTNAME_LAYER_MOUSEOVER", []);
		this.oApp.registerBrowserEvent(this.oDropdownLayer, "click", "EVENT_FONTNAME_LAYER_CLICKED", []);
	},
	
	_addNanumFont : function(){
		var bUseSeparator = false;
		var nanum_gothic = unescape("%uB098%uB214%uACE0%uB515");
		var nanum_myungjo = unescape("%uB098%uB214%uBA85%uC870");
		var nanum_gothic_coding = unescape("%uB098%uB214%uACE0%uB515%uCF54%uB529");
		
		if(jindo.$Agent().os().mac){
			nanum_gothic = "NanumGothic";
			nanum_myungjo = "NanumMyeongjo";
			nanum_gothic_coding = "NanumGothicCoding";
		}
		
		if(!!this.elNanumgothic){
			if(IsInstalledFont(nanum_gothic)){
				bUseSeparator = true;
				this.elNanumgothic.style.display = "block";
			}else{
				this.elNanumgothic.style.display = "none";
			}
		}
		
		if(!!this.elNanummyeongjo){
			if(IsInstalledFont(nanum_myungjo)){
				bUseSeparator = true;
				this.elNanummyeongjo.style.display = "block";
			}else{
				this.elNanummyeongjo.style.display = "none";
			}
		}
		
		if(!!this.elNanumgothicCoding){
			if(IsInstalledFont(nanum_gothic_coding)){
				bUseSeparator = true;
				this.elNanumgothiccoding.style.display = "block";
			}else{
				this.elNanumgothiccoding.style.display = "none";
			}
		}
		
		if(!!this.elSeparator){
			this.elSeparator.style.display = bUseSeparator ? "block" : "none";
		}
	},
	
	_attachIEEvent : function(){
		if(!this.htBrowser.ie){			
			return;
		}
		
		if(this.htBrowser.nativeVersion < 9){		// [SMARTEDITORSUS-187] [< IE9] ÃÖÃÊ paste ½ÃÁ¡¿¡ À¥ÆùÆ® ÆÄÀÏÀ» ·Îµå
			this._wfOnPasteWYSIWYGBody = jindo.$Fn(this._onPasteWYSIWYGBody, this);
			this._wfOnPasteWYSIWYGBody.attach(this.oApp.getWYSIWYGDocument().body, "paste");
			
			return;
		}
		
		if(document.documentMode < 9){	// [SMARTEDITORSUS-169] [>= IE9] ÃÖÃÊ Æ÷Ä¿½º ½ÃÁ¡¿¡ À¥ÆùÆ® ·Îµå
			this._wfOnFocusWYSIWYGBody = jindo.$Fn(this._onFocusWYSIWYGBody, this);
			this._wfOnFocusWYSIWYGBody.attach(this.oApp.getWYSIWYGDocument().body, "focus");
			
			return;
		}

		// documentMode === 9
		// http://blogs.msdn.com/b/ie/archive/2010/08/17/ie9-opacity-and-alpha.aspx	// opacity:0.0;
		this.welEditingAreaCover = jindo.$Element('<DIV style="width:100%; height:100%; position:absolute; top:0px; left:0px; z-index:1000;"></DIV>');

		this.oApp.welEditingAreaContainer.prepend(this.welEditingAreaCover);
		jindo.$Fn(this._onMouseupCover, this).attach(this.welEditingAreaCover.$value(), "mouseup");
	},
	
	_onFocusWYSIWYGBody : function(e){
		this._wfOnFocusWYSIWYGBody.detach(this.oApp.getWYSIWYGDocument().body, "focus");
		this._loadAllBaseFont();
	},
	
	_onPasteWYSIWYGBody : function(e){
		this._wfOnPasteWYSIWYGBody.detach(this.oApp.getWYSIWYGDocument().body, "paste");
		this._loadAllBaseFont();
	},
	
	_onMouseupCover : function(e){
		e.stop();

		// [SMARTEDITORSUS-1632] ¹®¼­ ¸ðµå°¡ 9 ÀÌ»óÀÏ ¶§, °æ¿ì¿¡ µû¶ó this.welEditingAreaContainer°¡ ¾øÀ» ¶§ ½ºÅ©¸³Æ® ¿À·ù ¹ß»ý
		if(this.welEditingAreaCover){
			this.welEditingAreaCover.leave();
		}
		//this.welEditingAreaCover.leave();
		// --[SMARTEDITORSUS-1632]
		
		var oMouse = e.mouse(),
			elBody = this.oApp.getWYSIWYGDocument().body,
			welBody = jindo.$Element(elBody),
			oSelection = this.oApp.getEmptySelection();
		
		// [SMARTEDITORSUS-363] °­Á¦·Î Selection À» ÁÖµµ·Ï Ã³¸®ÇÔ
		oSelection.selectNode(elBody);
		oSelection.collapseToStart();
		oSelection.select();

		welBody.fireEvent("mousedown", {left : oMouse.left, middle : oMouse.middle, right : oMouse.right});
		welBody.fireEvent("mouseup", {left : oMouse.left, middle : oMouse.middle, right : oMouse.right});
	},

	$ON_EVENT_TOOLBAR_MOUSEDOWN : function(){
		if(this.htBrowser.nativeVersion < 9 || document.documentMode < 9){
			return;
		}
		
		// [SMARTEDITORSUS-1632] ¹®¼­ ¸ðµå°¡ 9 ÀÌ»óÀÏ ¶§, °æ¿ì¿¡ µû¶ó this.welEditingAreaContainer°¡ ¾øÀ» ¶§ ½ºÅ©¸³Æ® ¿À·ù ¹ß»ý
		if(this.welEditingAreaCover){
			this.welEditingAreaCover.leave();
		}
		//this.welEditingAreaCover.leave();
		// --[SMARTEDITORSUS-1632]
	},
	
	_loadAllBaseFont : function(){
		var i, nFontLen;
		
		if(!this.htBrowser.ie){
			return;
		}
		
		if(this.htBrowser.nativeVersion < 9){
			for(i=0, nFontLen=this.aBaseFontList.length; i<nFontLen; i++){
				this.aBaseFontList[i].loadCSS(this.oApp.getWYSIWYGDocument());
			}	
		}else if(document.documentMode < 9){
			for(i=0, nFontLen=this.aBaseFontList.length; i<nFontLen; i++){
				this.aBaseFontList[i].loadCSSToMenu();
			}
		}
	
		this._loadAllBaseFont = function(){};
	},
	
	_addFontToMenu: function(sDisplayName, sFontFamily, sSampleText){
		var elItem = document.createElement("LI");
		elItem.innerHTML = this.elFontItemTemplate.innerHTML.replace("@DisplayName@",  sDisplayName).replace("FontFamily", sFontFamily).replace("@SampleText@", sSampleText);
		this.elFontNameList.insertBefore(elItem, this.elFontItemTemplate);

		this.aLIFontNames[this.aLIFontNames.length] = elItem;
		
		if(this.aLIFontNames.length > 20){
			this.oDropdownLayer.style.overflowX = 'hidden';
			this.oDropdownLayer.style.overflowY = 'auto';
			this.oDropdownLayer.style.height = '400px';
			this.oDropdownLayer.style.width = '204px';	// [SMARTEDITORSUS-155] ½ºÅ©·ÑÀ» Æ÷ÇÔÇÏ¿© 206px ÀÌ µÇµµ·Ï Ã³¸®
		}
	},

	$ON_EVENT_FONTNAME_LAYER_MOUSEOVER : function(wev){
		var elTmp = this._findLI(wev.element);
		if(!elTmp){
			return;
		}

		this._clearLastHover();
		
		elTmp.className = "hover";
		this.elLastHover = elTmp;
	},
	
	$ON_EVENT_FONTNAME_LAYER_CLICKED : function(wev){
		var elTmp = this._findLI(wev.element);
		if(!elTmp){
			return;
		}
		
		var sFontFamily = this._getFontFamilyFromLI(elTmp);
		// [SMARTEDITORSUS-169] À¥ÆùÆ®ÀÇ °æ¿ì fontFamily ¿¡ ' À» ºÙ¿©ÁÖ´Â Ã³¸®¸¦ ÇÔ
		var htFontInfo = this.htAllFonts[sFontFamily.replace(/\"/g, nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS)];
		var nDefaultFontSize;
		if(htFontInfo){
			nDefaultFontSize = htFontInfo.defaultSize+"pt";
		}else{
			nDefaultFontSize = 0;
		}
		this.oApp.exec("SET_FONTFAMILY", [sFontFamily, nDefaultFontSize]);
	},
	
	_findLI : function(elTmp){
		while(elTmp.tagName != "LI"){
			if(!elTmp || elTmp === this.oDropdownLayer){
				return null;
			}
			elTmp = elTmp.parentNode;
		}
		if(/husky_seditor_font_separator/.test(elTmp.className)){
			return null;
		}
		return elTmp;
	},
	
	_clearLastHover : function(){
		if(this.elLastHover){
			this.elLastHover.className = "";
		}
	},
	
	$ON_SE2M_TOGGLE_FONTNAME_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oDropdownLayer, null, "MSG_FONTNAME_LAYER_OPENED", [], "MSG_FONTNAME_LAYER_CLOSED", []]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['font']);
	},
	
	$ON_MSG_FONTNAME_LAYER_OPENED : function(){
		this.oApp.exec("SELECT_UI", ["fontName"]);
	},
	
	$ON_MSG_FONTNAME_LAYER_CLOSED : function(){
		this._clearLastHover();
		this.oApp.exec("DESELECT_UI", ["fontName"]);
	},
	
	$ON_MSG_STYLE_CHANGED : function(sAttributeName, sAttributeValue){
		if(sAttributeName == "fontFamily"){
			sAttributeValue = sAttributeValue.replace(/["']/g, "");
			var elLi = this._getMatchingLI(sAttributeValue);
			this._clearFontNameSelection();
			if(elLi){
				this.elFontNameLabel.innerHTML = this._getFontNameLabelFromLI(elLi);
				jindo.$Element(elLi).addClass("active");
			}else{
				//var sDisplayName = this.htFamilyName2DisplayName[sAttributeValue] || sAttributeValue;
				var sDisplayName = this.sDefaultText;
				this.elFontNameLabel.innerHTML = sDisplayName;
			}
		}
	},

	$BEFORE_RECORD_UNDO_BEFORE_ACTION : function(){
		return !this.bDoNotRecordUndo;
	},
	$BEFORE_RECORD_UNDO_AFTER_ACTION : function(){
		return !this.bDoNotRecordUndo;
	},
	$BEFORE_RECORD_UNDO_ACTION : function(){
		return !this.bDoNotRecordUndo;
	},

	$ON_SET_FONTFAMILY : function(sFontFamily, sDefaultSize){
		if(!sFontFamily){return;}
		
		// [SMARTEDITORSUS-169] À¥ÆùÆ®ÀÇ °æ¿ì fontFamily ¿¡ ' À» ºÙ¿©ÁÖ´Â Ã³¸®¸¦ ÇÔ
		var oFontInfo = this.htAllFonts[sFontFamily.replace(/\"/g, nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS)];
		if(!!oFontInfo){
			oFontInfo.loadCSS(this.oApp.getWYSIWYGDocument());
		}
		
		// fontFamily¿Í fontSize µÎ°³ÀÇ ¾×¼ÇÀ» ÇÏ³ª·Î ¹­¾î¼­ undo history ÀúÀå
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["SET FONTFAMILY", {bMustBlockElement:true}]);
		this.bDoNotRecordUndo = true;
		
		if(parseInt(sDefaultSize, 10) > 0){
			this.oApp.exec("SET_WYSIWYG_STYLE", [{"fontSize":sDefaultSize}]);
		}
		this.oApp.exec("SET_WYSIWYG_STYLE", [{"fontFamily":sFontFamily}]);
		
		this.bDoNotRecordUndo = false;
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["SET FONTFAMILY", {bMustBlockElement:true}]);
		
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);

		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},
	
	_getMatchingLI : function(sFontName){
		sFontName = sFontName.toLowerCase();
		var elLi, aFontFamily;
		for(var i=0; i<this.aLIFontNames.length; i++){
			elLi = this.aLIFontNames[i];
			aFontFamily = this._getFontFamilyFromLI(elLi).toLowerCase().split(",");
			for(var h=0; h < aFontFamily.length;h++){
				if( !!aFontFamily[h] && jindo.$S(aFontFamily[h].replace(/['"]/ig, "")).trim().$value() == sFontName){
					return elLi;
				}
			}
		}
		return null;
	},

	_getFontFamilyFromLI : function(elLi){
		//return elLi.childNodes[1].innerHTML.toLowerCase();
		// <li><button type="button"><span>µ¸À½</span>(</span><em style="font-family:'µ¸À½',Dotum,'±¼¸²',Gulim,Helvetica,Sans-serif;">µ¸À½</em><span>)</span></span></button></li>
		return (elLi.getElementsByTagName("EM")[0]).style.fontFamily; 
	},
	
	_getFontNameLabelFromLI : function(elLi){
		return elLi.firstChild.firstChild.firstChild.nodeValue;
	},
	
	_clearFontNameSelection : function(elLi){
		for(var i=0; i<this.aLIFontNames.length; i++){
			jindo.$Element(this.aLIFontNames[i]).removeClass("active");
		}
	},

	/**
	 * Add the font to the list
	 * @param fontId {String} value of font-family in style
	 * @param fontName {String} name of font list in editor
	 * @param defaultSize 
	 * @param fontURL 
	 * @param fontCSSURL 
	 * @param fontType fontType == null, custom font (sent from the server)
	 *                 fontType == 1, default font
	 *                 fontType == 2, tempSavedFont
	 * @param sSampleText {String} sample text of font list in editor
	 * @param bCheck {Boolean} 
	 */
	addFont : function (fontId, fontName, defaultSize, fontURL, fontCSSURL, fontType, sSampleText, bCheck) {
		// custom font feature only available in IE
		if(!this.htBrowser.ie && fontCSSURL){
			return null;
		}

		// OS¿¡ ÇØ´ç ÆùÆ®°¡ Á¸ÀçÇÏ´ÂÁö ¿©ºÎ¸¦ È®ÀÎÇÑ´Ù.
		if(bCheck && !IsInstalledFont(fontId)){
			return null;
		}

		fontId = fontId.toLowerCase();
		
		var newFont = new fontProperty(fontId, fontName, defaultSize, fontURL, fontCSSURL);
		
		var sFontFamily;
		var sDisplayName;
		if(defaultSize>0){
			sFontFamily = fontId+"_"+defaultSize;
			sDisplayName = fontName+"_"+defaultSize;
		}else{
			sFontFamily = fontId;
			sDisplayName = fontName;
		}
		
		if(!fontType){
			sFontFamily = nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS + sFontFamily + nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS;
		}
		
		if(this.htAllFonts[sFontFamily]){
			return this.htAllFonts[sFontFamily];
		}
		this.htAllFonts[sFontFamily] = newFont;
/*
		// do not add again, if the font is already in the list
		for(var i=0; i<this._allFontList.length; i++){
			if(newFont.fontFamily == this._allFontList[i].fontFamily){
				return this._allFontList[i];
			}
		}

		this._allFontList[this._allFontList.length] = newFont;
*/		
		// [SMARTEDITORSUS-169] [IE9] À¥ÆùÆ®A ¼±ÅÃ>À¥ÆùÆ®B ¼±ÅÃ>À¥ÆùÆ® A¸¦ ´Ù½Ã ¼±ÅÃÇÏ¸é À¥ÆùÆ® A°¡ Àû¿ëµÇÁö ¾Ê´Â ¹®Á¦°¡ ¹ß»ý
		//
		// [¿øÀÎ]
		// 		- IE9ÀÇ À¥ÆùÆ® ·Îµå/¾ð·Îµå ½ÃÁ¡
		// 			À¥ÆùÆ® ·Îµå ½ÃÁ¡: StyleSheet ÀÇ @font-face ±¸¹®ÀÌ ÇØ¼®µÈ ÀÌÈÄ, DOM Tree »ó¿¡¼­ ÇØ´ç À¥ÆùÆ®°¡ ÃÖÃÊ·Î »ç¿ëµÈ ½ÃÁ¡
		// 			À¥ÆùÆ® ¾ð·Îµå ½ÃÁ¡: StyleSheet ÀÇ @font-face ±¸¹®ÀÌ ÇØ¼®µÈ ÀÌÈÄ, DOM Tree »ó¿¡¼­ ÇØ´ç À¢ÆùÆ®°¡ ´õÀÌ»ó »ç¿ëµÇÁö ¾Ê´Â ½ÃÁ¡
		// 		- ¸Þ´º ¸®½ºÆ®¿¡ Àû¿ëµÇ´Â ½ºÅ¸ÀÏÀº @font-face ÀÌÀü¿¡ Ã³¸®µÇ´Â °ÍÀÌ¾î¼­ ¾ð·Îµå¿¡ ¿µÇâÀ» ¹ÌÄ¡Áö ¾ÊÀ½
		//
		// 		½º¸¶Æ®¿¡µðÅÍÀÇ °æ¿ì, À¥ÆùÆ®¸¦ ¼±ÅÃÇÒ ¶§¸¶´Ù SPAN ÀÌ »õ·Î Ãß°¡µÇ´Â °ÍÀÌ ¾Æ´Ñ ¼±ÅÃµÈ SPAN ÀÇ fontFamily ¸¦ º¯°æÇÏ¿© Ã³¸®ÇÏ¹Ç·Î
		// 		fontFamily º¯°æ ÈÄ DOM Tree »ó¿¡¼­ ´õÀÌ»ó »ç¿ëµÇÁö ¾Ê´Â °ÍÀ¸·Î ºê¶ó¿ìÀú ÆÇ´ÜÇÏ¿© ¾ð·Îµå ÇØ¹ö¸².
		// [ÇØ°á] 
		//		¾ð·Îµå°¡ ¹ß»ýÇÏÁö ¾Êµµ·Ï ¸Þ´º ¸®½ºÆ®¿¡ ½ºÅ¸ÀÏÀ» Àû¿ëÇÏ´Â °ÍÀ» @font-face ÀÌÈÄ·Î ÇÏµµ·Ï Ã³¸®ÇÏ¿© DOM Tree »ó¿¡ Ç×»ó Àû¿ëµÉ ¼ö ÀÖµµ·Ï ÇÔ
		//
		// [SMARTEDITORSUS-969] [IE10] À¥ÆùÆ®¸¦ »ç¿ëÇÏ¿© ±ÛÀ» µî·ÏÇÏ°í, ¼öÁ¤¸ðµå·Î µé¾î°¬À» ¶§ À¥ÆùÆ®°¡ Àû¿ëµÇÁö ¾Ê´Â ¹®Á¦
		//		- IE10¿¡¼­µµ À¥ÆùÆ® ¾ð·Îµå°¡ ¹ß»ýÇÏÁö ¾Êµµ·Ï Á¶°ÇÀ» ¼öÁ¤ÇÔ
		//		     -> ±âÁ¸ : nativeVersion === 9 && documentMode === 9
		//		     -> ¼öÁ¤ : nativeVersion >= 9 && documentMode >= 9
		if(this.htBrowser.ie && this.htBrowser.nativeVersion >= 9 && document.documentMode >= 9) {
			newFont.loadCSSToMenu();
		}
		
		this.htFamilyName2DisplayName[sFontFamily] = fontName;

		sSampleText = sSampleText || this.oApp.$MSG('SE2M_FontNameWithLayerUI.sSampleText');
		this._addFontToMenu(sDisplayName, sFontFamily, sSampleText);
		
		if(!fontType){
			this.aBaseFontList[this.aBaseFontList.length] = newFont;
		}else{
			if(fontType == 1){
				this.aDefaultFontList[this.aDefaultFontList.length] = newFont;
			}else{
				this.aTempSavedFontList[this.aTempSavedFontList.length] = newFont;
			}
		}

		return newFont;		
	},
	// Add the font AND load it right away
	addFontInUse : function (fontId, fontName, defaultSize, fontURL, fontCSSURL, fontType) {
		var newFont = this.addFont(fontId, fontName, defaultSize, fontURL, fontCSSURL, fontType);
		if(!newFont){
			return null;
		}

		newFont.loadCSS(this.oApp.getWYSIWYGDocument());
		
		return newFont;
	},
	// Add the font AND load it right away AND THEN set it as the default font
	setMainFont : function (fontId, fontName, defaultSize, fontURL, fontCSSURL, fontType) {
		var newFont = this.addFontInUse(fontId, fontName, defaultSize, fontURL, fontCSSURL, fontType);
		if(!newFont){
			return null;
		}
		
		this.setDefaultFont(newFont.fontFamily, defaultSize);
		
		return newFont;
	},
	
	setDefaultFont : function(sFontFamily, nFontSize){
		var elBody = this.oApp.getWYSIWYGDocument().body;
		elBody.style.fontFamily = sFontFamily;
		if(nFontSize>0){elBody.style.fontSize   = nFontSize + 'pt';}
	}
});

nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS = "'";	// [SMARTEDITORSUS-169] À¥ÆùÆ®ÀÇ °æ¿ì fontFamily ¿¡ ' À» ºÙ¿©ÁÖ´Â Ã³¸®¸¦ ÇÔ	

// property function for all fonts - including the default fonts and the custom fonts
// non-custom fonts will have the defaultSize of 0 and empty string for fontURL/fontCSSURL
function fontProperty(fontId, fontName, defaultSize, fontURL, fontCSSURL){
	this.fontId = fontId;
	this.fontName = fontName;
	this.defaultSize = defaultSize;
	this.fontURL = fontURL;
	this.fontCSSURL = fontCSSURL;
	
	this.displayName = fontName;
	this.isLoaded = true;
	this.fontFamily = this.fontId;
	
	// it is custom font
	if(this.fontCSSURL != ""){
		this.displayName += '' + defaultSize;
		this.fontFamily += '_' + defaultSize;
		// custom fonts requires css loading
		this.isLoaded = false;
		
		// load the css that loads the custom font
		this.loadCSS = function(doc){
			// if the font is loaded already, return
			if(this.isLoaded){
				return;
			}
			
			this._importCSS(doc);
			this.isLoaded = true;  
		};
		
		// [SMARTEDITORSUS-169] [IE9] 
		// addImport ÈÄ¿¡ Ã³À½ Àû¿ëµÈ DOM-Tree °¡ iframe ³»ºÎÀÎ °æ¿ì (setMainFont || addFontInUse ¿¡¼­ È£ÃâµÈ °æ¿ì)
		// ÇØ´ç ÆùÆ®¿¡ ´ëÇÑ ¾ð·Îµå ¹®Á¦°¡ °è¼Ó ¹ß»ýÇÏ¿© IE9¿¡¼­ addFont ¿¡¼­ È£ÃâÇÏ´Â loadCSS ÀÇ °æ¿ì¿¡´Â isLoaded¸¦ true ·Î º¯°æÇÏÁö ¾ÊÀ½.
		this.loadCSSToMenu = function(){
			this._importCSS(document);
		};
		
		this._importCSS = function(doc){
			var nStyleSheet = doc.styleSheets.length;
			var oStyleSheet = doc.styleSheets[nStyleSheet - 1];
			
			if(nStyleSheet === 0 || oStyleSheet.imports.length == 30){ // imports limit
				oStyleSheet = doc.createStyleSheet();
			}
			
			oStyleSheet.addImport(this.fontCSSURL);
		};
	}else{
		this.loadCSS = function(){};
		this.loadCSSToMenu = function(){};
	}
	
	this.toStruct = function(){
		return {fontId:this.fontId, fontName:this.fontName, defaultSize:this.defaultSize, fontURL:this.fontURL, fontCSSURL:this.fontCSSURL};
	};
}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to changing the font size using Select element
 * @name SE2M_FontSizeWithLayerUI.js
 */
nhn.husky.SE2M_FontSizeWithLayerUI = jindo.$Class({
	name : "SE2M_FontSizeWithLayerUI",

	$init : function(elAppContainer){
		this._assignHTMLElements(elAppContainer);
	},
	
	_assignHTMLElements : function(elAppContainer){
		//@ec
		this.oDropdownLayer = jindo.$$.getSingle("DIV.husky_se_fontSize_layer", elAppContainer);

		//@ec[
		this.elFontSizeLabel = jindo.$$.getSingle("SPAN.husky_se2m_current_fontSize", elAppContainer);
		this.aLIFontSizes = jindo.$A(jindo.$$("LI", this.oDropdownLayer)).filter(function(v,i,a){return (v.firstChild != null);})._array;
		//@ec]
		
		this.sDefaultText = this.elFontSizeLabel.innerHTML;
	},
	
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["fontSize", "click", "SE2M_TOGGLE_FONTSIZE_LAYER"]);
		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [this.aLIFontSizes]);

		for(var i=0; i<this.aLIFontSizes.length; i++){
			this.oApp.registerBrowserEvent(this.aLIFontSizes[i], "click", "SET_FONTSIZE", [this._getFontSizeFromLI(this.aLIFontSizes[i])]);
		}
	},

	$ON_SE2M_TOGGLE_FONTSIZE_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oDropdownLayer, null, "SELECT_UI", ["fontSize"], "DESELECT_UI", ["fontSize"]]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['size']);
	},
	
	_rxPX : /px$/i,
	_rxPT : /pt$/i,
	
	$ON_MSG_STYLE_CHANGED : function(sAttributeName, sAttributeValue){
		if(sAttributeName == "fontSize"){
			// [SMARTEDITORSUS-1600]
			if(this._rxPX.test(sAttributeValue)){
			// as-is
			/*
			if(sAttributeValue.match(/px$/)){
				var num = parseFloat(sAttributeValue.replace("px", "")).toFixed(0);
				if(this.mapPX2PT[num]){
					sAttributeValue = this.mapPX2PT[num] + "pt";
				}else{
					if(sAttributeValue > 0){
						sAttributeValue = num + "px";
					}else{
						sAttributeValue = this.sDefaultText;
					}
				}*/
				
				/**
				 * ChromeÀÇ °æ¿ì, 
				 * jindo.$Element().css()¿¡¼­ ´ë»ó Element¿¡ ±¸ÇÏ°íÀÚ ÇÏ´Â style °ªÀÌ ¸í½ÃµÇ¾î ÀÖÁö ¾Ê´Ù¸é,
				 * ½ÇÁ¦ ¼öÇàµÇ´Â ¸Þ¼­µå´Â window.getComputedStyle()ÀÌ´Ù.
				 * 
				 * ÀÌ ¸Þ¼­µå¸¦ °ÅÄ¡¸é px ´ÜÀ§·Î °ªÀ» °¡Á®¿À°Ô µÇ´Âµ¥,
				 * WYSIWYGDocument.body¿¡ pt ´ÜÀ§·Î °ªÀÌ ¼³Á¤µÇ¾î ÀÖ¾ú´Ù¸é
				 * px : pt = 72 : 96 ÀÇ ºñ·Ê¿¡ ÀÇÇØ
				 * º¯È¯µÈ px °ªÀ» È¹µæÇÏ°Ô µÇ¸ç,
				 *   
				 * ¾Æ·¡ parseFloat()ÀÇ Æ¯¼º »ó
				 * ¼Ò¼öÁ¡ 16ÀÚ¸®ºÎÅÍ´Â ¹ö·ÁÁú ¼ö ÀÖÀ¸¸ç,
				 * 
				 * ÀÌ °æ¿ì ¹ß»ýÇÒ ¼ö ÀÖ´Â ¿ÀÂ÷´Â
				 * pt ±âÁØÀ¸·Î 3.75E-16 ptÀÌ´Ù.
				 * 
				 * 0.5pt Å©±â·Î ±¸°£À» ¼³Á¤ÇÏ¿´±â ¶§¹®¿¡
				 * ÀÌ ¿ÀÂ÷´Â ¼³Á¤¿¡ ÁöÀåÀ» ÁÖÁö ¾Ê´Â´Ù.
				 * 
				 * À§ÀÇ ±âÁ¸ ¹æ½ÄÀº °è»êÀ» °ÅÄ¡Áö ¾ÊÀ» »Ó ¾Æ´Ï¶ó,
				 * ¼Ò¼öÁ¡ Ã¹Â° ÀÚ¸®ºÎÅÍ ¹«Á¶°Ç ¹Ý¿Ã¸²ÇÏ±â ¶§¹®¿¡
				 * °á°ú¿¡ µû¶ó 0.375 ptÀÇ ¿ÀÂ÷°¡ ¹ß»ýÇÒ ¼ö ÀÖ¾ú´Ù.
				 * */
				var num = parseFloat(sAttributeValue.replace(this._rxPX, ""));
				if(num > 0){
					// px : pt = 72 : 96
					sAttributeValue = num * 72 / 96 + "pt"; 
				}else{
					sAttributeValue = this.sDefaultText;
				}
				// --[SMARTEDITORSUS-1600]
			}
			
			// [SMARTEDITORSUS-1600]
			// »ê¼ú °è»êÀ» ÅëÇØ ÀÏÂ÷ÀûÀ¸·Î pt·Î º¯È¯µÈ °ªÀ» 0.5pt ±¸°£À» Àû¿ëÇÏ¿© º¸Á¤ÇÏµÇ, º¸´Ù °¡±î¿î ÂÊÀ¸·Î ¼³Á¤ÇÑ´Ù.
			if(this._rxPT.test(sAttributeValue)){
				var num = parseFloat(sAttributeValue.replace(this._rxPT, ""));
				var integerPart = Math.floor(num); // Á¤¼ö ºÎºÐ
				var decimalPart = num - integerPart; // ¼Ò¼ö ºÎºÐ
				
				// º¸Á¤ ±âÁØÀº ¼Ò¼ö ºÎºÐÀÌ¸ç, ¹Ý¿Ã¸² ´ÜÀ§´Â 0.25pt
				if(decimalPart >= 0 && decimalPart < 0.25){
					num = integerPart + 0;
				}else if(decimalPart >= 0.25 && decimalPart < 0.75){
					num = integerPart + 0.5;
				}else{
					num = integerPart + 1;
				} 
				
				// º¸Á¤µÈ pt
				sAttributeValue = num + "pt";
			}
			// --[SMARTEDITORSUS-1600]
			
			if(!sAttributeValue){
				sAttributeValue = this.sDefaultText;
			}
			var elLi = this._getMatchingLI(sAttributeValue);
			this._clearFontSizeSelection();
			if(elLi){
				this.elFontSizeLabel.innerHTML = sAttributeValue;
				jindo.$Element(elLi).addClass("active");
			}else{
				this.elFontSizeLabel.innerHTML = sAttributeValue;
			}
		}
	},

	$ON_SET_FONTSIZE : function(sFontSize){
		if(!sFontSize){return;}

		this.oApp.exec("SET_WYSIWYG_STYLE", [{"fontSize":sFontSize}]);
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);

		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},
	
	_getMatchingLI : function(sFontSize){
		var elLi;
		
		sFontSize = sFontSize.toLowerCase();
		for(var i=0; i<this.aLIFontSizes.length; i++){
			elLi = this.aLIFontSizes[i];
			if(this._getFontSizeFromLI(elLi).toLowerCase() == sFontSize){return elLi;}
		}
		
		return null;
	},

	_getFontSizeFromLI : function(elLi){
		return elLi.firstChild.firstChild.style.fontSize;
	},
	
	_clearFontSizeSelection : function(elLi){
		for(var i=0; i<this.aLIFontSizes.length; i++){
			jindo.$Element(this.aLIFontSizes[i]).removeClass("active");
		}
	}
});
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to hyperlink
 * @name hp_SE_Hyperlink.js
 */
nhn.husky.SE2M_Hyperlink = jindo.$Class({
	name : "SE2M_Hyperlink",
	sATagMarker : "HTTP://HUSKY_TMP.MARKER/",
	
	_assignHTMLElements : function(elAppContainer){
		this.oHyperlinkButton = jindo.$$.getSingle("li.husky_seditor_ui_hyperlink", elAppContainer);
		this.oHyperlinkLayer = jindo.$$.getSingle("div.se2_layer", this.oHyperlinkButton);
		this.oLinkInput = jindo.$$.getSingle("INPUT[type=text]", this.oHyperlinkLayer);
		
		this.oBtnConfirm = jindo.$$.getSingle("button.se2_apply", this.oHyperlinkLayer);
		this.oBtnCancel = jindo.$$.getSingle("button.se2_cancel", this.oHyperlinkLayer);
		
		//this.oCbNewWin = jindo.$$.getSingle("INPUT[type=checkbox]", this.oHyperlinkLayer) || null;
	},

	_generateAutoLink : function(sAll, sBreaker, sURL, sWWWURL, sHTTPURL) {
		sBreaker = sBreaker || "";

		var sResult;
		if (sWWWURL){
			sResult = '<a href="http://'+sWWWURL+'">'+sURL+'</a>';
		} else {
			sResult = '<a href="'+sHTTPURL+'">'+sURL+'</a>';
		}
		
		return sBreaker+sResult;
	},

	/**
	 * [SMARTEDITORSUS-1405] ÀÚµ¿¸µÅ© ºñÈ°¼ºÈ­ ¿É¼ÇÀ» Ã¼Å©ÇØ¼­ Ã³¸®ÇÑ´Ù.
	 * $ON_REGISTER_CONVERTERS ¸Þ½ÃÁö°¡ SE_EditingAreaManager.$ON_MSG_APP_READY ¿¡¼­ ¼öÇàµÇ¹Ç·Î ¸ÕÀú Ã³¸®ÇÑ´Ù.
	 */
	$BEFORE_MSG_APP_READY : function(){
		var htOptions = nhn.husky.SE2M_Configuration.SE2M_Hyperlink;
		if(htOptions && htOptions.bAutolink === false){
			// ÀÚµ¿¸µÅ© ÄÁ¹öÅÍ ºñÈ°¼ºÈ­ 
			this.$ON_REGISTER_CONVERTERS = null;
			// UI enable/disable Ã³¸® Á¦¿Ü 
			this.$ON_DISABLE_MESSAGE = null;
			this.$ON_ENABLE_MESSAGE = null;
			// ºê¶ó¿ìÀúÀÇ ÀÚµ¿¸µÅ©±â´É ºñÈ°¼ºÈ­ 
			try{ this.oApp.getWYSIWYGDocument().execCommand("AutoUrlDetect", false, false); } catch(e){}
		}
	},

	$ON_MSG_APP_READY : function(){
		this.bLayerShown = false;

		this.oApp.exec("REGISTER_UI_EVENT", ["hyperlink", "click", "TOGGLE_HYPERLINK_LAYER"]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+k", "TOGGLE_HYPERLINK_LAYER", []]);
	},
	
	$ON_REGISTER_CONVERTERS : function(){
		this.oApp.exec("ADD_CONVERTER_DOM", ["IR_TO_DB", jindo.$Fn(this.irToDb, this).bind()]);
	},
	
	$LOCAL_BEFORE_FIRST : function(sMsg){
		if(!!sMsg.match(/(REGISTER_CONVERTERS)/)){
			this.oApp.acceptLocalBeforeFirstAgain(this, true);
			return true;
		}

		this._assignHTMLElements(this.oApp.htOptions.elAppContainer);
		this.sRXATagMarker = this.sATagMarker.replace(/\//g, "\\/").replace(/\./g, "\\.");
		this.oApp.registerBrowserEvent(this.oBtnConfirm, "click", "APPLY_HYPERLINK");
		this.oApp.registerBrowserEvent(this.oBtnCancel, "click", "HIDE_ACTIVE_LAYER");
		this.oApp.registerBrowserEvent(this.oLinkInput, "keydown", "EVENT_HYPERLINK_KEYDOWN");
	},
	
	//@lazyload_js TOGGLE_HYPERLINK_LAYER,APPLY_HYPERLINK[
	$ON_TOGGLE_HYPERLINK_LAYER : function(){
		if(!this.bLayerShown){
			this.oApp.exec("IE_FOCUS", []);
			this.oSelection = this.oApp.getSelection();
		}

		// hotkey may close the layer right away so delay here
		this.oApp.delayedExec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oHyperlinkLayer, null, "MSG_HYPERLINK_LAYER_SHOWN", [], "MSG_HYPERLINK_LAYER_HIDDEN", [""]], 0);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['hyperlink']);
	},
	
	$ON_MSG_HYPERLINK_LAYER_SHOWN : function(){
		this.bLayerShown = true;
		var oAnchor = this.oSelection.findAncestorByTagName("A");

		if (!oAnchor) {
			oAnchor = this._getSelectedNode();
		}
		//this.oCbNewWin.checked = false;

		if(oAnchor && !this.oSelection.collapsed){
			this.oSelection.selectNode(oAnchor);
			this.oSelection.select();
			
			var sTarget = oAnchor.target;
			//if(sTarget && sTarget == "_blank"){this.oCbNewWin.checked = true;}

			// href¼Ó¼º¿¡ ¹®Á¦°¡ ÀÖÀ» °æ¿ì, ¿¹: href="http://na&nbsp;&nbsp; ver.com", IE¿¡¼­ oAnchor.href Á¢±Ù ½Ã¿¡ ¾Ë¼ö ¾ø´Â ¿À·ù¸¦ ¹ß»ý½ÃÅ´
			try{
				var sHref = oAnchor.getAttribute("href");
				this.oLinkInput.value = sHref && sHref.indexOf("#") == -1 ? sHref : "http://";
			}catch(e){
				this.oLinkInput.value = "http://";
			}
			
			this.bModify = true;
		}else{
			this.oLinkInput.value = "http://";
			this.bModify = false;
		}
		this.oApp.delayedExec("SELECT_UI", ["hyperlink"], 0);
		this.oLinkInput.focus();
		
		this.oLinkInput.value = this.oLinkInput.value;
		this.oLinkInput.select();
	},
	
	$ON_MSG_HYPERLINK_LAYER_HIDDEN : function(){
		this.bLayerShown = false;
		
		this.oApp.exec("DESELECT_UI", ["hyperlink"]);
	},
	
	_validateTarget : function() {
		var oNavigator = jindo.$Agent().navigator(),
			bReturn = true;
		
		if(oNavigator.ie) {
			jindo.$A(this.oSelection.getNodes(true)).forEach(function(elNode, index, array){
				if(!!elNode && elNode.nodeType == 1 && elNode.tagName.toLowerCase() == "iframe" && elNode.getAttribute('s_type').toLowerCase() == "db") {
					bReturn = false;
					jindo.$A.Break();
				}
				jindo.$A.Continue();
			}, this);
		}
		
		return bReturn;
	},
	
	$ON_APPLY_HYPERLINK : function(){
		
		// [SMARTEDITORSUS-1451] ±Û°¨¿¡ ¸µÅ©¸¦ Àû¿ëÇÏÁö ¾Êµµ·Ï Ã³¸®
		if(!this._validateTarget()){
			alert(this.oApp.$MSG("SE_Hyperlink.invalidTarget"));
			return;
		}
		
		var sURL = this.oLinkInput.value;
		if(!/^((http|https|ftp|mailto):(?:\/\/)?)/.test(sURL)){
			sURL = "http://"+sURL;
		}
		sURL = sURL.replace(/\s+$/, "");
		
		var oAgent = jindo.$Agent().navigator();
		var sBlank = "";

		this.oApp.exec("IE_FOCUS", []);
		
		if(oAgent.ie){sBlank = "<span style=\"text-decoration:none;\">&nbsp;</span>";}

		if(this._validateURL(sURL)){
			//if(this.oCbNewWin.checked){
			// if(false){
				// sTarget = "_blank";
			// }else{
				sTarget = "_self";
			//}
			
			this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["HYPERLINK", {sSaveTarget:(this.bModify ? "A" : null)}]);
			
			var sBM;
			if(this.oSelection.collapsed){
				var str = "<a href='" + sURL + "' target="+sTarget+">" + sURL + "</a>" + sBlank;
				this.oSelection.pasteHTML(str);
				sBM = this.oSelection.placeStringBookmark();
			}else{
				// ºê¶ó¿ìÀú¿¡¼­ Á¦°øÇÏ´Â execcommand¿¡ createLink·Î´Â Å¸°ÙÀ» ÁöÁ¤ÇÒ ¼ö°¡ ¾ø´Ù.
				// ±×·¸±â ¶§¹®¿¡, ´õ¹Ì URLÀ» createLink¿¡ ³Ñ°Ü¼­ ¸µÅ©¸¦ ¸ÕÀú °É°í, ÀÌÈÄ¿¡ loopÀ» µ¹¸é¼­ ´õ¹Ì URLÀ» °¡Áø AÅÂ±×¸¦ Ã£¾Æ¼­ Á¤»ó URL ¹× Å¸°ÙÀ» ¼¼ÆÃ ÇØ ÁØ´Ù.
				sBM = this.oSelection.placeStringBookmark();
				this.oSelection.select();
				
				// [SMARTEDITORSUS-61] TD ¾È¿¡ ÀÖ´Â ÅØ½ºÆ®¸¦ ÀüÃ¼ ¼±ÅÃÇÏ¿© URL º¯°æÇÏ¸é ¼öÁ¤µÇÁö ¾ÊÀ½ (only IE8)
				//		SE_EditingArea_WYSIWYG ¿¡¼­´Â IEÀÎ °æ¿ì, beforedeactivate ÀÌº¥Æ®°¡ ¹ß»ýÇÏ¸é ÇöÀçÀÇ Range¸¦ ÀúÀåÇÏ°í, RESTORE_IE_SELECTION ¸Þ½ÃÁö°¡ ¹ß»ýÇÏ¸é ÀúÀåµÈ Range¸¦ Àû¿ëÇÑ´Ù.
				//		IE8 ¶Ç´Â IE7 È£È¯¸ðµåÀÌ°í TD ¾ÈÀÇ ÅØ½ºÆ® ÀüÃ¼¸¦ ¼±ÅÃÇÑ °æ¿ì  Bookmark »ý¼º ÈÄÀÇ select()¸¦ Ã³¸®ÇÒ ¶§
				//		HuskyRange ¿¡¼­ È£ÃâµÇ´Â this._oSelection.empty(); ¿¡¼­ beforedeactivate °¡ ¹ß»ýÇÏ¿© empty Ã³¸®µÈ selection ÀÌ ÀúÀåµÇ´Â ¹®Á¦°¡ ÀÖ¾î ¸µÅ©°¡ Àû¿ëµÇÁö ¾ÊÀ½.
				//		¿Ã¹Ù¸¥ selection ÀÌ ÀúÀåµÇ¾î EXECCOMMAND¿¡¼­ ¸µÅ©°¡ Àû¿ëµÉ ¼ö ÀÖµµ·Ï ÇÔ
				if(oAgent.ie && (oAgent.version === 8 || oAgent.nativeVersion === 8)){	// nativeVersion À¸·Î IE7 È£È¯¸ðµåÀÎ °æ¿ì È®ÀÎ
					this.oApp.exec("IE_FOCUS", []);
					this.oSelection.moveToBookmark(sBM);
					this.oSelection.select();
				}
				
				// createLink ÀÌÈÄ¿¡ ÀÌ¹ø¿¡ »ý¼ºµÈ A ÅÂ±×¸¦ Ã£À» ¼ö ÀÖµµ·Ï nSessionÀ» Æ÷ÇÔÇÏ´Â ´õ¹Ì ¸µÅ©¸¦ ¸¸µç´Ù.
				var nSession = Math.ceil(Math.random()*10000);

				if(sURL == ""){	// unlink
					this.oApp.exec("EXECCOMMAND", ["unlink"]);
				}else{			// createLink
					if(this._isExceptional()){
						this.oApp.exec("EXECCOMMAND", ["unlink", false, "", {bDontAddUndoHistory: true}]);
						
						var sTempUrl = "<a href='" + sURL + "' target="+sTarget+">";
 						
						jindo.$A(this.oSelection.getNodes(true)).forEach(function(value, index, array){
							var oEmptySelection = this.oApp.getEmptySelection();

							if(value.nodeType === 3){
								oEmptySelection.selectNode(value);
								oEmptySelection.pasteHTML(sTempUrl + value.nodeValue + "</a>");
							}else if(value.nodeType === 1 && value.tagName === "IMG"){
								oEmptySelection.selectNode(value);
								oEmptySelection.pasteHTML(sTempUrl + jindo.$Element(value).outerHTML() + "</a>");
							}
						}, this);
					}else{
						this.oApp.exec("EXECCOMMAND", ["createLink", false, this.sATagMarker+nSession+encodeURIComponent(sURL), {bDontAddUndoHistory: true}]);
					}
				}

				var oDoc = this.oApp.getWYSIWYGDocument();
				var aATags = oDoc.body.getElementsByTagName("A");
				var nLen = aATags.length;
				
				var rxMarker = new RegExp(this.sRXATagMarker+nSession, "gi");
				var elATag;
				
				for(var i=0; i<nLen; i++){
					elATag = aATags[i];

					var sHref = "";
					try{
						sHref = elATag.getAttribute("href");
					}catch(e){}
					if (sHref && sHref.match(rxMarker)) {
						var sNewHref = sHref.replace(rxMarker, "");
						var sDecodeHref = decodeURIComponent(sNewHref);
						if(oAgent.ie){
							jindo.$Element(elATag).attr({
								"href" : sDecodeHref,
								"target" : sTarget
							});
						//}else if(oAgent.firefox){
						}else{
							var sAContent = jindo.$Element(elATag).html();
							jindo.$Element(elATag).attr({
								"href" : sDecodeHref,
								"target" : sTarget
							});
							if(this._validateURL(sAContent)){
								jindo.$Element(elATag).html(jindo.$Element(elATag).attr("href"));
							}
						}
						/*else{
							elATag.href = sDecodeHref;
						}
						*/
					}
				}
			}
			
			this.oApp.exec("HIDE_ACTIVE_LAYER");
			setTimeout(jindo.$Fn(function(){
				var oSelection = this.oApp.getEmptySelection();
				oSelection.moveToBookmark(sBM);
				oSelection.collapseToEnd();
				oSelection.select();
				oSelection.removeStringBookmark(sBM);
	
				this.oApp.exec("FOCUS");
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["HYPERLINK", {sSaveTarget:(this.bModify ? "A" : null)}]);
			}, this).bind(), 17);			
		}else{
			alert(this.oApp.$MSG("SE_Hyperlink.invalidURL"));
			this.oLinkInput.focus();
		}
	},
	
	_isExceptional : function(){
		var oNavigator = jindo.$Agent().navigator(),
			bImg = false, bEmail = false;
		
		if(!oNavigator.ie){
			return false;
		}

		// [SMARTEDITORSUS-612] ÀÌ¹ÌÁö ¼±ÅÃ ÈÄ ¸µÅ© Ãß°¡ÇßÀ» ¶§ ¸µÅ©°¡ °É¸®Áö ¾Ê´Â ¹®Á¦
		if(this.oApp.getWYSIWYGDocument().selection && this.oApp.getWYSIWYGDocument().selection.type === "None"){
			bImg = jindo.$A(this.oSelection.getNodes()).some(function(value, index, array){
				if(value.nodeType === 1 && value.tagName === "IMG"){
					return true;
				}
			}, this);
			
			if(bImg){
				return true;
			}	
		}

		if(oNavigator.nativeVersion > 8){	// version? nativeVersion?
			return false;
		}	
		
		// [SMARTEDITORSUS-579] IE8 ÀÌÇÏ¿¡¼­ E-mail ÆÐÅÏ ¹®ÀÚ¿­¿¡ URL ¸µÅ© ¸ø°Å´Â ÀÌ½´
		bEmail = jindo.$A(this.oSelection.getTextNodes()).some(function(value, index, array){
			if(value.nodeValue.indexOf("@") >= 1){
				return true;
			}
		}, this);

		if(bEmail){
			return true;
		}
		
		return false;
	},
	
	//@lazyload_js]
	$ON_EVENT_HYPERLINK_KEYDOWN : function(oEvent){
		if (oEvent.key().enter){
			this.oApp.exec("APPLY_HYPERLINK");
			oEvent.stop();
		}
	},

	/**
	 * [MUG-1265] ¹öÆ°ÀÌ »ç¿ëºÒ°¡ »óÅÂÀÌ¸é ÀÚµ¿º¯È¯±â´ÉÀ» ¸·´Â´Ù.
	 * @see http://stackoverflow.com/questions/7556007/avoid-transformation-text-to-link-ie-contenteditable-mode
	 * IE9 ÀÌÀü ¹öÀüÀº AutoURlDetectÀ» »ç¿ëÇÒ ¼ö ¾ø¾î ¿À·ù ¹ß»ýµÇ±â ¶§¹®¿¡, try catch·Î ºí·° Ã³¸®(http://msdn.microsoft.com/en-us/library/aa769893%28VS.85%29.aspx)
	 */
	$ON_DISABLE_MESSAGE : function(sCmd) {
		if(sCmd !== "TOGGLE_HYPERLINK_LAYER"){
			return;
		}
		try{ this.oApp.getWYSIWYGDocument().execCommand("AutoUrlDetect", false, false); } catch(e){}
		this._bDisabled = true;
	},

	/**
	 * [MUG-1265] ¹öÆ°ÀÌ »ç¿ë°¡´É »óÅÂÀÌ¸é ÀÚµ¿º¯È¯±â´ÉÀ» º¹¿øÇØÁØ´Ù.
	 */
	$ON_ENABLE_MESSAGE : function(sCmd) {
		if(sCmd !== "TOGGLE_HYPERLINK_LAYER"){
			return;
		}
		try{ this.oApp.getWYSIWYGDocument().execCommand("AutoUrlDetect", false, true); } catch(e){}
		this._bDisabled = false;
	},

	irToDb : function(oTmpNode){
		if(this._bDisabled){	// [MUG-1265] ¹öÆ°ÀÌ »ç¿ëºÒ°¡ »óÅÂÀÌ¸é ÀÚµ¿º¯È¯ÇÏÁö ¾Ê´Â´Ù.
			return;
		}
		//ÀúÀå ½ÃÁ¡¿¡ ÀÚµ¿ ¸µÅ©¸¦ À§ÇÑ ÇÔ¼ö.
		//[SMARTEDITORSUS-1207][IE][¸ÞÀÏ] object »ðÀÔ ÈÄ ±ÛÀ» ÀúÀåÇÏ¸é IE ºê¶ó¿ìÀú°¡ Á×¾î¹ö¸®´Â Çö»ó   
		//¿øÀÎ : È®ÀÎ ºÒ°¡. IE ÀúÀÛ±Ç °ü·Ã ÀÌ½´·Î ÃßÁ¤
		//ÇØ°á : contents¸¦ °¡Áö°í ÀÖ´Â div ÅÂ±×¸¦ ÀÌ ÇÔ¼ö ³»ºÎ¿¡¼­ º¹»çÇÏ¿© ¼öÁ¤ ÈÄ call by reference·Î ³Ñ¾î¿Â º¯¼öÀÇ innerHTMLÀ» º¯°æ	
		var oCopyNode = oTmpNode.cloneNode(true);
		try{
			oCopyNode.innerHTML;
		}catch(e) {
			oCopyNode = jindo.$(oTmpNode.outerHTML);
		}
	 
		var oTmpRange = this.oApp.getEmptySelection();
		var elFirstNode = oTmpRange._getFirstRealChild(oCopyNode);
		var elLastNode = oTmpRange._getLastRealChild(oCopyNode);
		var waAllNodes = jindo.$A(oTmpRange._getNodesBetween(elFirstNode, elLastNode));
		var aAllTextNodes = waAllNodes.filter(function(elNode){return (elNode && elNode.nodeType === 3);}).$value();
		var a = aAllTextNodes;
		
		/*
		// ÅØ½ºÆ® °Ë»öÀÌ ¿ëÀÌ ÇÏµµ·Ï ²÷¾îÁø ÅØ½ºÆ® ³ëµå°¡ ÀÖÀ¸¸é ÇÕÃÄÁÜ. (È­¸é»óÀ¸·Î ABC¶ó°í º¸ÀÌ³ª »óÈ²¿¡ µû¶ó ½ÇÁ¦ 2°³ÀÇ ÅØ½ºÆ® A, BC·Î ÀÌ·ç¾îÁ® ÀÖÀ» ¼ö ÀÖÀ½. ÀÌ¸¦ ABC ÇÏ³ªÀÇ ³ëµå·Î ¸¸µé¾î ÁÜ.)
		// ¹®Á¦ ¹ß»ý °¡´É¼º¿¡ ºñÇØ¼­ ÆÛÆ÷¸Õ½º³ª »çÀÌµå ÀÌÆåÆ® °¡´É¼º ³ô¾Æ ÀÏ´Ü ÁÖ¼®
		var aCleanTextNodes = [];
		for(var i=0, nLen=aAllTextNodes.length; i<nLen; i++){
			if(a[i].nextSibling && a[i].nextSibling.nodeType === 3){
				a[i].nextSibling.nodeValue += a[i].nodeValue;
				a[i].parentNode.removeChild(a[i]);
			}else{
				aCleanTextNodes[aCleanTextNodes.length] = a[i];
			}
		}
		*/
		var aCleanTextNodes = aAllTextNodes;
		
		// IE¿¡¼­ PRE¸¦ Á¦¿ÜÇÑ ´Ù¸¥ ÅÂ±× ÇÏÀ§¿¡ ÀÖ´Â ÅØ½ºÆ® ³ëµå´Â ÁÙ¹Ù²Þ µîÀÇ °ªÀ» º¯Áú½ÃÅ´
		var elTmpDiv = this.oApp.getWYSIWYGDocument().createElement("DIV");
		var elParent, bAnchorFound;
		var sTmpStr = "@"+(new Date()).getTime()+"@";
		var rxTmpStr = new RegExp(sTmpStr, "g");
		for(var i=0, nLen=aAllTextNodes.length; i<nLen; i++){
			// Anchor°¡ ÀÌ¹Ì °É·Á ÀÖ´Â ÅØ½ºÆ®ÀÌ¸é ¸µÅ©¸¦ ´Ù½Ã °ÉÁö ¾ÊÀ½.
			elParent = a[i].parentNode;
			bAnchorFound = false;
			while(elParent){
				if(elParent.tagName === "A" || elParent.tagName === "PRE"){
					bAnchorFound = true;
					break;
				}
				elParent = elParent.parentNode;
			}
			if(bAnchorFound){
				continue;
			}
			// www.¶Ç´Â http://À¸·Î ½ÃÀÛÇÏ´Â ÅØ½ºÆ®¿¡ ¸µÅ© °É¾î ÁÜ
			// IE¿¡¼­ ÅØ½ºÆ® ³ëµå ¾ÕÂÊÀÇ ½ºÆäÀÌ½º³ª ÁÖ¼®µîÀÌ »ç¶óÁö´Â Çö»óÀÌ ÀÖ¾î sTmpStrÀ» ¾Õ¿¡ ºÙ¿©ÁÜ.
			elTmpDiv.innerHTML = "";
			
			
			try {
				elTmpDiv.appendChild(a[i].cloneNode(true));

				// IE¿¡¼­ innerHTML¸¦ ÀÌ¿ë ÇØ Á÷Á¢ ÅØ½ºÆ® ³ëµå °ªÀ» ÇÒ´ç ÇÒ °æ¿ì ÁÙ¹Ù²ÞµîÀÌ ±úÁú ¼ö ÀÖ¾î, ÅØ½ºÆ® ³ëµå·Î ¸¸µé¾î¼­ ÀÌ¸¦ ¹Ù·Î append ½ÃÄÑÁÜ
				elTmpDiv.innerHTML = (sTmpStr+elTmpDiv.innerHTML).replace(/(&nbsp|\s)?(((?!http:\/\/)www\.(?:(?!\&nbsp;|\s|"|').)+)|(http:\/\/(?:(?!&nbsp;|\s|"|').)+))/ig, this._generateAutoLink);

				// innerHTML ³»¿¡ ÅØ½ºÆ®°¡ ÀÖÀ» °æ¿ì insert ½Ã¿¡ ÁÖº¯ ÅØ½ºÆ® ³ëµå¿Í ÇÕÃÄÁö´Â Çö»óÀÌ ÀÖ¾î div·Î À§Ä¡¸¦ ¸ÕÀú Àâ°í ÇÏ³ª¾¿ »ðÀÔ
				a[i].parentNode.insertBefore(elTmpDiv, a[i]);
				a[i].parentNode.removeChild(a[i]);
			} catch(e1) {
				
			}
			
			while(elTmpDiv.firstChild){
				elTmpDiv.parentNode.insertBefore(elTmpDiv.firstChild, elTmpDiv);
			}
			elTmpDiv.parentNode.removeChild(elTmpDiv);
//			alert(a[i].nodeValue);
		}
		elTmpDiv = oTmpRange = elFirstNode = elLastNode = waAllNodes = aAllTextNodes = a = aCleanTextNodes = elParent = null;
		oCopyNode.innerHTML = oCopyNode.innerHTML.replace(rxTmpStr, "");
		oTmpNode.innerHTML = oCopyNode.innerHTML;
		oCopyNode = null;
//alert(oTmpNode.innerHTML);
	},

	_getSelectedNode : function(){
		var aNodes = this.oSelection.getNodes();
		
		for (var i = 0; i < aNodes.length; i++) {
			if (aNodes[i].tagName && aNodes[i].tagName == "A") {
				return aNodes[i];
			}
		}
	},
	
	_validateURL : function(sURL){
		if(!sURL){return false;}

		// escape ºÒ°¡´ÉÇÑ %°¡ µé¾îÀÖ³ª È®ÀÎ
		try{
			var aURLParts = sURL.split("?");
			aURLParts[0] = aURLParts[0].replace(/%[a-z0-9]{2}/gi, "U");
			decodeURIComponent(aURLParts[0]);
		}catch(e){
			return false;
		}
		return /^(http|https|ftp|mailto):(\/\/)?(([-°¡-ÆR]|\w)+(?:[\/\.:@]([-°¡-ÆR]|\w)+)+)\/?(.*)?\s*$/i.test(sURL);
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to changing the lineheight using layer
 * @name hp_SE2M_LineHeightWithLayerUI.js
 */
nhn.husky.SE2M_LineHeightWithLayerUI = jindo.$Class({
	name : "SE2M_LineHeightWithLayerUI",
	MIN_LINE_HEIGHT : 50,
	
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["lineHeight", "click", "SE2M_TOGGLE_LINEHEIGHT_LAYER"]);
	},

	//@lazyload_js SE2M_TOGGLE_LINEHEIGHT_LAYER[
	_assignHTMLObjects : function(elAppContainer) {
		//this.elLineHeightSelect = jindo.$$.getSingle("SELECT.husky_seditor_ui_lineHeight_select", elAppContainer);
		this.oDropdownLayer = jindo.$$.getSingle("DIV.husky_se2m_lineHeight_layer", elAppContainer);
		this.aLIOptions = jindo.$A(jindo.$$("LI", this.oDropdownLayer)).filter(function(v,i,a){return (v.firstChild !== null);})._array;
		
		this.oInput = jindo.$$.getSingle("INPUT", this.oDropdownLayer);

		var tmp = jindo.$$.getSingle(".husky_se2m_lineHeight_direct_input", this.oDropdownLayer);
		tmp = jindo.$$("BUTTON", tmp);
		this.oBtn_up = tmp[0];
		this.oBtn_down = tmp[1];
		this.oBtn_ok = tmp[2];
		this.oBtn_cancel = tmp[3];
	},
	
	$LOCAL_BEFORE_FIRST : function(){
		this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);

		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [this.aLIOptions]);

		for(var i=0; i<this.aLIOptions.length; i++){
			this.oApp.registerBrowserEvent(this.aLIOptions[i], "click", "SET_LINEHEIGHT_FROM_LAYER_UI", [this._getLineHeightFromLI(this.aLIOptions[i])]);
		}
			
		this.oApp.registerBrowserEvent(this.oBtn_up, "click", "SE2M_INC_LINEHEIGHT", []);
		this.oApp.registerBrowserEvent(this.oBtn_down, "click", "SE2M_DEC_LINEHEIGHT", []);
		this.oApp.registerBrowserEvent(this.oBtn_ok, "click", "SE2M_SET_LINEHEIGHT_FROM_DIRECT_INPUT", []);
		this.oApp.registerBrowserEvent(this.oBtn_cancel, "click", "SE2M_CANCEL_LINEHEIGHT", []);
		
		this.oApp.registerBrowserEvent(this.oInput, "keydown", "EVENT_SE2M_LINEHEIGHT_KEYDOWN");
	},
	
	$ON_EVENT_SE2M_LINEHEIGHT_KEYDOWN : function(oEvent){
		if (oEvent.key().enter){
			this.oApp.exec("SE2M_SET_LINEHEIGHT_FROM_DIRECT_INPUT");
			oEvent.stop();
		}
	},

	$ON_SE2M_TOGGLE_LINEHEIGHT_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oDropdownLayer, null, "LINEHEIGHT_LAYER_SHOWN", [], "LINEHEIGHT_LAYER_HIDDEN", []]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['lineheight']);
	},
	
	$ON_SE2M_INC_LINEHEIGHT : function(){
		this.oInput.value = parseInt(this.oInput.value, 10) || this.MIN_LINE_HEIGHT;
		this.oInput.value++;
	},

	$ON_SE2M_DEC_LINEHEIGHT : function(){
		this.oInput.value = parseInt(this.oInput.value, 10) || this.MIN_LINE_HEIGHT;
		if(this.oInput.value > this.MIN_LINE_HEIGHT){this.oInput.value--;}
	},
	
	$ON_LINEHEIGHT_LAYER_SHOWN : function(){
		this.oApp.exec("SELECT_UI", ["lineHeight"]);
		this.oInitialSelection = this.oApp.getSelection();
		
		var nLineHeight = this.oApp.getLineStyle("lineHeight");
		
		if(nLineHeight != null && nLineHeight !== 0){
			this.oInput.value = (nLineHeight*100).toFixed(0);
			var elLi = this._getMatchingLI(this.oInput.value+"%");
			if(elLi){jindo.$Element(elLi.firstChild).addClass("active");}
		}else{
			this.oInput.value = "";
		}
	},

	$ON_LINEHEIGHT_LAYER_HIDDEN : function(){
		this.oApp.exec("DESELECT_UI", ["lineHeight"]);
		this._clearOptionSelection();
	},
	
	$ON_SE2M_SET_LINEHEIGHT_FROM_DIRECT_INPUT : function(){
		var nInputValue = parseInt(this.oInput.value, 10);
		var sValue = (nInputValue < this.MIN_LINE_HEIGHT) ? this.MIN_LINE_HEIGHT : nInputValue;
		this._setLineHeightAndCloseLayer(sValue);
	},

	$ON_SET_LINEHEIGHT_FROM_LAYER_UI : function(sValue){
		this._setLineHeightAndCloseLayer(sValue);
	},
	
	$ON_SE2M_CANCEL_LINEHEIGHT : function(){
		this.oInitialSelection.select();
		this.oApp.exec("HIDE_ACTIVE_LAYER");
	},
	
	_setLineHeightAndCloseLayer : function(sValue){
		var nLineHeight = parseInt(sValue, 10)/100;
		if(nLineHeight>0){
			this.oApp.exec("SET_LINE_STYLE", ["lineHeight", nLineHeight]);
		}else{
			alert(this.oApp.$MSG("SE_LineHeight.invalidLineHeight"));
		}
		this.oApp.exec("SE2M_TOGGLE_LINEHEIGHT_LAYER", []);
		
		var oNavigator = jindo.$Agent().navigator();
		if(oNavigator.chrome || oNavigator.safari){
			this.oApp.exec("FOCUS");	// [SMARTEDITORSUS-654]
		}
	},
	
	_getMatchingLI : function(sValue){
		var elLi;
		
		sValue = sValue.toLowerCase();
		for(var i=0; i<this.aLIOptions.length; i++){
			elLi = this.aLIOptions[i];
			if(this._getLineHeightFromLI(elLi).toLowerCase() == sValue){return elLi;}
		}
		
		return null;
	},

	_getLineHeightFromLI : function(elLi){
		return elLi.firstChild.firstChild.innerHTML;
	},
	
	_clearOptionSelection : function(elLi){
		for(var i=0; i<this.aLIOptions.length; i++){
			jindo.$Element(this.aLIOptions[i].firstChild).removeClass("active");
		}
	}
	//@lazyload_js]
});
//}  
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to setting/changing the line style
 * @name hp_SE_LineStyler.js
 */
nhn.husky.SE2M_LineStyler = jindo.$Class({
	name : "SE2M_LineStyler",
	
	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", ["getLineStyle", jindo.$Fn(this.getLineStyle, this).bind()]);
  	},

	//SMARTEDITORSUS-987 SE2M_TOGGLE_LINEHEIGHT_LAYER,SET_LINE_STYLE µ¿Àû ·Îµù Á¦°Å
	$ON_SE2M_TOGGLE_LINEHEIGHT_LAYER : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["getLineStyle", jindo.$Fn(this.getLineStyle, this).bind()]);
	},
	
	$ON_SET_LINE_STYLE : function(sStyleName, styleValue, htOptions){
		this.oSelection = this.oApp.getSelection();
		var nodes = this._getSelectedNodes(false);
		this.setLineStyle(sStyleName, styleValue, htOptions, nodes);
		
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},
	
	$ON_SET_LINE_BLOCK_STYLE : function(sStyleName, styleValue, htOptions){
		this.oSelection = this.oApp.getSelection();
		this.setLineBlockStyle(sStyleName, styleValue, htOptions);
		
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},
	
	getLineStyle : function(sStyle){
		var nodes = this._getSelectedNodes(false);

		var curWrapper, prevWrapper;
		var sCurStyle, sStyleValue;

		if(nodes.length === 0){return null;}
		
		var iLength = nodes.length;
		
		if(iLength === 0){
			sStyleValue = null;
		}else{
			prevWrapper = this._getLineWrapper(nodes[0]);
			sStyleValue = this._getWrapperLineStyle(sStyle, prevWrapper);
		}

		var firstNode = this.oSelection.getStartNode();

		if(sStyleValue != null){
			for(var i=1; i<iLength; i++){
				if(this._isChildOf(nodes[i], curWrapper)){continue;}
				if(!nodes[i]){continue;}
				
				curWrapper = this._getLineWrapper(nodes[i]);
				if(curWrapper == prevWrapper){continue;}
	
				sCurStyle = this._getWrapperLineStyle(sStyle, curWrapper);
				
				if(sCurStyle != sStyleValue){
					sStyleValue = null;
					break;
				}
	
				prevWrapper = curWrapper;
			}
		}
		
		curWrapper = this._getLineWrapper(nodes[iLength-1]);

		var lastNode = this.oSelection.getEndNode();

		selectText = jindo.$Fn(function(firstNode, lastNode){
			this.oSelection.setEndNodes(firstNode, lastNode);
			this.oSelection.select();
			
			this.oApp.exec("CHECK_STYLE_CHANGE", []);
		}, this).bind(firstNode, lastNode);
		
		setTimeout(selectText, 0);

		return sStyleValue;
	},

	// height in percentage. For example pass 1 to set the line height to 100% and 1.5 to set it to 150%
	setLineStyle : function(sStyleName, styleValue, htOptions, nodes){
		thisRef = this;
		
		var bWrapperCreated = false;
		
		function _setLineStyle(div, sStyleName, styleValue){
			if(!div){
				bWrapperCreated = true;

				// try to wrap with P first
				try{
					div = thisRef.oSelection.surroundContentsWithNewNode("P");
				// if the range contains a block-level tag, wrap it with a DIV
				}catch(e){
					div = thisRef.oSelection.surroundContentsWithNewNode("DIV");
				}
			}

			if(typeof styleValue == "function"){
				styleValue(div);
			}else{
				div.style[sStyleName] = styleValue;
			}

			if(div.childNodes.length === 0){
				div.innerHTML = "&nbsp;";
			}

			return div;
		}
		
		function isInBody(node){
			while(node && node.tagName != "BODY"){
				node = nhn.DOMFix.parentNode(node);
			}
			if(!node){return false;}

			return true;
		}

		if(nodes.length === 0){
			return;
		}
		
		var curWrapper, prevWrapper;
		var iLength = nodes.length;
		
		if((!htOptions || !htOptions["bDontAddUndoHistory"])){
			this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["LINE STYLE"]);
		}
		
		prevWrapper = this._getLineWrapper(nodes[0]);
		prevWrapper = _setLineStyle(prevWrapper, sStyleName, styleValue);

		var startNode = prevWrapper;
		var endNode = prevWrapper;

		for(var i=1; i<iLength; i++){
			// Skip the node if a copy of the node were wrapped and the actual node no longer exists within the document.
			try{
				if(!isInBody(nhn.DOMFix.parentNode(nodes[i]))){continue;}
			}catch(e){continue;}

			if(this._isChildOf(nodes[i], curWrapper)){continue;}

			curWrapper = this._getLineWrapper(nodes[i]);
			
			if(curWrapper == prevWrapper){continue;}

			curWrapper = _setLineStyle(curWrapper, sStyleName, styleValue);

			prevWrapper = curWrapper;
		}

		endNode = curWrapper || startNode;

		if(bWrapperCreated && (!htOptions || !htOptions.bDoNotSelect)) {
			setTimeout(jindo.$Fn(function(startNode, endNode, htOptions){
				if(startNode == endNode){
					this.oSelection.selectNodeContents(startNode);

					if(startNode.childNodes.length==1 && startNode.firstChild.tagName == "BR"){
						this.oSelection.collapseToStart();
					}
				}else{
					this.oSelection.setEndNodes(startNode, endNode);
				}

				this.oSelection.select();

				if((!htOptions || !htOptions["bDontAddUndoHistory"])){
					this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["LINE STYLE"]);
				}
			}, this).bind(startNode, endNode, htOptions), 0);
		}
	},
	
	/**
	 * Block Style Àû¿ë
	 */
	setLineBlockStyle : function(sStyleName, styleValue, htOptions) {
		var htSelectedTDs = {};
		//var aTempNodes = aTextnodes = [];
		var aTempNodes = [];
		var aTextnodes = [];
		this.oApp.exec("GET_SELECTED_TD_BLOCK",['aTdCells',htSelectedTDs]);

		var aNodes = htSelectedTDs.aTdCells;
		
		for( var j = 0; j < aNodes.length ; j++){
			this.oSelection.selectNode(aNodes[j]);
			aTempNodes = this.oSelection.getNodes();
			
			for(var k = 0, m = 0; k < aTempNodes.length ; k++){		
				if(aTempNodes[k].nodeType == 3 || (aTempNodes[k].tagName == "BR" && k == 0)) {
					aTextnodes[m] = aTempNodes[k];
					m ++;
				}
			}
			this.setLineStyle(sStyleName, styleValue, htOptions, aTextnodes);
			aTempNodes = aTextnodes = [];
		}
	},

	getTextNodes : function(bSplitTextEndNodes, oSelection){
		var txtFilter = function(oNode){
			// ÆíÁý Áß¿¡ »ý°Ü³­ ºó LI/P¿¡µµ ½ºÅ¸ÀÏ ¸ÔÀÌµµ·Ï Æ÷ÇÔÇÔ
			if((oNode.nodeType == 3 && oNode.nodeValue != "\n" && oNode.nodeValue != "") || (oNode.tagName == "LI" && oNode.innerHTML == "") || (oNode.tagName == "P" && oNode.innerHTML == "")){
				return true;
			}else{
				return false;
			}
		};

		return oSelection.getNodes(bSplitTextEndNodes, txtFilter);
	},

	_getSelectedNodes : function(bDontUpdate){
		if(!bDontUpdate){
			this.oSelection = this.oApp.getSelection();
		}

		// ÆäÀÌÁö ÃÖÇÏ´Ü¿¡ ºó LI ÀÖÀ» °æ¿ì ÇØ´ç LI Æ÷ÇÔÇÏµµ·Ï expand
		if(this.oSelection.endContainer.tagName == "LI" && this.oSelection.endOffset == 0 && this.oSelection.endContainer.innerHTML == ""){
			this.oSelection.setEndAfter(this.oSelection.endContainer);
		}

		if(this.oSelection.collapsed){this.oSelection.selectNode(this.oSelection.commonAncestorContainer);}
			
		//var nodes = this.oSelection.getTextNodes();
		var nodes = this.getTextNodes(false, this.oSelection);

		if(nodes.length === 0){
			var tmp = this.oSelection.getStartNode();
			if(tmp){
				nodes[0] = tmp;
			}else{
				var elTmp = this.oSelection._document.createTextNode("\u00A0");
				this.oSelection.insertNode(elTmp);
				nodes = [elTmp];
			}
		}
		return nodes;
	},
	
	_getWrapperLineStyle : function(sStyle, div){
		var sStyleValue = null;
		if(div && div.style[sStyle]){
			sStyleValue = div.style[sStyle];
		}else{
			div = this.oSelection.commonAncesterContainer;
			while(div && !this.oSelection.rxLineBreaker.test(div.tagName)){
				if(div && div.style[sStyle]){
					sStyleValue = div.style[sStyle];
					break;
				}
				div = nhn.DOMFix.parentNode(div);
			}
		}

		return sStyleValue;
	},

	_isChildOf : function(node, container){
		while(node && node.tagName != "BODY"){
			if(node == container){return true;}
			node = nhn.DOMFix.parentNode(node);
		}

		return false;
	},
 	_getLineWrapper : function(node){
		var oTmpSelection = this.oApp.getEmptySelection();
		oTmpSelection.selectNode(node);
		var oLineInfo = oTmpSelection.getLineInfo();
		var oStart = oLineInfo.oStart;
		var oEnd = oLineInfo.oEnd;

		var a, b;
		var breakerA, breakerB;
		var div = null;
	
		a = oStart.oNode;
		breakerA = oStart.oLineBreaker;
		b = oEnd.oNode;
		breakerB = oEnd.oLineBreaker;

		this.oSelection.setEndNodes(a, b);

		if(breakerA == breakerB){
			if(breakerA.tagName == "P" || breakerA.tagName == "DIV" || breakerA.tagName == "LI"){
//			if(breakerA.tagName == "P" || breakerA.tagName == "DIV"){
				div = breakerA;
			}else{
				this.oSelection.setEndNodes(breakerA.firstChild, breakerA.lastChild);
			}
		}
		
		return div;
 	}
 });
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to detecting the style change
 * @name hp_SE_WYSIWYGStyleGetter.js
 */
nhn.husky.SE_WYSIWYGStyleGetter = jindo.$Class({
	name : "SE_WYSIWYGStyleGetter",

	hKeyUp : null,
	
	getStyleInterval : 200,

	oStyleMap : {
		fontFamily : {
			type : "Value",
			css : "fontFamily"
		},
		fontSize : {
			type : "Value",
			css : "fontSize"
		},
		lineHeight : {
			type : "Value",
			css : "lineHeight",
			converter : function(sValue, oStyle){
				if(!sValue.match(/px$/)){
					return sValue;
				}

				return Math.ceil((parseInt(sValue, 10)/parseInt(oStyle.fontSize, 10))*10)/10;
			}
		},
		bold : {
			command : "bold"
		},
		underline : {
			command : "underline"
		},
		italic : {
			command : "italic"
		},
		lineThrough : {
			command : "strikethrough"
		},
		superscript : {
			command : "superscript"
		},
		subscript : {
			command : "subscript"
		},
		justifyleft : {
			command : "justifyleft"
		},
		justifycenter : {
			command : "justifycenter"
		},
		justifyright : {
			command : "justifyright"
		},
		justifyfull : {
			command : "justifyfull"
		},
		orderedlist : {
			command : "insertorderedlist"
		},
		unorderedlist : {
			command : "insertunorderedlist"
		}
	},

	$init : function(){
		this.oStyle = this._getBlankStyle();
	},

	$LOCAL_BEFORE_ALL : function(){
		return (this.oApp.getEditingMode() == "WYSIWYG");
	},
	
	$ON_MSG_APP_READY : function(){
		this.oDocument = this.oApp.getWYSIWYGDocument();
		this.oApp.exec("ADD_APP_PROPERTY", ["getCurrentStyle", jindo.$Fn(this.getCurrentStyle, this).bind()]);
		
		if(jindo.$Agent().navigator().safari || jindo.$Agent().navigator().chrome || jindo.$Agent().navigator().ie){
			this.oStyleMap.textAlign = {
				type : "Value",
				css : "textAlign"
			};
		}
	},
	
	$ON_EVENT_EDITING_AREA_MOUSEUP : function(oEvnet){
		/*
		if(this.hKeyUp){
			clearTimeout(this.hKeyUp);
		}
		this.oApp.delayedExec("CHECK_STYLE_CHANGE", [], 100);
		*/
		this.oApp.exec("CHECK_STYLE_CHANGE");
	},

	$ON_EVENT_EDITING_AREA_KEYPRESS : function(oEvent){
		// ctrl+a in FF triggers keypress event with keyCode 97, other browsers don't throw keypress event for ctrl+a
		var oKeyInfo;
		if(this.oApp.oNavigator.firefox){
			oKeyInfo = oEvent.key();
			if(oKeyInfo.ctrl && oKeyInfo.keyCode == 97){
				return;
			}
		}

		if(this.bAllSelected){
			this.bAllSelected = false;
			return;
		}

		/*
		// queryCommandState often fails to return correct result for Korean/Enter. So just ignore them.
		if(this.oApp.oNavigator.firefox && (oKeyInfo.keyCode == 229 || oKeyInfo.keyCode == 13)){
			return;
		}
		*/
		
		this.oApp.exec("CHECK_STYLE_CHANGE");
		//this.oApp.delayedExec("CHECK_STYLE_CHANGE", [], 0);
	},
	
	$ON_EVENT_EDITING_AREA_KEYDOWN : function(oEvent){
		var oKeyInfo = oEvent.key();

		// ctrl+a
		if((this.oApp.oNavigator.ie || this.oApp.oNavigator.firefox) && oKeyInfo.ctrl && oKeyInfo.keyCode == 65){
			this.oApp.exec("RESET_STYLE_STATUS");
			this.bAllSelected = true;
			return;
		}

		/*
		backspace 8
		enter 13
		page up 33
		page down 34
		end 35
		home 36
		left arrow 37
		up arrow 38
		right arrow 39
		down arrow 40
		insert 45
		delete 46
		*/
		// other key strokes are taken care by keypress event
		if(!(oKeyInfo.keyCode == 8 || (oKeyInfo.keyCode >= 33 && oKeyInfo.keyCode <= 40) || oKeyInfo.keyCode == 45 || oKeyInfo.keyCode == 46)) return;

		// take care of ctrl+a -> delete/bksp sequence
		if(this.bAllSelected){
			// firefox will throw both keydown and keypress events for those input(keydown first), so let keypress take care of them
			if(this.oApp.oNavigator.firefox){
				return;
			}
			
			this.bAllSelected = false;
			return;
		}

		this.oApp.exec("CHECK_STYLE_CHANGE");
	},
	
	$ON_CHECK_STYLE_CHANGE : function(){
		this._getStyle();
	},
	
	$ON_RESET_STYLE_STATUS : function(){
		this.oStyle = this._getBlankStyle();
		var oBodyStyle = this._getStyleOf(this.oApp.getWYSIWYGDocument().body);
		this.oStyle.fontFamily = oBodyStyle.fontFamily;
		this.oStyle.fontSize = oBodyStyle.fontSize;
		this.oStyle["justifyleft"]="@^";
		for(var sAttributeName in this.oStyle){
			//this.oApp.exec("SET_STYLE_STATUS", [sAttributeName, this.oStyle[sAttributeName]]);
			this.oApp.exec("MSG_STYLE_CHANGED", [sAttributeName, this.oStyle[sAttributeName]]);
		}
	},
	
	getCurrentStyle : function(){
		return this.oStyle;
	},
	
	_check_style_change : function(){
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},

	_getBlankStyle : function(){
		var oBlankStyle = {};
		for(var attributeName in this.oStyleMap){
			if(this.oStyleMap[attributeName].type == "Value"){
				oBlankStyle[attributeName] = "";
			}else{
				oBlankStyle[attributeName] = 0;
			}
		}
		
		return oBlankStyle;
	},

	_getStyle : function(){
		var oStyle;
		if(nhn.CurrentSelection.isCollapsed()){
			oStyle = this._getStyleOf(nhn.CurrentSelection.getCommonAncestorContainer());
		}else{
			var oSelection = this.oApp.getSelection();
			
			var funcFilter = function(oNode){
				if (!oNode.childNodes || oNode.childNodes.length == 0)
					return true;
				else
					return false;
			}

			var aBottomNodes = oSelection.getNodes(false, funcFilter);

			if(aBottomNodes.length == 0){
				oStyle = this._getStyleOf(oSelection.commonAncestorContainer);
			}else{
				oStyle = this._getStyleOf(aBottomNodes[0]);
			}
		}
		
		for(attributeName in oStyle){
			if(this.oStyleMap[attributeName].converter){
				oStyle[attributeName] = this.oStyleMap[attributeName].converter(oStyle[attributeName], oStyle);
			}
		
			if(this.oStyle[attributeName] != oStyle[attributeName]){
				this.oApp.exec("MSG_STYLE_CHANGED", [attributeName, oStyle[attributeName]]);
			}
		}

		this.oStyle = oStyle;
	},

	_getStyleOf : function(oNode){
		var oStyle = this._getBlankStyle();
		
		// this must not happen
		if(!oNode){
			return oStyle;
		}
		
		if( oNode.nodeType == 3 ){
			oNode = oNode.parentNode;
		}else if( oNode.nodeType == 9 ){
			//document¿¡´Â css¸¦ Àû¿ëÇÒ ¼ö ¾øÀ½.
			oNode = oNode.body;
		}
		
		var welNode = jindo.$Element(oNode);
		var attribute, cssName;

		for(var styleName in this.oStyle){
			attribute = this.oStyleMap[styleName];
			if(attribute.type && attribute.type == "Value"){
				try{
					if(attribute.css){
						var sValue = welNode.css(attribute.css);
						if(styleName == "fontFamily"){
							sValue = sValue.split(/,/)[0];
						}
		
						oStyle[styleName] = sValue;
					} else if(attribute.command){
						oStyle[styleName] = this.oDocument.queryCommandState(attribute.command);
					} else {
						// todo
					}
				}catch(e){}
			}else{
				if(attribute.command){
					try{
						if(this.oDocument.queryCommandState(attribute.command)){
							oStyle[styleName] = "@^";
						}else{
							oStyle[styleName] = "@-";
						}
					}catch(e){}
				}else{
					// todo
				}
			}
		}
		
		switch(oStyle["textAlign"]){
		case "left":
			oStyle["justifyleft"]="@^";
			break;
		case "center":
			oStyle["justifycenter"]="@^";
			break;
		case "right":
			oStyle["justifyright"]="@^";
			break;
		case "justify":
			oStyle["justifyfull"]="@^";
			break;
		}
		
		// IE¿¡¼­´Â ±âº» Á¤·ÄÀÌ queryCommandState·Î ³Ñ¾î¿ÀÁö ¾Ê¾Æ¼­ Á¤·ÄÀÌ ¾ø´Ù¸é, ¿ÞÂÊ Á¤·Ä·Î °¡Á¤ÇÔ
		if(oStyle["justifyleft"]=="@-" && oStyle["justifycenter"]=="@-" && oStyle["justifyright"]=="@-" && oStyle["justifyfull"]=="@-"){oStyle["justifyleft"]="@^";}
		
		return oStyle;
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to styling the font
 * @name hp_SE_WYSIWYGStyler.js
 * @required SE_EditingArea_WYSIWYG, HuskyRangeManager
 */
nhn.husky.SE_WYSIWYGStyler = jindo.$Class({
	name : "SE_WYSIWYGStyler",
	sBlankText : unescape("%uFEFF"),

	$init : function(){
		var htBrowser = jindo.$Agent().navigator();
		
		if(!htBrowser.ie || htBrowser.nativeVersion < 9 || document.documentMode < 9){
			this._addCursorHolder = function(){};
		}
	},
	
	_addCursorHolder : function(oSelection, oSpan){
		var oBody = this.oApp.getWYSIWYGDocument().body,
			oAncestor,
			welSpan = jindo.$Element(oSpan),
			sHtml,
			tmpTextNode;
		
		sHtml = oBody.innerHTML;
		oAncestor = oBody;
		
		if(sHtml === welSpan.outerHTML()){
			tmpTextNode = oSelection._document.createTextNode(unescape("%uFEFF"));
			oAncestor.appendChild(tmpTextNode);
			
			return;
		}
		
		oAncestor = nhn.husky.SE2M_Utils.findAncestorByTagName("P", oSpan);

		if(!oAncestor){
			return;
		}

		sHtml = oAncestor.innerHTML;
		
		if(sHtml.indexOf("&nbsp;") > -1){
			return;
		}

		tmpTextNode = oSelection._document.createTextNode(unescape("%u00A0"));
		oAncestor.appendChild(tmpTextNode);
	},
	
	$PRECONDITION : function(sFullCommand, aArgs){
		return (this.oApp.getEditingMode() == "WYSIWYG");
	},
	$ON_SET_WYSIWYG_STYLE : function(oStyles){
		var oSelection = this.oApp.getSelection();
		var htSelectedTDs = {};
		this.oApp.exec("IS_SELECTED_TD_BLOCK",['bIsSelectedTd',htSelectedTDs]);
		var bSelectedBlock = htSelectedTDs.bIsSelectedTd;
		
		// style cursor or !(selected block) 
		if(oSelection.collapsed && !bSelectedBlock){
			this.oApp.exec("RECORD_UNDO_ACTION", ["FONT STYLE", {bMustBlockElement : true}]);
					
			var oSpan, bNewSpan;
			var elCAC = oSelection.commonAncestorContainer;
			//var elCAC = nhn.CurrentSelection.getCommonAncestorContainer();
			if(elCAC.nodeType == 3){
				elCAC = elCAC.parentNode;
			}
			
			if(elCAC && elCAC.tagName == "SPAN" && (elCAC.innerHTML == "" || elCAC.innerHTML == this.sBlankText || elCAC.innerHTML == "&nbsp;")){
				bNewSpan = false;
				oSpan = elCAC;
			}else{
				bNewSpan = true;
				oSpan = this.oApp.getWYSIWYGDocument().createElement("SPAN");
			}
			oSpan.innerHTML = this.sBlankText;

			var sValue;
			for(var sName in oStyles){
				sValue = oStyles[sName];

				if(typeof sValue != "string"){
					continue;
				}

				oSpan.style[sName] = sValue;
			}

			if(bNewSpan){
				if(oSelection.startContainer.tagName == "BODY" && oSelection.startOffset === 0){
					var oVeryFirstNode = oSelection._getVeryFirstRealChild(this.oApp.getWYSIWYGDocument().body);
				
					var bAppendable = true;
					var elTmp = oVeryFirstNode.cloneNode(false);
					// some browsers may throw an exception for trying to set the innerHTML of BR/IMG tags
					try{
						elTmp.innerHTML = "test";
						
						if(elTmp.innerHTML != "test"){
							bAppendable = false;
						}
					}catch(e){
						bAppendable = false;
					}
					
					if(bAppendable && elTmp.nodeType == 1 && elTmp.tagName == "BR"){// [SMARTEDITORSUS-311] [FF4] Cursor Holder ÀÎ BR ÀÇ ÇÏÀ§³ëµå·Î SPAN À» Ãß°¡ÇÏ¿© ¹ß»ýÇÏ´Â ¹®Á¦
						oSelection.selectNode(oVeryFirstNode);
						oSelection.collapseToStart();
						oSelection.insertNode(oSpan);
					}else if(bAppendable && oVeryFirstNode.tagName != "IFRAME" && oVeryFirstNode.appendChild && typeof oVeryFirstNode.innerHTML == "string"){
						oVeryFirstNode.appendChild(oSpan);
					}else{
						oSelection.selectNode(oVeryFirstNode);
						oSelection.collapseToStart();
						oSelection.insertNode(oSpan);
					}
				}else{
					oSelection.collapseToStart();
					oSelection.insertNode(oSpan);
				}
			}else{
				oSelection = this.oApp.getEmptySelection();
			}

			// [SMARTEDITORSUS-229] »õ·Î »ý¼ºµÇ´Â SPAN ¿¡µµ Ãë¼Ò¼±/¹ØÁÙ Ã³¸® Ãß°¡
			if(!!oStyles.color){
				oSelection._checkTextDecoration(oSpan);
			}
			
			this._addCursorHolder(oSelection, oSpan);	// [SMARTEDITORSUS-178] [IE9] Ä¿¼­°¡ À§·Î ¿Ã¶ó°¡´Â ¹®Á¦
			
			oSelection.selectNodeContents(oSpan);
			oSelection.collapseToEnd();
			oSelection._window.focus();
			oSelection._window.document.body.focus();
			oSelection.select();
			
			// ¿µ¿ªÀ¸·Î ½ºÅ¸ÀÏÀÌ ÀâÇô ÀÖ´Â °æ¿ì(¿¹:ÇöÀç Ä¿¼­°¡ Bºí·° ¾È¿¡ Á¸Àç) ÇØ´ç ¿µ¿ªÀÌ »ç¶óÁ® ¹ö¸®´Â ¿À·ù ¹ß»ýÇØ¼­ Á¦°Å
			// http://bts.nhncorp.com/nhnbts/browse/COM-912
/*
			var oCursorStyle = this.oApp.getCurrentStyle();
			if(oCursorStyle.bold == "@^"){
				this.oApp.delayedExec("EXECCOMMAND", ["bold"], 0);
			}
			if(oCursorStyle.underline == "@^"){
				this.oApp.delayedExec("EXECCOMMAND", ["underline"], 0);
			}
			if(oCursorStyle.italic == "@^"){
				this.oApp.delayedExec("EXECCOMMAND", ["italic"], 0);
			}
			if(oCursorStyle.lineThrough == "@^"){
				this.oApp.delayedExec("EXECCOMMAND", ["strikethrough"], 0);
			}
*/
			// FF3 will actually display %uFEFF when it is followed by a number AND certain font-family is used(like Gulim), so remove the character for FF3
			//if(jindo.$Agent().navigator().firefox && jindo.$Agent().navigator().version == 3){
			// FF4+ may have similar problems, so ignore the version number
			// [SMARTEDITORSUS-416] Ä¿¼­°¡ ¿Ã¶ó°¡Áö ¾Êµµ·Ï BR À» »ì·ÁµÒ
			// if(jindo.$Agent().navigator().firefox){
				// oSpan.innerHTML = "";
			// }
			return;
		}

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["FONT STYLE", {bMustBlockElement:true}]);
		
		if(bSelectedBlock){
			var aNodes;
			
			this.oApp.exec("GET_SELECTED_TD_BLOCK",['aTdCells',htSelectedTDs]);
			aNodes = htSelectedTDs.aTdCells;
			
			for( var j = 0; j < aNodes.length ; j++){
				oSelection.selectNodeContents(aNodes[j]);
				oSelection.styleRange(oStyles);
				oSelection.select();
			}
		} else {
			var bCheckTextDecoration = !!oStyles.color;	// [SMARTEDITORSUS-26] Ãë¼Ò¼±/¹ØÁÙ »ö»ó Àû¿ë Ã³¸®
			var bIncludeLI = oStyles.fontSize || oStyles.fontFamily;
			oSelection.styleRange(oStyles, null, null, bIncludeLI, bCheckTextDecoration);
			
			// http://bts.nhncorp.com/nhnbts/browse/COM-964
			//
			// In FF when,
			// 1) Some text was wrapped with a styling SPAN and a bogus BR is followed
			// 	eg: <span style="XXX">TEST</span><br>
			// 2) And some place outside the span is clicked.
			//
			// The text cursor will be located outside the SPAN like the following,
			// <span style="XXX">TEST</span>[CURSOR]<br>
			//
			// which is not what the user would expect
			// Desired result: <span style="XXX">TEST[CURSOR]</span><br>
			//
			// To make the cursor go inside the styling SPAN, remove the bogus BR when the styling SPAN is created.
			// 	-> Style TEST<br> as <span style="XXX">TEST</span> (remove unnecessary BR)
			// 	-> Cannot monitor clicks/cursor position real-time so make the contents error-proof instead.
			if(jindo.$Agent().navigator().firefox){
				var aStyleParents = oSelection.aStyleParents;
				for(var i=0, nLen=aStyleParents.length; i<nLen; i++){
					var elNode = aStyleParents[i];
					if(elNode.nextSibling && elNode.nextSibling.tagName == "BR" && !elNode.nextSibling.nextSibling){
						elNode.parentNode.removeChild(elNode.nextSibling);
					}
				}
			}
			
			oSelection._window.focus();
			oSelection.select();
		}
		
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["FONT STYLE", {bMustBlockElement:true}]);
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to Find/Replace
 * @name hp_SE2M_FindReplacePlugin.js
 */
nhn.husky.SE2M_FindReplacePlugin = jindo.$Class({
	name : "SE2M_FindReplacePlugin",
	oEditingWindow : null,
	oFindReplace :  null,
	bFindMode : true,
	bLayerShown : false,

	$init : function(){
		this.nDefaultTop = 20;
	},
	
	$ON_MSG_APP_READY : function(){
		// the right document will be available only when the src is completely loaded
		this.oEditingWindow = this.oApp.getWYSIWYGWindow();
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+f", "SHOW_FIND_LAYER", []]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+h", "SHOW_REPLACE_LAYER", []]);
		
		this.oApp.exec("REGISTER_UI_EVENT", ["findAndReplace", "click", "TOGGLE_FIND_REPLACE_LAYER"]);
	},
	
	$ON_SHOW_ACTIVE_LAYER : function(){
		this.oApp.exec("HIDE_DIALOG_LAYER", [this.elDropdownLayer]);
	},
	
	//@lazyload_js TOGGLE_FIND_REPLACE_LAYER,SHOW_FIND_LAYER,SHOW_REPLACE_LAYER,SHOW_FIND_REPLACE_LAYER:N_FindReplace.js[
	_assignHTMLElements : function(){
		var oAppContainer = this.oApp.htOptions.elAppContainer;

		this.oApp.exec("LOAD_HTML", ["find_and_replace"]);
//		this.oEditingWindow = jindo.$$.getSingle("IFRAME", oAppContainer);
		this.elDropdownLayer = jindo.$$.getSingle("DIV.husky_se2m_findAndReplace_layer", oAppContainer);
		this.welDropdownLayer = jindo.$Element(this.elDropdownLayer);
		var oTmp = jindo.$$("LI", this.elDropdownLayer);
		
		this.oFindTab = oTmp[0];
		this.oReplaceTab = oTmp[1];
		
		oTmp = jindo.$$(".container > .bx", this.elDropdownLayer);

		this.oFindInputSet = jindo.$$.getSingle(".husky_se2m_find_ui", this.elDropdownLayer);
		this.oReplaceInputSet = jindo.$$.getSingle(".husky_se2m_replace_ui", this.elDropdownLayer);
		
		this.elTitle = jindo.$$.getSingle("H3", this.elDropdownLayer);

		this.oFindInput_Keyword = jindo.$$.getSingle("INPUT", this.oFindInputSet);

		oTmp = jindo.$$("INPUT", this.oReplaceInputSet);
		this.oReplaceInput_Original = oTmp[0];
		this.oReplaceInput_Replacement = oTmp[1];

		this.oFindNextButton = jindo.$$.getSingle("BUTTON.husky_se2m_find_next", this.elDropdownLayer);

		this.oReplaceFindNextButton = jindo.$$.getSingle("BUTTON.husky_se2m_replace_find_next", this.elDropdownLayer);		

		this.oReplaceButton = jindo.$$.getSingle("BUTTON.husky_se2m_replace", this.elDropdownLayer);
		this.oReplaceAllButton = jindo.$$.getSingle("BUTTON.husky_se2m_replace_all", this.elDropdownLayer);
		
		this.aCloseButtons = jindo.$$("BUTTON.husky_se2m_cancel", this.elDropdownLayer);
	},

	$LOCAL_BEFORE_FIRST : function(sMsg){
		this._assignHTMLElements();

		this.oFindReplace = new nhn.FindReplace(this.oEditingWindow);

		for(var i=0; i<this.aCloseButtons.length; i++){
			// var func = jindo.$Fn(this.oApp.exec, this.oApp).bind("HIDE_DIALOG_LAYER", [this.elDropdownLayer]);
			var func = jindo.$Fn(this.oApp.exec, this.oApp).bind("HIDE_FIND_REPLACE_LAYER", [this.elDropdownLayer]);
			jindo.$Fn(func, this).attach(this.aCloseButtons[i], "click");
		}
		
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("SHOW_FIND", []), this).attach(this.oFindTab, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("SHOW_REPLACE", []), this).attach(this.oReplaceTab, "click");
		
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("FIND", []), this).attach(this.oFindNextButton, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("FIND", []), this).attach(this.oReplaceFindNextButton, "click");
		
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("REPLACE", []), this).attach(this.oReplaceButton, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("REPLACE_ALL", []), this).attach(this.oReplaceAllButton, "click");
		
		this.oFindInput_Keyword.value = "";
		this.oReplaceInput_Original.value = "";
		this.oReplaceInput_Replacement.value = "";

		//·¹ÀÌ¾îÀÇ ÀÌµ¿ ¹üÀ§ ¼³Á¤.
		var elIframe = this.oApp.getWYSIWYGWindow().frameElement;
		this.htOffsetPos = jindo.$Element(elIframe).offset();
		this.nEditorWidth = elIframe.offsetWidth;

		this.elDropdownLayer.style.display = "block";
		this.htInitialPos = this.welDropdownLayer.offset();
		var htScrollXY = this.oApp.oUtils.getScrollXY();
//		this.welDropdownLayer.offset(this.htOffsetPos.top-htScrollXY.y, this.htOffsetPos.left-htScrollXY.x);
		this.welDropdownLayer.offset(this.htOffsetPos.top, this.htOffsetPos.left);
		this.htTopLeftCorner = {x:parseInt(this.elDropdownLayer.style.left, 10), y:parseInt(this.elDropdownLayer.style.top, 10)};
		
		// offset width°¡ IE¿¡¼­ css lazy loading ¶§¹®¿¡ Á¦´ë·Î ÀâÈ÷Áö ¾Ê¾Æ »ó¼ö·Î ¼³Á¤
		//this.nLayerWidth = this.elDropdownLayer.offsetWidth;
		this.nLayerWidth = 258;
		this.nLayerHeight = 160;
		
		//this.nLayerWidth = Math.abs(parseInt(this.elDropdownLayer.style.marginLeft))+20;
		this.elDropdownLayer.style.display = "none";
	},
	
	// [SMARTEDITORSUS-728] Ã£±â/¹Ù²Ù±â ·¹ÀÌ¾î ¿ÀÇÂ Åø¹Ù ¹öÆ° active/inactive Ã³¸® Ãß°¡
	$ON_TOGGLE_FIND_REPLACE_LAYER : function(){
		if(!this.bLayerShown) {
			this.oApp.exec("SHOW_FIND_REPLACE_LAYER");
		} else {
			this.oApp.exec("HIDE_FIND_REPLACE_LAYER");
		}
	},
	
	$ON_SHOW_FIND_REPLACE_LAYER : function(){
		this.bLayerShown = true;
		this.oApp.exec("DISABLE_ALL_UI", [{aExceptions: ["findAndReplace"]}]);
		this.oApp.exec("SELECT_UI", ["findAndReplace"]);
		
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER", []);
		this.elDropdownLayer.style.top = this.nDefaultTop+"px";
		
		this.oApp.exec("SHOW_DIALOG_LAYER", [this.elDropdownLayer, {
			elHandle: this.elTitle,
			fnOnDragStart : jindo.$Fn(this.oApp.exec, this.oApp).bind("SHOW_EDITING_AREA_COVER"),
			fnOnDragEnd : jindo.$Fn(this.oApp.exec, this.oApp).bind("HIDE_EDITING_AREA_COVER"),
			nMinX : this.htTopLeftCorner.x,
			nMinY : this.nDefaultTop,
			nMaxX : this.htTopLeftCorner.x + this.oApp.getEditingAreaWidth() - this.nLayerWidth,
			nMaxY : this.htTopLeftCorner.y + this.oApp.getEditingAreaHeight() - this.nLayerHeight,
			sOnShowMsg : "FIND_REPLACE_LAYER_SHOWN"
		}]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['findreplace']);
	},
	
	$ON_HIDE_FIND_REPLACE_LAYER : function() {
		this.oApp.exec("ENABLE_ALL_UI");
		this.oApp.exec("DESELECT_UI", ["findAndReplace"]);
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER", []);
		this.bLayerShown = false;
	},
	
	$ON_FIND_REPLACE_LAYER_SHOWN : function(){
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [this.elDropdownLayer]);
		if(this.bFindMode){
			this.oFindInput_Keyword.value = "_clear_";
			this.oFindInput_Keyword.value = "";
			this.oFindInput_Keyword.focus();
		}else{
			this.oReplaceInput_Original.value = "_clear_";
			this.oReplaceInput_Original.value = "";
			this.oReplaceInput_Replacement.value = "";
			this.oReplaceInput_Original.focus();
		}

		this.oApp.exec("HIDE_CURRENT_ACTIVE_LAYER", []);
	},
	
	$ON_SHOW_FIND_LAYER : function(){
		this.oApp.exec("SHOW_FIND");
		this.oApp.exec("SHOW_FIND_REPLACE_LAYER");
	},
	
	$ON_SHOW_REPLACE_LAYER : function(){
		this.oApp.exec("SHOW_REPLACE");
		this.oApp.exec("SHOW_FIND_REPLACE_LAYER");
	},
	
	$ON_SHOW_FIND : function(){
		this.bFindMode = true;
		this.oFindInput_Keyword.value = this.oReplaceInput_Original.value;
		
		jindo.$Element(this.oFindTab).addClass("active");
		jindo.$Element(this.oReplaceTab).removeClass("active");
		
		jindo.$Element(this.oFindNextButton).removeClass("normal");
		jindo.$Element(this.oFindNextButton).addClass("strong");

		this.oFindInputSet.style.display = "block";
		this.oReplaceInputSet.style.display = "none";
		
		this.oReplaceButton.style.display = "none";
		this.oReplaceAllButton.style.display = "none";
		
		jindo.$Element(this.elDropdownLayer).removeClass("replace");
		jindo.$Element(this.elDropdownLayer).addClass("find");
	},
	
	$ON_SHOW_REPLACE : function(){
		this.bFindMode = false;
		this.oReplaceInput_Original.value = this.oFindInput_Keyword.value;
		
		jindo.$Element(this.oFindTab).removeClass("active");
		jindo.$Element(this.oReplaceTab).addClass("active");
		
		jindo.$Element(this.oFindNextButton).removeClass("strong");
		jindo.$Element(this.oFindNextButton).addClass("normal");
		
		this.oFindInputSet.style.display = "none";
		this.oReplaceInputSet.style.display = "block";
		
		this.oReplaceButton.style.display = "inline";
		this.oReplaceAllButton.style.display = "inline";
		
		jindo.$Element(this.elDropdownLayer).removeClass("find");
		jindo.$Element(this.elDropdownLayer).addClass("replace");
	},

	$ON_FIND : function(){
		var sKeyword;
		if(this.bFindMode){
			sKeyword = this.oFindInput_Keyword.value;
		}else{
			sKeyword = this.oReplaceInput_Original.value;
		}
		
		var oSelection = this.oApp.getSelection();
		oSelection.select();
		
		switch(this.oFindReplace.find(sKeyword, false)){
			case 1:
				alert(this.oApp.$MSG("SE_FindReplace.keywordNotFound"));
				oSelection.select();
				break;
			case 2:
				alert(this.oApp.$MSG("SE_FindReplace.keywordMissing"));
				break;
		}
	},
	
	$ON_REPLACE : function(){
		var sOriginal = this.oReplaceInput_Original.value;
		var sReplacement = this.oReplaceInput_Replacement.value;

		var oSelection = this.oApp.getSelection();

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["REPLACE"]);
		var iReplaceResult = this.oFindReplace.replace(sOriginal, sReplacement, false);
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["REPLACE"]);
		
		switch(iReplaceResult){
			case 1:
			case 3:
				alert(this.oApp.$MSG("SE_FindReplace.keywordNotFound"));
				oSelection.select();
				break;
			case 4:
				alert(this.oApp.$MSG("SE_FindReplace.keywordMissing"));
				break;
		}
	},
	
	$ON_REPLACE_ALL : function(){
		var sOriginal = this.oReplaceInput_Original.value;
		var sReplacement = this.oReplaceInput_Replacement.value;

		var oSelection = this.oApp.getSelection();
		
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["REPLACE ALL", {sSaveTarget:"BODY"}]);
		var iReplaceAllResult = this.oFindReplace.replaceAll(sOriginal, sReplacement, false);
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["REPLACE ALL", {sSaveTarget:"BODY"}]);

		if(iReplaceAllResult === 0){
			alert(this.oApp.$MSG("SE_FindReplace.replaceKeywordNotFound"));
			oSelection.select();
			this.oApp.exec("FOCUS");
		}else{
			if(iReplaceAllResult<0){
				alert(this.oApp.$MSG("SE_FindReplace.keywordMissing"));
				oSelection.select();
			}else{
				alert(this.oApp.$MSG("SE_FindReplace.replaceAllResultP1")+iReplaceAllResult+this.oApp.$MSG("SE_FindReplace.replaceAllResultP2"));
				oSelection = this.oApp.getEmptySelection();
				oSelection.select();
				this.oApp.exec("FOCUS");
			}
		}
	}
	//@lazyload_js]
});
//}
 /**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to quote
 * @name hp_SE_Quote.js
 * @required SE_EditingArea_WYSIWYG
 */
nhn.husky.SE2M_Quote = jindo.$Class({
	name : "SE2M_Quote",
	
	htQuoteStyles_view : null,

	$init : function(){
		var htConfig = nhn.husky.SE2M_Configuration.Quote || {};
		var sImageBaseURL = htConfig.sImageBaseURL;
		
		this.nMaxLevel = htConfig.nMaxLevel || 14;
		
		this.htQuoteStyles_view = {};
		this.htQuoteStyles_view["se2_quote1"] = "_zoom:1;padding:0 8px; margin:0 0 30px 20px; margin-right:15px; border-left:2px solid #cccccc;color:#888888;";
		this.htQuoteStyles_view["se2_quote2"] = "_zoom:1;margin:0 0 30px 13px;padding:0 8px 0 16px;background:url("+sImageBaseURL+"/bg_quote2.gif) 0 3px no-repeat;color:#888888;";
		this.htQuoteStyles_view["se2_quote3"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px dashed #cccccc;color:#888888;";
		this.htQuoteStyles_view["se2_quote4"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px dashed #66b246;color:#888888;";
		this.htQuoteStyles_view["se2_quote5"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px dashed #cccccc;background:url("+sImageBaseURL+"/bg_b1.png) repeat;_background:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+sImageBaseURL+"/bg_b1.png',sizingMethod='scale');color:#888888;";
		this.htQuoteStyles_view["se2_quote6"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px solid #e5e5e5;color:#888888;";
		this.htQuoteStyles_view["se2_quote7"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px solid #66b246;color:#888888;";
		this.htQuoteStyles_view["se2_quote8"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px solid #e5e5e5;background:url("+sImageBaseURL+"/bg_b1.png) repeat;_background:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+sImageBaseURL+"/bg_b1.png',sizingMethod='scale');color:#888888;";
		this.htQuoteStyles_view["se2_quote9"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:2px solid #e5e5e5;color:#888888;";
		this.htQuoteStyles_view["se2_quote10"] = "_zoom:1;margin:0 0 30px 0;padding:10px;border:2px solid #e5e5e5;background:url("+sImageBaseURL+"/bg_b1.png) repeat;_background:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+sImageBaseURL+"/bg_b1.png',sizingMethod='scale');color:#888888;";
	},

	_assignHTMLElements : function(){
		//@ec
		this.elDropdownLayer = jindo.$$.getSingle("DIV.husky_seditor_blockquote_layer", this.oApp.htOptions.elAppContainer);
		this.aLI = jindo.$$("LI", this.elDropdownLayer);
	},
	
	$ON_REGISTER_CONVERTERS : function(){
		this.oApp.exec("ADD_CONVERTER", ["DB_TO_IR", jindo.$Fn(function(sContents){
			sContents = sContents.replace(/<(blockquote)[^>]*class=['"]?(se2_quote[0-9]+)['"]?[^>]*>/gi, "<$1 class=$2>");
			return sContents;
		}, this).bind()]);
		
		this.oApp.exec("ADD_CONVERTER", ["IR_TO_DB", jindo.$Fn(function(sContents){
			var htQuoteStyles_view = this.htQuoteStyles_view;
			sContents = sContents.replace(/<(blockquote)[^>]*class=['"]?(se2_quote[0-9]+)['"]?[^>]*>/gi, function(sAll, sTag, sClassName){
				return '<'+sTag+' class='+sClassName+' style="'+htQuoteStyles_view[sClassName]+'">';
			});
			return sContents;
		}, this).bind()]);

		this.htSE1toSE2Map = {
			"01" : "1",
			"02" : "2",
			"03" : "6",
			"04" : "8",
			"05" : "9",
			"07" : "3",
			"08" : "5"
		};
		// convert SE1's quotes to SE2's
		// -> ºí·Î±× °³¹ß ÂÊ¿¡¼­ Ã³¸® ÇÏ±â·Î ÇÔ.
		/*
		this.oApp.exec("ADD_CONVERTER", ["DB_TO_IR", jindo.$Fn(function(sContents){
			return sContents.replace(/<blockquote[^>]* class="?vview_quote([0-9]+)"?[^>]*>((?:\s|.)*?)<\/blockquote>/ig, jindo.$Fn(function(m0,sQuoteType,sQuoteContents){
				if (/<!--quote_txt-->((?:\s|.)*?)<!--\/quote_txt-->/ig.test(sQuoteContents)){
					if(!this.htSE1toSE2Map[sQuoteType]){
						return m0;
					}
					
					return '<blockquote class="se2_quote'+this.htSE1toSE2Map[sQuoteType]+'">'+RegExp.$1+'</blockquote>';
				}else{
					return '';
				}
			}, this).bind());
		}, this).bind()]);
		*/
	},

	$LOCAL_BEFORE_FIRST : function(){
		this._assignHTMLElements();

		this.oApp.registerBrowserEvent(this.elDropdownLayer, "click", "EVENT_SE2_BLOCKQUOTE_LAYER_CLICK", []);
		this.oApp.delayedExec("SE2_ATTACH_HOVER_EVENTS", [this.aLI], 0);
	},
	
	$ON_MSG_APP_READY: function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["quote", "click", "TOGGLE_BLOCKQUOTE_LAYER"]);		
	},
	
	//@lazyload_js TOGGLE_BLOCKQUOTE_LAYER[
	$ON_TOGGLE_BLOCKQUOTE_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "SELECT_UI", ["quote"], "DESELECT_UI", ["quote"]]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['quote']);
	},

	$ON_EVENT_SE2_BLOCKQUOTE_LAYER_CLICK : function(weEvent){
		var elButton = nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON", weEvent.element);

		if(!elButton || elButton.tagName != "BUTTON"){return;}
		
		var sClass = elButton.className;
		this.oApp.exec("APPLY_BLOCKQUOTE", [sClass]);
	},
	
	$ON_APPLY_BLOCKQUOTE : function(sClass){
		if(sClass.match(/(se2_quote[0-9]+)/)){
			this._wrapBlock("BLOCKQUOTE", RegExp.$1);
		}else{
			this._unwrapBlock("BLOCKQUOTE");
		}
		
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	/**
	 * ÀÎ¿ë±¸ÀÇ ÁßÃ¸ °¡´ÉÇÑ ÃÖ´ë °³¼ö¸¦ ³Ñ¾ú´ÂÁö È®ÀÎÇÔ
	 * ÀÎ¿ë±¸ ³»ºÎ¿¡¼­ ÀÎ¿ë±¸¸¦ Àû¿ëÇÏ¸é ÁßÃ¸µÇÁö ¾ÊÀ¸¹Ç·Î ÀÚ½Ä³ëµå¿¡ ´ëÇØ¼­¸¸ È®ÀÎÇÔ
	 */
	_isExceedMaxDepth : function(elNode){
		var countChildQuote = function(elNode){
			var elChild = elNode.firstChild;
			var nCount = 0;
			var nMaxCount = 0;
			
			if(!elChild){
				if(elNode.tagName && elNode.tagName === "BLOCKQUOTE"){
					return 1;
				}else{
					return 0;
				}
			}
			
			while(elChild){
				if(elChild.nodeType === 1){
					nCount = countChildQuote(elChild);
					
					if(elChild.tagName === "BLOCKQUOTE"){
						nCount += 1;
					}
				
					if(nMaxCount < nCount){
						nMaxCount = nCount;
					}
					
					if(nMaxCount >= this.nMaxLevel){
						return nMaxCount;
					}
				}
				
				elChild = elChild.nextSibling;
			}
			
			return nMaxCount;
		};
		
		return (countChildQuote(elNode) >= this.nMaxLevel);
	},
	
	_unwrapBlock : function(tag){
		var oSelection = this.oApp.getSelection();
		var elCommonAncestor = oSelection.commonAncestorContainer;

		while(elCommonAncestor && elCommonAncestor.tagName != tag){elCommonAncestor = elCommonAncestor.parentNode;}
		if(!elCommonAncestor){return;}

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["CANCEL BLOCK QUOTE", {sSaveTarget:"BODY"}]);
		
		while(elCommonAncestor.firstChild){elCommonAncestor.parentNode.insertBefore(elCommonAncestor.firstChild, elCommonAncestor);}
		elCommonAncestor.parentNode.removeChild(elCommonAncestor);
		
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["CANCEL BLOCK QUOTE", {sSaveTarget:"BODY"}]);
	},
	
	_wrapBlock : function(tag, className){
		var oSelection,
			oLineInfo,
			oStart, oEnd,
			rxDontUseAsWhole = /BODY|TD|LI/i,
			oStartNode, oEndNode, oNode,
			elCommonAncestor,
			elCommonNode,
			elParentQuote,
			elInsertBefore,
			oFormattingNode,
			elNextNode,
			elParentNode,
			aQuoteChild,
			aQuoteCloneChild,
			i, nLen, oP,
			sBookmarkID;
	
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["BLOCK QUOTE", {sSaveTarget:"BODY"}]);
		oSelection = this.oApp.getSelection();
//		var sBookmarkID = oSelection.placeStringBookmark();

		// [SMARTEDITORSUS-430] ¹®ÀÚ¸¦ ÀÔ·ÂÇÏ°í Enter ÈÄ ÀÎ¿ë±¸¸¦ Àû¿ëÇÒ ¶§ À§ÀÇ ¹®ÀÚµéÀÌ ÀÎ¿ë±¸ ¾È¿¡ µé¾î°¡´Â ¹®Á¦
		// [SMARTEDITORSUS-1323] »çÁø Ã·ºÎ ÈÄ ÀÎ¿ë±¸ Àû¿ë ½Ã Ã·ºÎÇÑ »çÁøÀÌ »èÁ¦µÇ´Â Çö»ó
		// [SMARTEDITORSUS-1567] ¿£ÅÍÅ°¸¦ ÇÑ ¹øµµ ´©¸£Áö ¾Ê°í ÀÎ¿ë±¸¸¦ »ðÀÔÇÏ´Â °æ¿ì¿¡ ´ëÀÀ
		/*if(oSelection.startContainer === oSelection.endContainer && 
			oSelection.startContainer.nodeType === 1 &&
			oSelection.startContainer.tagName === "P"){
				if(nhn.husky.SE2M_Utils.isBlankNode(oSelection.startContainer) ||
					nhn.husky.SE2M_Utils.isFirstChildOfNode("IMG", oSelection.startContainer.tagName, oSelection.startContainer) ||
					nhn.husky.SE2M_Utils.isFirstChildOfNode("IFRAME", oSelection.startContainer.tagName, oSelection.startContainer)){
						oLineInfo = oSelection.getLineInfo(true);
				}else{
						oLineInfo = oSelection.getLineInfo(false);
				}
		}else{
			oLineInfo = oSelection.getLineInfo(false);
		}*/
		if(oSelection.startContainer === oSelection.endContainer){
			if(oSelection.startContainer.nodeType === 1 &&
					oSelection.startContainer.tagName === "P"){
				if(nhn.husky.SE2M_Utils.isBlankNode(oSelection.startContainer) ||
						nhn.husky.SE2M_Utils.isFirstChildOfNode("IMG", oSelection.startContainer.tagName, oSelection.startContainer) ||
						nhn.husky.SE2M_Utils.isFirstChildOfNode("IFRAME", oSelection.startContainer.tagName, oSelection.startContainer)){
					oLineInfo = oSelection.getLineInfo(true);
				}else{
					oLineInfo = oSelection.getLineInfo(false);
				}
			}else{
				// ½ÃÀÛ ÄÁÅ×ÀÌ³Ê¿Í ³¡ ÄÁÅ×ÀÌ³Ê´Â °°µÇ P ÅÂ±×°¡ ¾Æ´Ñ °æ¿ì·Î,
				// ¿£ÅÍ¸¦ ÇÑ ¹øµµ ÀÔ·ÂÇÏÁö ¾ÊÀº »óÈ²ÀÌ´Ù.
				// TD ÅÂ±×³ª BODY ÅÂ±× ³»ºÎ¿¡ ¼ÓÇØ ÀÖÀ» °ÍÀÌ¶ó°í °¡Á¤ÇÏ°í ÁøÇàÇÏ´Âµ¥,
				// ¿Ã¹Ù¸¥ Á¤·Ä Àû¿ëÀ» À§ÇØ ÇöÀç À§Ä¡¿¡ ¼ÓÇÑ ÄÁÅÙÃ÷¸¦ P ÅÂ±×·Î °¨½Î ÁÖ°Ô µÈ´Ù.
				var _startContainer = oSelection.startContainer;
				var _startOffset = oSelection.startOffset;
				var _endContainer = oSelection.endContainer;
				var _endOffset = oSelection.endOffset;
				
				var _sBM = oSelection.placeStringBookmark();
				var _elBookmark = oSelection.getStringBookmark(_sBM);
				var _elParent = _elBookmark.parentNode;
				var _elAncestor = nhn.husky.SE2M_Utils.findAncestorByTagName("P", _elParent); // ¿ø·¡ P ÅÂ±×¸¦ Æ÷ÇÔÇÒ ¼ö ÀÖ´Â ºÎ¸ð ¸ñ·Ï
				var _aParagraphContainer = ["TD", "BODY"]; // Å½»ö ¼ø¼­´Â TD, BODY ¼ø
				
				if(!_elAncestor){
					for(var i = 0, len = _aParagraphContainer.length; i < len; i++){
						_elAncestor = nhn.husky.SE2M_Utils.findAncestorByTagName(_aParagraphContainer[i], _elParent);

						if(_elAncestor){
							break;
						}
					}

					var _elParagraph = document.createElement("P");
					var _aAncestorChildren = _elAncestor.childNodes;
					for(var i = 0, len = _aAncestorChildren.length; i < len; i++){
						_elParagraph.appendChild(_aAncestorChildren[0]);
					}
					_elAncestor.appendChild(_elParagraph);
				}
				oSelection.removeStringBookmark(_sBM);
				oSelection = this.oApp.getSelection();
				oSelection.setStart(_startContainer, _startOffset);
				oSelection.setEnd(_endContainer, _endOffset);
				
				oLineInfo = oSelection.getLineInfo(true);
			}
		}else{
			oLineInfo = oSelection.getLineInfo(false);
		}
		// --[SMARTEDITORSUS-1567]
		
		oStart = oLineInfo.oStart;
		oEnd = oLineInfo.oEnd;
		
		if(oStart.bParentBreak && !rxDontUseAsWhole.test(oStart.oLineBreaker.tagName)){
			oStartNode = oStart.oNode.parentNode;
		}else{
			oStartNode = oStart.oNode;
		}

		if(oEnd.bParentBreak && !rxDontUseAsWhole.test(oEnd.oLineBreaker.tagName)){
			oEndNode = oEnd.oNode.parentNode;
		}else{
			oEndNode = oEnd.oNode;
		}

		oSelection.setStartBefore(oStartNode);
		oSelection.setEndAfter(oEndNode);

		oNode = this._expandToTableStart(oSelection, oEndNode);
		if(oNode){
			oEndNode = oNode;
			oSelection.setEndAfter(oNode);
		}

		oNode = this._expandToTableStart(oSelection, oStartNode);
		if(oNode){
			oStartNode = oNode;
			oSelection.setStartBefore(oNode);
		}

		oNode = oStartNode;
		// IE¿¡¼­´Â commonAncestorContainer ÀÚÃ¼´Â select °¡´ÉÇÏÁö ¾Ê°í, ÇÏÀ§¿¡ commonAncestorContainer¸¦ ´ëÃ¼ ÇÏ´õ¶óµµ ¶È°°Àº ¿µ¿ªÀÌ ¼¿·ºÆ® µÇ¾î º¸ÀÌ´Â 
		// ³ëµå°¡ ÀÖÀ» °æ¿ì ÇÏÀ§ ³ëµå°¡ commonAncestorContainer·Î ¹ÝÈ¯µÊ.
		// ±×·¡¼­, ½ºÅ©¸³Æ®·Î commonAncestorContainer °è»ê ÇÏµµ·Ï ÇÔ.
		// ¿¹)
		// <P><SPAN>TEST</SPAN></p>¸¦ ¼±ÅÃ ÇÒ °æ¿ì, <SPAN>TEST</SPAN>°¡ commonAncestorContainer·Î ÀâÈû
		oSelection.fixCommonAncestorContainer();
		elCommonAncestor = oSelection.commonAncestorContainer;

		if(oSelection.startContainer == oSelection.endContainer && oSelection.endOffset-oSelection.startOffset == 1){
			elCommonNode = oSelection.startContainer.childNodes[oSelection.startOffset];
		}else{
			elCommonNode = oSelection.commonAncestorContainer;
		}
		
		elParentQuote = this._findParentQuote(elCommonNode);

		if(elParentQuote){
			elParentQuote.className = className;
			return;
		}

		while(!elCommonAncestor.tagName || (elCommonAncestor.tagName && elCommonAncestor.tagName.match(/UL|OL|LI|IMG|IFRAME/))){
			elCommonAncestor = elCommonAncestor.parentNode;
		}

		// find the insertion position for the formatting tag right beneath the common ancestor container
		while(oNode && oNode != elCommonAncestor && oNode.parentNode != elCommonAncestor){oNode = oNode.parentNode;}

		if(oNode == elCommonAncestor){
			elInsertBefore = elCommonAncestor.firstChild;
		}else{
			elInsertBefore = oNode;
		}
		
		oFormattingNode = oSelection._document.createElement(tag);
		if(className){
			oFormattingNode.className = className;
			// SMARTEDITORSUS-1239 blockquate style Àû¿ë
			this._setStyle(oFormattingNode, this.htQuoteStyles_view[className]);
		}

		elCommonAncestor.insertBefore(oFormattingNode, elInsertBefore);

		oSelection.setStartAfter(oFormattingNode);

		oSelection.setEndAfter(oEndNode);
		oSelection.surroundContents(oFormattingNode);
				
		if(this._isExceedMaxDepth(oFormattingNode)){
			alert(this.oApp.$MSG("SE2M_Quote.exceedMaxCount").replace("#MaxCount#", (this.nMaxLevel + 1)));
			
			this.oApp.exec("HIDE_ACTIVE_LAYER", []);
			
			elNextNode = oFormattingNode.nextSibling;
			elParentNode = oFormattingNode.parentNode;
			aQuoteChild = oFormattingNode.childNodes;
			aQuoteCloneChild = [];
			
			jindo.$Element(oFormattingNode).leave();
			for(i = 0, nLen = aQuoteChild.length; i < nLen; i++){
				aQuoteCloneChild[i] = aQuoteChild[i];
			}
			for(i = 0, nLen = aQuoteCloneChild.length; i < nLen; i++){
				if(!!elNextNode){
					jindo.$Element(elNextNode).before(aQuoteCloneChild[i]);
				}else{
					jindo.$Element(elParentNode).append(aQuoteCloneChild[i]);
				}
			}
			
			return;
		}

		oSelection.selectNodeContents(oFormattingNode);

		// insert an empty line below, so the text cursor can move there
		if(oFormattingNode && oFormattingNode.parentNode && oFormattingNode.parentNode.tagName == "BODY" && !oFormattingNode.nextSibling){
			oP = oSelection._document.createElement("P");
			//oP.innerHTML = unescape("<br/>");
			oP.innerHTML = "&nbsp;";
			oFormattingNode.parentNode.insertBefore(oP, oFormattingNode.nextSibling);
		}

		//		oSelection.removeStringBookmark(sBookmarkID);
		// Insert an empty line inside the blockquote if it's empty.
		// This is done to position the cursor correctly when the contents of the blockquote is empty in Chrome.
		if(nhn.husky.SE2M_Utils.isBlankNode(oFormattingNode)){
			// oFormattingNode.innerHTML = "";
			// oP = oSelection._document.createElement("P");
			// oP.innerHTML = "&nbsp;";
			// oFormattingNode.insertBefore(oP, null);
			// oSelection = this.oApp.getEmptySelection();
			// oSelection.selectNode(oP);
			// [SMARTEDITORSUS-645] ÆíÁý¿µ¿ª Æ÷Ä¿½º ¾øÀÌ ÀÎ¿ë±¸ Ãß°¡ÇßÀ» ¶§ IE7¿¡¼­ ¹Ú½º°¡ ´Ã¾î³ª´Â ¹®Á¦
			
			// [SMARTEDITORSUS-1567] [Chrome] ÀÎ¿ë±¸ »ðÀÔ Á÷Àü ³»¿ëÀÌ ¾Æ¹«°Íµµ ¾ø´Â °æ¿ì¿¡ ´ëÀÀ
			//oFormattingNode.innerHTML = "&nbsp;";
			var htBrowser = jindo.$Agent().navigator();
			if(htBrowser.chrome){ // P ÅÂ±×·Î °¨½ÎÁÖÁö ¾ÊÀ¸¸é blockquote ÅÂ±×¿¡ Á¤·ÄÀÌ Àû¿ëµÇ´Âµ¥, DB·Î ³Ñ¾î°¥ ¶§ ½ºÅ¸ÀÏÀÌ Àû¿ëµÇÁö ¾Ê´Â ¹®Á¦ ¹ß°ß
				oFormattingNode.innerHTML = "<p>&nbsp;</p>";
			}else{
				oFormattingNode.innerHTML = "&nbsp;";
			}
			// --[SMARTEDITORSUS-1567]
			
			
			oSelection.selectNodeContents(oFormattingNode);
			oSelection.collapseToStart();
			oSelection.select();
		}

		//oSelection.select();
		this.oApp.exec("REFRESH_WYSIWYG");
		setTimeout(jindo.$Fn(function(oSelection){
			sBookmarkID = oSelection.placeStringBookmark();
			
			oSelection.select();
			oSelection.removeStringBookmark(sBookmarkID);
			
			this.oApp.exec("FOCUS");	// [SMARTEDITORSUS-469] [SMARTEDITORSUS-434] ¿¡µðÅÍ ·Îµå ÈÄ ÃÖÃÊ »ðÀÔÇÑ ÀÎ¿ë±¸ ¾È¿¡ Æ÷Ä¿½º°¡ °¡Áö ¾Ê´Â ¹®Á¦
		},this).bind(oSelection), 0);

		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["BLOCK QUOTE", {sSaveTarget:"BODY"}]);
		
		return oFormattingNode;
	},

	_expandToTableStart : function(oSelection, oNode){
		var elCommonAncestor = oSelection.commonAncestorContainer;
		var oResultNode = null;

		var bLastIteration = false;
		while(oNode && !bLastIteration){
			if(oNode == elCommonAncestor){bLastIteration = true;}

			if(/TBODY|TFOOT|THEAD|TR/i.test(oNode.tagName)){
				oResultNode = this._getTableRoot(oNode);
				break;
			}
			oNode = oNode.parentNode;
		}
		
		return oResultNode;
	},
	
	_getTableRoot : function(oNode){
		while(oNode && oNode.tagName != "TABLE"){oNode = oNode.parentNode;}
		
		return oNode;
	},
	
	_setStyle : function(el, sStyle) {
		el.setAttribute("style", sStyle);
		el.style.cssText = sStyle;
	},
	//@lazyload_js]

	// [SMARTEDITORSUS-209] ÀÎ¿ë±¸ ³»¿¡ ³»¿ëÀÌ ¾øÀ» ¶§ Backspace ·Î ÀÎ¿ë±¸°¡ »èÁ¦µÇµµ·Ï Ã³¸®
	$ON_EVENT_EDITING_AREA_KEYDOWN : function(weEvent) {
		var oSelection,
			elParentQuote;
		
		if ('WYSIWYG' !== this.oApp.getEditingMode()){
			return;
		}
		
		if(8 !== weEvent.key().keyCode){
			return;
		}
				
		oSelection = this.oApp.getSelection();
		oSelection.fixCommonAncestorContainer();
		elParentQuote = this._findParentQuote(oSelection.commonAncestorContainer);

		if(!elParentQuote){
			return;
		}
		
		if(this._isBlankQuote(elParentQuote)){
			weEvent.stop(jindo.$Event.CANCEL_DEFAULT);
		
			oSelection.selectNode(elParentQuote);
			oSelection.collapseToStart();
		
			jindo.$Element(elParentQuote).leave();
			
			oSelection.select();
		}
	},
	
	// [SMARTEDITORSUS-215] Delete ·Î ÀÎ¿ë±¸ µÚÀÇ P °¡ Á¦°ÅµÇÁö ¾Êµµ·Ï Ã³¸®
	$ON_EVENT_EDITING_AREA_KEYUP : function(weEvent) {
		var oSelection,
			elParentQuote,
			oP;
		
		if ('WYSIWYG' !== this.oApp.getEditingMode()){
			return;
		}
		
		if(46 !== weEvent.key().keyCode){
			return;
		}
		
		oSelection = this.oApp.getSelection();
		oSelection.fixCommonAncestorContainer();
		elParentQuote = this._findParentQuote(oSelection.commonAncestorContainer);
		
		if(!elParentQuote){
			return false;
		}
		
		if(!elParentQuote.nextSibling){
			weEvent.stop(jindo.$Event.CANCEL_DEFAULT);
			
			oP = oSelection._document.createElement("P");
			oP.innerHTML = "&nbsp;";
			
			jindo.$Element(elParentQuote).after(oP);
						
			setTimeout(jindo.$Fn(function(oSelection){
				var sBookmarkID = oSelection.placeStringBookmark();
				
				oSelection.select();
				oSelection.removeStringBookmark(sBookmarkID);
			},this).bind(oSelection), 0);
		}
	},
	
	_isBlankQuote : function(elParentQuote){
		var	elChild,
			aChildNodes,
			i, nLen, 
			bChrome = this.oApp.oNavigator.chrome,
			bSafari = this.oApp.oNavigator.safari,
			isBlankText = function(sText){
				sText = sText.replace(/[\r\n]/ig, '').replace(unescape("%uFEFF"), '');

				if(sText === ""){
					return true;
				}
				
				if(sText === "&nbsp;" || sText === " "){ // [SMARTEDITORSUS-479]
					return true;
				}
				
				return false;
			},
			isBlank = function(oNode){
				if(oNode.nodeType === 3 && isBlankText(oNode.nodeValue)){
					return true;
				}
				
				if((oNode.tagName === "P" || oNode.tagName === "SPAN") && 
					(isBlankText(oNode.innerHTML) || oNode.innerHTML === "<br>")){					
					return true;
				}

				return false;
			},
			isBlankTable = function(oNode){
				if((jindo.$$("tr", oNode)).length === 0){
					return true;
				}
				
				return false;
			};

		if(isBlankText(elParentQuote.innerHTML) || elParentQuote.innerHTML === "<br>"){
			return true;
		}
		
		if(bChrome || bSafari){	// [SMARTEDITORSUS-352], [SMARTEDITORSUS-502]
			var aTable = jindo.$$("TABLE", elParentQuote),
				nTable = aTable.length,
				elTable;
			
			for(i=0; i<nTable; i++){
				elTable = aTable[i];

				if(isBlankTable(elTable)){
					jindo.$Element(elTable).leave();
				}
			}
		}
		
		aChildNodes = elParentQuote.childNodes;

		for(i=0, nLen=aChildNodes.length; i<nLen; i++){
			elChild = aChildNodes[i];

			if(!isBlank(elChild)){
				return false;
			}
		}
		
		return true;
	},
		
	_findParentQuote : function(el){
		return this._findAncestor(jindo.$Fn(function(elNode){
			if(!elNode){return false;}
			if(elNode.tagName !== "BLOCKQUOTE"){return false;}
			if(!elNode.className){return false;}
			
			var sClassName = elNode.className;
			if(!this.htQuoteStyles_view[sClassName]){return false;}
			
			return true;
		}, this).bind(), el);
	},
	
	_findAncestor : function(fnCondition, elNode){
		while(elNode && !fnCondition(elNode)){elNode = elNode.parentNode;}
		
		return elNode;
	}
});
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to inserting special characters
 * @name hp_SE2M_SCharacter.js
 * @required HuskyRangeManager
 */
nhn.husky.SE2M_SCharacter = jindo.$Class({
	name : "SE2M_SCharacter",

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["sCharacter", "click", "TOGGLE_SCHARACTER_LAYER"]);
	},
	//@lazyload_js TOGGLE_SCHARACTER_LAYER[
	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = jindo.$(oAppContainer) || document;

		this.elDropdownLayer = jindo.$$.getSingle("DIV.husky_seditor_sCharacter_layer", oAppContainer);

		this.oTextField = jindo.$$.getSingle("INPUT", this.elDropdownLayer);
		this.oInsertButton =  jindo.$$.getSingle("BUTTON.se2_confirm", this.elDropdownLayer);
		this.aCloseButton = jindo.$$("BUTTON.husky_se2m_sCharacter_close", this.elDropdownLayer);
		this.aSCharList = jindo.$$("UL.husky_se2m_sCharacter_list", this.elDropdownLayer);
		var oLabelUL = jindo.$$.getSingle("UL.se2_char_tab", this.elDropdownLayer);
		this.aLabel = jindo.$$(">LI", oLabelUL);
	},
	
	$LOCAL_BEFORE_FIRST : function(sFullMsg){
		this.bIE = jindo.$Agent().navigator().ie;

		this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);

		this.charSet = [];
		this.charSet[0] = unescape('FF5B FF5D 3014 3015 3008 3009 300A 300B 300C 300D 300E 300F 3010 3011 2018 2019 201C 201D 3001 3002 %B7 2025 2026 %A7 203B 2606 2605 25CB 25CF 25CE 25C7 25C6 25A1 25A0 25B3 25B2 25BD 25BC 25C1 25C0 25B7 25B6 2664 2660 2661 2665 2667 2663 2299 25C8 25A3 25D0 25D1 2592 25A4 25A5 25A8 25A7 25A6 25A9 %B1 %D7 %F7 2260 2264 2265 221E 2234 %B0 2032 2033 2220 22A5 2312 2202 2261 2252 226A 226B 221A 223D 221D 2235 222B 222C 2208 220B 2286 2287 2282 2283 222A 2229 2227 2228 FFE2 21D2 21D4 2200 2203 %B4 FF5E 02C7 02D8 02DD 02DA 02D9 %B8 02DB %A1 %BF 02D0 222E 2211 220F 266D 2669 266A 266C 327F 2192 2190 2191 2193 2194 2195 2197 2199 2196 2198 321C 2116 33C7 2122 33C2 33D8 2121 2668 260F 260E 261C 261E %B6 2020 2021 %AE %AA %BA 2642 2640').replace(/(\S{4})/g, function(a){return "%u"+a;}).split(' ');
		this.charSet[1] = unescape('%BD 2153 2154 %BC %BE 215B 215C 215D 215E %B9 %B2 %B3 2074 207F 2081 2082 2083 2084 2160 2161 2162 2163 2164 2165 2166 2167 2168 2169 2170 2171 2172 2173 2174 2175 2176 2177 2178 2179 FFE6 %24 FFE5 FFE1 20AC 2103 212B 2109 FFE0 %A4 2030 3395 3396 3397 2113 3398 33C4 33A3 33A4 33A5 33A6 3399 339A 339B 339C 339D 339E 339F 33A0 33A1 33A2 33CA 338D 338E 338F 33CF 3388 3389 33C8 33A7 33A8 33B0 33B1 33B2 33B3 33B4 33B5 33B6 33B7 33B8 33B9 3380 3381 3382 3383 3384 33BA 33BB 33BC 33BD 33BE 33BF 3390 3391 3392 3393 3394 2126 33C0 33C1 338A 338B 338C 33D6 33C5 33AD 33AE 33AF 33DB 33A9 33AA 33AB 33AC 33DD 33D0 33D3 33C3 33C9 33DC 33C6').replace(/(\S{4})/g, function(a){return "%u"+a;}).split(' ');
		this.charSet[2] = unescape('3260 3261 3262 3263 3264 3265 3266 3267 3268 3269 326A 326B 326C 326D 326E 326F 3270 3271 3272 3273 3274 3275 3276 3277 3278 3279 327A 327B 24D0 24D1 24D2 24D3 24D4 24D5 24D6 24D7 24D8 24D9 24DA 24DB 24DC 24DD 24DE 24DF 24E0 24E1 24E2 24E3 24E4 24E5 24E6 24E7 24E8 24E9 2460 2461 2462 2463 2464 2465 2466 2467 2468 2469 246A 246B 246C 246D 246E 3200 3201 3202 3203 3204 3205 3206 3207 3208 3209 320A 320B 320C 320D 320E 320F 3210 3211 3212 3213 3214 3215 3216 3217 3218 3219 321A 321B 249C 249D 249E 249F 24A0 24A1 24A2 24A3 24A4 24A5 24A6 24A7 24A8 24A9 24AA 24AB 24AC 24AD 24AE 24AF 24B0 24B1 24B2 24B3 24B4 24B5 2474 2475 2476 2477 2478 2479 247A 247B 247C 247D 247E 247F 2480 2481 2482').replace(/(\S{4})/g, function(a){return "%u"+a;}).split(' ');
		this.charSet[3] = unescape('3131 3132 3133 3134 3135 3136 3137 3138 3139 313A 313B 313C 313D 313E 313F 3140 3141 3142 3143 3144 3145 3146 3147 3148 3149 314A 314B 314C 314D 314E 314F 3150 3151 3152 3153 3154 3155 3156 3157 3158 3159 315A 315B 315C 315D 315E 315F 3160 3161 3162 3163 3165 3166 3167 3168 3169 316A 316B 316C 316D 316E 316F 3170 3171 3172 3173 3174 3175 3176 3177 3178 3179 317A 317B 317C 317D 317E 317F 3180 3181 3182 3183 3184 3185 3186 3187 3188 3189 318A 318B 318C 318D 318E').replace(/(\S{4})/g, function(a){return "%u"+a;}).split(' ');
		this.charSet[4] = unescape('0391 0392 0393 0394 0395 0396 0397 0398 0399 039A 039B 039C 039D 039E 039F 03A0 03A1 03A3 03A4 03A5 03A6 03A7 03A8 03A9 03B1 03B2 03B3 03B4 03B5 03B6 03B7 03B8 03B9 03BA 03BB 03BC 03BD 03BE 03BF 03C0 03C1 03C3 03C4 03C5 03C6 03C7 03C8 03C9 %C6 %D0 0126 0132 013F 0141 %D8 0152 %DE 0166 014A %E6 0111 %F0 0127 I 0133 0138 0140 0142 0142 0153 %DF %FE 0167 014B 0149 0411 0413 0414 0401 0416 0417 0418 0419 041B 041F 0426 0427 0428 0429 042A 042B 042C 042D 042E 042F 0431 0432 0433 0434 0451 0436 0437 0438 0439 043B 043F 0444 0446 0447 0448 0449 044A 044B 044C 044D 044E 044F').replace(/(\S{4})/g, function(a){return "%u"+a;}).split(' ');
		this.charSet[5] = unescape('3041 3042 3043 3044 3045 3046 3047 3048 3049 304A 304B 304C 304D 304E 304F 3050 3051 3052 3053 3054 3055 3056 3057 3058 3059 305A 305B 305C 305D 305E 305F 3060 3061 3062 3063 3064 3065 3066 3067 3068 3069 306A 306B 306C 306D 306E 306F 3070 3071 3072 3073 3074 3075 3076 3077 3078 3079 307A 307B 307C 307D 307E 307F 3080 3081 3082 3083 3084 3085 3086 3087 3088 3089 308A 308B 308C 308D 308E 308F 3090 3091 3092 3093 30A1 30A2 30A3 30A4 30A5 30A6 30A7 30A8 30A9 30AA 30AB 30AC 30AD 30AE 30AF 30B0 30B1 30B2 30B3 30B4 30B5 30B6 30B7 30B8 30B9 30BA 30BB 30BC 30BD 30BE 30BF 30C0 30C1 30C2 30C3 30C4 30C5 30C6 30C7 30C8 30C9 30CA 30CB 30CC 30CD 30CE 30CF 30D0 30D1 30D2 30D3 30D4 30D5 30D6 30D7 30D8 30D9 30DA 30DB 30DC 30DD 30DE 30DF 30E0 30E1 30E2 30E3 30E4 30E5 30E6 30E7 30E8 30E9 30EA 30EB 30EC 30ED 30EE 30EF 30F0 30F1 30F2 30F3 30F4 30F5 30F6').replace(/(\S{4})/g, function(a){return "%u"+a;}).split(' ');
		
		var funcInsert = jindo.$Fn(this.oApp.exec, this.oApp).bind("INSERT_SCHARACTERS", [this.oTextField.value]);
		jindo.$Fn(funcInsert, this).attach(this.oInsertButton, "click");

		this.oApp.exec("SET_SCHARACTER_LIST", [this.charSet]);

		for(var i=0; i<this.aLabel.length; i++){
			var func = jindo.$Fn(this.oApp.exec, this.oApp).bind("CHANGE_SCHARACTER_SET", [i]);
			jindo.$Fn(func, this).attach(this.aLabel[i].firstChild, "mousedown");
		}

		for(var i=0; i<this.aCloseButton.length; i++){
			this.oApp.registerBrowserEvent(this.aCloseButton[i], "click", "HIDE_ACTIVE_LAYER", []);
		}
		
		this.oApp.registerBrowserEvent(this.elDropdownLayer, "click", "EVENT_SCHARACTER_CLICKED", []);
	},
	
	$ON_TOGGLE_SCHARACTER_LAYER : function(){
		this.oTextField.value = "";
		this.oSelection = this.oApp.getSelection();

		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "MSG_SCHARACTER_LAYER_SHOWN", [], "MSG_SCHARACTER_LAYER_HIDDEN", [""]]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['symbol']);
	},
	
	$ON_MSG_SCHARACTER_LAYER_SHOWN : function(){
		this.oTextField.focus();
		this.oApp.exec("SELECT_UI", ["sCharacter"]);
	},

	$ON_MSG_SCHARACTER_LAYER_HIDDEN : function(){
		this.oApp.exec("DESELECT_UI", ["sCharacter"]);
	},

	$ON_EVENT_SCHARACTER_CLICKED : function(weEvent){
		var elButton = nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON", weEvent.element);
		if(!elButton || elButton.tagName != "BUTTON"){return;}

		if(elButton.parentNode.tagName != "LI"){return;}
		
		var sChar = elButton.firstChild.innerHTML;
		if(sChar.length > 1){return;}

		this.oApp.exec("SELECT_SCHARACTER", [sChar]);
		weEvent.stop();
	},

	$ON_SELECT_SCHARACTER : function(schar){
		this.oTextField.value += schar;

		if(this.oTextField.createTextRange){
			var oTextRange = this.oTextField.createTextRange();
			oTextRange.collapse(false);
			oTextRange.select();
		}else{
			if(this.oTextField.selectionEnd){
				this.oTextField.selectionEnd = this.oTextField.value.length;
				this.oTextField.focus();
			}
		}
	},
	
	$ON_INSERT_SCHARACTERS : function(){
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["INSERT SCHARACTER"]);
		this.oApp.exec("PASTE_HTML", [this.oTextField.value]);
		this.oApp.exec("FOCUS");
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["INSERT SCHARACTER"]);
		
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_CHANGE_SCHARACTER_SET : function(nSCharSet){
		for(var i=0; i<this.aSCharList.length; i++){
			if(jindo.$Element(this.aLabel[i]).hasClass("active")){
				if(i == nSCharSet){return;}
				
				jindo.$Element(this.aLabel[i]).removeClass("active");
			}
		}
		
		this._drawSCharList(nSCharSet);
		jindo.$Element(this.aLabel[nSCharSet]).addClass("active");
	},

	$ON_SET_SCHARACTER_LIST : function(charSet){
		this.charSet = charSet;
		this.bSCharSetDrawn = new Array(this.charSet.length);
		this._drawSCharList(0);
	},

	_drawSCharList : function(i){
		if(this.bSCharSetDrawn[i]){return;}
		this.bSCharSetDrawn[i] = true;

		var len = this.charSet[i].length;
		var aLI = new Array(len);

		this.aSCharList[i].innerHTML = '';

		var button, span;
		for(var ii=0; ii<len; ii++){
			aLI[ii] = jindo.$("<LI>");

			if(this.bIE){
				button = jindo.$("<BUTTON>");
				button.setAttribute('type', 'button');	
			}else{
				button = jindo.$("<BUTTON>");
				button.type = "button";
			}
			span = jindo.$("<SPAN>");
			span.innerHTML = unescape(this.charSet[i][ii]);
			button.appendChild(span);

			aLI[ii].appendChild(button);
			aLI[ii].onmouseover = function(){this.className='hover'};
			aLI[ii].onmouseout = function(){this.className=''};

			this.aSCharList[i].appendChild(aLI[ii]);
		}

		//this.oApp.delayedExec("SE2_ATTACH_HOVER_EVENTS", [jindo.$$(">LI", this.aSCharList[i]), 0]);
	}
	//@lazyload_js]
});
//}
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to changing the font style in the table.
 * @requires SE2M_TableEditor.js
 * @name SE2M_TableBlockManager
 */
nhn.husky.SE2M_TableBlockStyler = jindo.$Class({
	name : "SE2M_TableBlockStyler",
	nSelectedTD : 0,
	htSelectedTD : {},
	aTdRange : [],
	
	$init : function(){ },
	
	$LOCAL_BEFORE_ALL : function(){
		return (this.oApp.getEditingMode() == "WYSIWYG");
	},
	
	$ON_MSG_APP_READY : function(){
		this.oDocument = this.oApp.getWYSIWYGDocument();
	},
	
	$ON_EVENT_EDITING_AREA_MOUSEUP : function(wevE){
		if(this.oApp.getEditingMode() != "WYSIWYG") return;
		this.setTdBlock();
	},
	
	/**
	 * selected Area°¡ td blockÀÎÁö Ã¼Å©ÇÏ´Â ÇÔ¼ö.
	 */
	$ON_IS_SELECTED_TD_BLOCK : function(sAttr,oReturn) {
		if( this.nSelectedTD > 0){
			oReturn[sAttr] = true;
			return oReturn[sAttr];
		}else{
			oReturn[sAttr] = false;
			return oReturn[sAttr];
		}
	},
	
	/**
	 * 
	 */
	$ON_GET_SELECTED_TD_BLOCK : function(sAttr,oReturn){
		//use : this.oApp.exec("GET_SELECTED_TD_BLOCK",['aCells',this.htSelectedTD]);
		oReturn[sAttr] = this.htSelectedTD.aTdCells;
	},
	
	setTdBlock : function() {
		this.oApp.exec("GET_SELECTED_CELLS",['aTdCells',this.htSelectedTD]); //tableEditor·Î ºÎÅÍ ¾ò¾î¿Â´Ù.
		var aNodes = this.htSelectedTD.aTdCells;
		if(aNodes){
			this.nSelectedTD = aNodes.length;
		}
	},
	
	$ON_DELETE_BLOCK_CONTENTS : function(){
		var self = this, welParent, oBlockNode, oChildNode;
		
		this.setTdBlock();
		for (var j = 0; j < this.nSelectedTD ; j++){
			jindo.$Element(this.htSelectedTD.aTdCells[j]).child( function(elChild){
				
				welParent = jindo.$Element(elChild._element.parentNode);
				welParent.remove(elChild);

				oBlockNode = self.oDocument.createElement('P');								
				
				if (jindo.$Agent().navigator().firefox) {
					oChildNode = self.oDocument.createElement('BR');
				} else {
					oChildNode = self.oDocument.createTextNode('\u00A0');
				}
				
				oBlockNode.appendChild(oChildNode);
				welParent.append(oBlockNode);
			}, 1);
		}
	}
	
});
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to table creation
 * @name hp_SE_Table.js
 */
nhn.husky.SE2M_TableCreator = jindo.$Class({
	name : "SE2M_TableCreator",

	_sSETblClass : "__se_tbl",
	
	nRows : 3,
	nColumns : 4,
	nBorderSize : 1,
	sBorderColor : "#000000",
	sBGColor: "#000000",
	
	nBorderStyleIdx : 3,
	nTableStyleIdx : 1,
	
	nMinRows : 1,
	nMaxRows : 20,
	nMinColumns : 1,
	nMaxColumns : 20,
	nMinBorderWidth : 1,
	nMaxBorderWidth : 10,
	
	rxLastDigits : null,
	sReEditGuideMsg_table : null,
	
	// Å×µÎ¸® ½ºÅ¸ÀÏ ¸ñ·Ï
	// Ç¥ ½ºÅ¸ÀÏ ½ºÅ¸ÀÏ ¸ñ·Ï
	oSelection : null,
	
	$ON_MSG_APP_READY : function(){
		this.sReEditGuideMsg_table = this.oApp.$MSG(nhn.husky.SE2M_Configuration.SE2M_ReEditAction.aReEditGuideMsg[3]);
		this.oApp.exec("REGISTER_UI_EVENT", ["table", "click", "TOGGLE_TABLE_LAYER"]);
	},
	
	// [SMARTEDITORSUS-365] Å×ÀÌºíÄü¿¡µðÅÍ > ¼Ó¼º Á÷Á¢ÀÔ·Â > Å×µÎ¸® ½ºÅ¸ÀÏ
	//		- Å×µÎ¸® ¾øÀ½À» ¼±ÅÃÇÏ´Â °æ¿ì º»¹®¿¡ »ðÀÔÇÏ´Â Ç¥¿¡ °¡ÀÌµå ¶óÀÎÀ» Ç¥½ÃÇØ ÁÝ´Ï´Ù. º¸±â ½Ã¿¡´Â Å×µÎ¸®°¡ º¸ÀÌÁö ¾Ê½À´Ï´Ù.
	$ON_REGISTER_CONVERTERS : function(){
		this.oApp.exec("ADD_CONVERTER_DOM", ["IR_TO_DB", jindo.$Fn(this.irToDbDOM, this).bind()]);
		this.oApp.exec("ADD_CONVERTER_DOM", ["DB_TO_IR", jindo.$Fn(this.dbToIrDOM, this).bind()]);
	},
	
	irToDbDOM : function(oTmpNode){
		/**
		 *	ÀúÀåÀ» À§ÇÑ Table Tag ´Â ¾Æ·¡¿Í °°ÀÌ º¯°æµË´Ï´Ù.
		 *	(1) <TABLE>
		 *			<table border="1" cellpadding="0" cellspacing="0" style="border:1px dashed #c7c7c7; border-left:0; border-bottom:0;" attr_no_border_tbl="1" class="__se_tbl">
		 *		-->	<table border="0" cellpadding="1" cellspacing="0" attr_no_border_tbl="1" class="__se_tbl">
		 *	(2) <TD>
		 *			<td style="border:1px dashed #c7c7c7; border-top:0; border-right:0; background-color:#ffef00" width="245"><p>&nbsp;</p></td>
		 *		-->	<td style="background-color:#ffef00" width="245">&nbsp;</td>
		 */
		var aNoBorderTable = [];
		var aTables = jindo.$$('table[class=__se_tbl]', oTmpNode, {oneTimeOffCache:true});
		
		// Å×µÎ¸®°¡ ¾øÀ½ ¼Ó¼ºÀÇ table (ÀÓÀÇ·Î Ãß°¡ÇÑ attr_no_border_tbl ¼Ó¼ºÀÌ ÀÖ´Â table À» Ã£À½)
		jindo.$A(aTables).forEach(function(oValue, nIdx, oArray) {
			if(jindo.$Element(oValue).attr("attr_no_border_tbl")){
				aNoBorderTable.push(oValue);
			}
		}, this);
		
		if(aNoBorderTable.length < 1){
			return;
		}
		
		// [SMARTEDITORSUS-410] ±Û ÀúÀå ½Ã, Å×µÎ¸® ¾øÀ½ ¼Ó¼ºÀ» ¼±ÅÃÇÒ ¶§ ÀÓÀÇ·Î Ç¥½ÃÇÑ °¡ÀÌµå ¶óÀÎ property ¸¸ style ¿¡¼­ Á¦°ÅÇØ ÁØ´Ù.
		// <TABLE> °ú <TD> ÀÇ ¼Ó¼º°ªÀ» º¯°æ ¹× Á¦°Å
		var aTDs = [], oTable;
		for(var i = 0, nCount = aNoBorderTable.length; i < nCount; i++){
			oTable = aNoBorderTable[i];
			
			// <TABLE> ¿¡¼­ border, cellpadding ¼Ó¼º°ª º¯°æ, style property Á¦°Å
			jindo.$Element(oTable).css({"border": "", "borderLeft": "", "borderBottom": ""});
			jindo.$Element(oTable).attr({"border": 0, "cellpadding": 1});
			
			// <TD> ¿¡¼­´Â background-color ¸¦ Á¦¿ÜÇÑ style À» ¸ðµÎ Á¦°Å
			aTDs = jindo.$$('tbody>tr>td', oTable);
			jindo.$A(aTDs).forEach(function(oTD, nIdx, oTDArray) {
				jindo.$Element(oTD).css({"border": "", "borderTop": "", "borderRight": ""});
			});
		}
	},
	
	dbToIrDOM : function(oTmpNode){
		/**
		 *	¼öÁ¤À» À§ÇÑ Table Tag ´Â ¾Æ·¡¿Í °°ÀÌ º¯°æµË´Ï´Ù.
		 *	(1) <TABLE>
		 *			<table border="0" cellpadding="1" cellspacing="0" attr_no_border_tbl="1" class="__se_tbl">
		 *		--> <table border="1" cellpadding="0" cellspacing="0" style="border:1px dashed #c7c7c7; border-left:0; border-bottom:0;" attr_no_border_tbl="1" class="__se_tbl">
		 *	(2) <TD>
		 *			<td style="background-color:#ffef00" width="245">&nbsp;</td>
		 *		-->	<td style="border:1px dashed #c7c7c7; border-top:0; border-right:0; background-color:#ffef00" width="245"><p>&nbsp;</p></td>
		 */
		var aNoBorderTable = [];
		var aTables = jindo.$$('table[class=__se_tbl]', oTmpNode, {oneTimeOffCache:true});
		
		// Å×µÎ¸®°¡ ¾øÀ½ ¼Ó¼ºÀÇ table (ÀÓÀÇ·Î Ãß°¡ÇÑ attr_no_border_tbl ¼Ó¼ºÀÌ ÀÖ´Â table À» Ã£À½)
		jindo.$A(aTables).forEach(function(oValue, nIdx, oArray) {
			if(jindo.$Element(oValue).attr("attr_no_border_tbl")){
				aNoBorderTable.push(oValue);
			}
		}, this);
		
		if(aNoBorderTable.length < 1){
			return;
		}
		
		// <TABLE> °ú <TD> ÀÇ ¼Ó¼º°ªÀ» º¯°æ/Ãß°¡
		var aTDs = [], oTable;
		for(var i = 0, nCount = aNoBorderTable.length; i < nCount; i++){
			oTable = aNoBorderTable[i];
			
			// <TABLE> ¿¡¼­ border, cellpadding ¼Ó¼º°ª º¯°æ/ style ¼Ó¼º Ãß°¡
			jindo.$Element(oTable).css({"border": "1px dashed #c7c7c7", "borderLeft": 0, "borderBottom": 0});
			jindo.$Element(oTable).attr({"border": 1, "cellpadding": 0});
			
			// <TD> ¿¡¼­ style ¼Ó¼º°ª Ãß°¡
			aTDs = jindo.$$('tbody>tr>td', oTable);
			jindo.$A(aTDs).forEach(function(oTD, nIdx, oTDArray) {
				jindo.$Element(oTD).css({"border": "1px dashed #c7c7c7", "borderTop": 0, "borderRight": 0});
			});
		}
	},
	
	//@lazyload_js TOGGLE_TABLE_LAYER[
	_assignHTMLObjects : function(oAppContainer){
		this.oApp.exec("LOAD_HTML", ["create_table"]);
		var tmp = null;

		this.elDropdownLayer = jindo.$$.getSingle("DIV.husky_se2m_table_layer", oAppContainer);
		this.welDropdownLayer = jindo.$Element(this.elDropdownLayer);

		tmp = jindo.$$("INPUT", this.elDropdownLayer);
		this.elText_row = tmp[0];
		this.elText_col = tmp[1];
		this.elRadio_manualStyle = tmp[2];
		this.elText_borderSize = tmp[3];
		this.elText_borderColor = tmp[4];
		this.elText_BGColor = tmp[5];
		this.elRadio_templateStyle = tmp[6];

		tmp = jindo.$$("BUTTON", this.elDropdownLayer);
		this.elBtn_rowInc = tmp[0];
		this.elBtn_rowDec = tmp[1];
		this.elBtn_colInc = tmp[2];
		this.elBtn_colDec = tmp[3];
		this.elBtn_borderStyle = tmp[4];
		this.elBtn_incBorderSize = jindo.$$.getSingle("BUTTON.se2m_incBorder", this.elDropdownLayer);
		this.elBtn_decBorderSize = jindo.$$.getSingle("BUTTON.se2m_decBorder", this.elDropdownLayer);

		this.elLayer_Dim1 = jindo.$$.getSingle("DIV.se2_t_dim0", this.elDropdownLayer);
		this.elLayer_Dim2 = jindo.$$.getSingle("DIV.se2_t_dim3", this.elDropdownLayer);
		
		// border style layer contains btn elm's
		
		tmp = jindo.$$("SPAN.se2_pre_color>BUTTON", this.elDropdownLayer);
		 
		this.elBtn_borderColor = tmp[0];
		this.elBtn_BGColor = tmp[1];
		
		this.elBtn_tableStyle =  jindo.$$.getSingle("DIV.se2_select_ty2>BUTTON", this.elDropdownLayer);
		
		tmp = jindo.$$("P.se2_btn_area>BUTTON", this.elDropdownLayer);
		this.elBtn_apply = tmp[0];
		this.elBtn_cancel = tmp[1];

		this.elTable_preview = jindo.$$.getSingle("TABLE.husky_se2m_table_preview", this.elDropdownLayer);
		this.elLayer_borderStyle = jindo.$$.getSingle("DIV.husky_se2m_table_border_style_layer", this.elDropdownLayer);
		this.elPanel_borderStylePreview = jindo.$$.getSingle("SPAN.husky_se2m_table_border_style_preview", this.elDropdownLayer);
		this.elPanel_borderColorPallet = jindo.$$.getSingle("DIV.husky_se2m_table_border_color_pallet", this.elDropdownLayer);
		this.elPanel_bgColorPallet = jindo.$$.getSingle("DIV.husky_se2m_table_bgcolor_pallet", this.elDropdownLayer);
		this.elLayer_tableStyle = jindo.$$.getSingle("DIV.husky_se2m_table_style_layer", this.elDropdownLayer);
		this.elPanel_tableStylePreview = jindo.$$.getSingle("SPAN.husky_se2m_table_style_preview", this.elDropdownLayer);

		this.aElBtn_borderStyle = jindo.$$("BUTTON", this.elLayer_borderStyle);
		this.aElBtn_tableStyle = jindo.$$("BUTTON", this.elLayer_tableStyle);

		this.sNoBorderText = jindo.$$.getSingle("SPAN.se2m_no_border", this.elDropdownLayer).innerHTML;

		this.rxLastDigits = RegExp("([0-9]+)$");
	},
	
	$LOCAL_BEFORE_FIRST : function(){
		this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);

		this.oApp.registerBrowserEvent(this.elText_row, "change", "TABLE_SET_ROW_NUM", [null, 0]);
		this.oApp.registerBrowserEvent(this.elText_col, "change", "TABLE_SET_COLUMN_NUM", [null, 0]);
		this.oApp.registerBrowserEvent(this.elText_borderSize, "change", "TABLE_SET_BORDER_SIZE", [null, 0]);
		
		this.oApp.registerBrowserEvent(this.elBtn_rowInc, "click", "TABLE_INC_ROW");
		this.oApp.registerBrowserEvent(this.elBtn_rowDec, "click", "TABLE_DEC_ROW");
		jindo.$Fn(this._numRowKeydown, this).attach(this.elText_row.parentNode, "keydown");

		this.oApp.registerBrowserEvent(this.elBtn_colInc, "click", "TABLE_INC_COLUMN");
		this.oApp.registerBrowserEvent(this.elBtn_colDec, "click", "TABLE_DEC_COLUMN");
		jindo.$Fn(this._numColKeydown, this).attach(this.elText_col.parentNode, "keydown");

		this.oApp.registerBrowserEvent(this.elBtn_incBorderSize, "click", "TABLE_INC_BORDER_SIZE");
		this.oApp.registerBrowserEvent(this.elBtn_decBorderSize, "click", "TABLE_DEC_BORDER_SIZE");
		jindo.$Fn(this._borderSizeKeydown, this).attach(this.elText_borderSize.parentNode, "keydown");

		this.oApp.registerBrowserEvent(this.elBtn_borderStyle, "click", "TABLE_TOGGLE_BORDER_STYLE_LAYER");
		this.oApp.registerBrowserEvent(this.elBtn_tableStyle, "click", "TABLE_TOGGLE_STYLE_LAYER");
		
		this.oApp.registerBrowserEvent(this.elBtn_borderColor, "click", "TABLE_TOGGLE_BORDER_COLOR_PALLET");
		this.oApp.registerBrowserEvent(this.elBtn_BGColor, "click", "TABLE_TOGGLE_BGCOLOR_PALLET");

		this.oApp.registerBrowserEvent(this.elRadio_manualStyle, "click", "TABLE_ENABLE_MANUAL_STYLE");
		this.oApp.registerBrowserEvent(this.elRadio_templateStyle, "click", "TABLE_ENABLE_TEMPLATE_STYLE");

		//this.oApp.registerBrowserEvent(this.elDropdownLayer, "click", "TABLE_LAYER_CLICKED");
		//this.oApp.registerBrowserEvent(this.elLayer_borderStyle, "click", "TABLE_BORDER_STYLE_LAYER_CLICKED");
		//this.oApp.registerBrowserEvent(this.elLayer_tableStyle, "click", "TABLE_STYLE_LAYER_CLICKED");

		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [this.aElBtn_borderStyle]);
		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [this.aElBtn_tableStyle]);

		var i;
		for(i=0; i<this.aElBtn_borderStyle.length; i++){
			this.oApp.registerBrowserEvent(this.aElBtn_borderStyle[i], "click", "TABLE_SELECT_BORDER_STYLE");
		}

		for(i=0; i<this.aElBtn_tableStyle.length; i++){
			this.oApp.registerBrowserEvent(this.aElBtn_tableStyle[i], "click", "TABLE_SELECT_STYLE");
		}
		
		this.oApp.registerBrowserEvent(this.elBtn_apply, "click", "TABLE_INSERT");
		this.oApp.registerBrowserEvent(this.elBtn_cancel, "click", "HIDE_ACTIVE_LAYER");

		this.oApp.exec("TABLE_SET_BORDER_COLOR", [/#[0-9A-Fa-f]{6}/.test(this.elText_borderColor.value) ? this.elText_borderColor.value : "#cccccc"]);
		this.oApp.exec("TABLE_SET_BGCOLOR", [/#[0-9A-Fa-f]{6}/.test(this.elText_BGColor.value) ? this.elText_BGColor.value : "#ffffff"]);
		
		// 1: manual style
		// 2: template style
		this.nStyleMode = 1;

		// add #BorderSize+x# if needed
		//---
		// [SMARTEDITORSUS-365] Å×ÀÌºíÄü¿¡µðÅÍ > ¼Ó¼º Á÷Á¢ÀÔ·Â > Å×µÎ¸® ½ºÅ¸ÀÏ
		//		- Å×µÎ¸® ¾øÀ½À» ¼±ÅÃÇÏ´Â °æ¿ì º»¹®¿¡ »ðÀÔÇÏ´Â Ç¥¿¡ °¡ÀÌµå ¶óÀÎÀ» Ç¥½ÃÇØ ÁÝ´Ï´Ù. º¸±â ½Ã¿¡´Â Å×µÎ¸®°¡ º¸ÀÌÁö ¾Ê½À´Ï´Ù.
		this.aTableStyleByBorder = [
			'',
			'border="1" cellpadding="0" cellspacing="0" style="border:1px dashed #c7c7c7; border-left:0; border-bottom:0;"',
			'border="1" cellpadding="0" cellspacing="0" style="border:#BorderSize#px dashed #BorderColor#; border-left:0; border-bottom:0;"',
			'border="0" cellpadding="0" cellspacing="0" style="border:#BorderSize#px solid #BorderColor#; border-left:0; border-bottom:0;"',
			'border="0" cellpadding="0" cellspacing="1" style="border:#BorderSize#px solid #BorderColor#;"',
			'border="0" cellpadding="0" cellspacing="1" style="border:#BorderSize#px double #BorderColor#;"',
			'border="0" cellpadding="0" cellspacing="1" style="border-width:#BorderSize*2#px #BorderSize#px #BorderSize#px #BorderSize*2#px; border-style:solid;border-color:#BorderColor#;"',
			'border="0" cellpadding="0" cellspacing="1" style="border-width:#BorderSize#px #BorderSize*2#px #BorderSize*2#px #BorderSize#px; border-style:solid;border-color:#BorderColor#;"'
		];

		this.aTDStyleByBorder = [
			'',
			'style="border:1px dashed #c7c7c7; border-top:0; border-right:0; background-color:#BGColor#"',
			'style="border:#BorderSize#px dashed #BorderColor#; border-top:0; border-right:0; background-color:#BGColor#"',
			'style="border:#BorderSize#px solid #BorderColor#; border-top:0; border-right:0; background-color:#BGColor#"',
			'style="border:#BorderSize#px solid #BorderColor#; background-color:#BGColor#"',
			'style="border:#BorderSize+2#px double #BorderColor#; background-color:#BGColor#"',
			'style="border-width:#BorderSize#px #BorderSize*2#px #BorderSize*2#px #BorderSize#px; border-style:solid;border-color:#BorderColor#; background-color:#BGColor#"',
			'style="border-width:#BorderSize*2#px #BorderSize#px #BorderSize#px #BorderSize*2#px; border-style:solid;border-color:#BorderColor#; background-color:#BGColor#"'
		];
		this.oApp.registerBrowserEvent(this.elDropdownLayer, "keydown", "EVENT_TABLE_CREATE_KEYDOWN");
		
		this._drawTableDropdownLayer();
	},

	$ON_TABLE_SELECT_BORDER_STYLE : function(weEvent){
		var elButton = weEvent.currentElement;
//		var aMatch = this.rxLastDigits.exec(weEvent.element.className);
		var aMatch = this.rxLastDigits.exec(elButton.className);
		this._selectBorderStyle(aMatch[1]);
	},
	
	$ON_TABLE_SELECT_STYLE : function(weEvent){
		var aMatch = this.rxLastDigits.exec(weEvent.element.className);
		this._selectTableStyle(aMatch[1]);
	},

	$ON_TOGGLE_TABLE_LAYER : function(){
//		this.oSelection = this.oApp.getSelection();
		this._showNewTable();
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "SELECT_UI", ["table"], "TABLE_CLOSE", []]);
		this.oApp.exec('MSG_NOTIFY_CLICKCR', ['table']);
	},
	
	// $ON_TABLE_BORDER_STYLE_LAYER_CLICKED : function(weEvent){
		// top.document.title = weEvent.element.tagName;
	// },
	
	$ON_TABLE_CLOSE_ALL : function(){
		this.oApp.exec("TABLE_HIDE_BORDER_COLOR_PALLET", []);
		this.oApp.exec("TABLE_HIDE_BGCOLOR_PALLET", []);
		this.oApp.exec("TABLE_HIDE_BORDER_STYLE_LAYER", []);
		this.oApp.exec("TABLE_HIDE_STYLE_LAYER", []);
	},
	
	$ON_TABLE_INC_ROW : function(){
		this.oApp.exec("TABLE_SET_ROW_NUM", [null, 1]);
	},
	
	$ON_TABLE_DEC_ROW : function(){
		this.oApp.exec("TABLE_SET_ROW_NUM", [null, -1]);
	},
	
	$ON_TABLE_INC_COLUMN : function(){
		this.oApp.exec("TABLE_SET_COLUMN_NUM", [null, 1]);
	},
	
	$ON_TABLE_DEC_COLUMN : function(){
		this.oApp.exec("TABLE_SET_COLUMN_NUM", [null, -1]);
	},
	
	$ON_TABLE_SET_ROW_NUM : function(nRows, nRowDiff){
		nRows = nRows || parseInt(this.elText_row.value, 10) || 0;
		nRowDiff = nRowDiff || 0;
		
		nRows += nRowDiff;

		if(nRows < this.nMinRows){nRows = this.nMinRows;}
		if(nRows > this.nMaxRows){nRows = this.nMaxRows;}
		
		this.elText_row.value = nRows;
		this._showNewTable();
	},

	$ON_TABLE_SET_COLUMN_NUM : function(nColumns, nColumnDiff){
		nColumns = nColumns || parseInt(this.elText_col.value, 10) || 0;
		nColumnDiff = nColumnDiff || 0;
		
		nColumns += nColumnDiff;
		
		if(nColumns < this.nMinColumns){nColumns = this.nMinColumns;}
		if(nColumns > this.nMaxColumns){nColumns = this.nMaxColumns;}
		
		this.elText_col.value = nColumns;
		this._showNewTable();
	},

	_getTableString : function(){
		var sTable;
		if(this.nStyleMode == 1){
			sTable = this._doGetTableString(this.nColumns, this.nRows, this.nBorderSize, this.sBorderColor, this.sBGColor, this.nBorderStyleIdx);
		}else{
			sTable = this._doGetTableString(this.nColumns, this.nRows, this.nBorderSize, this.sBorderColor, this.sBGColor, 0);
		}
		
		return sTable;
	},
	
	$ON_TABLE_INSERT : function(){
		this.oApp.exec("IE_FOCUS", []);	// [SMARTEDITORSUS-500] IEÀÎ °æ¿ì ¸í½ÃÀûÀÎ focus Ãß°¡
		
		//[SMARTEDITORSUS-596]ÀÌº¥Æ® ¹ß»ýÀÌ ¾ÈµÇ´Â °æ¿ì, 
		//max Á¦ÇÑÀÌ Àû¿ëÀÌ ¾ÈµÇ±â ¶§¹®¿¡ Å×ÀÌºí »çÀÔ ½ÃÁ¡¿¡ ´Ù½ÃÇÑ¹ø Max °ªÀ» °Ë»çÇÑ´Ù.
		this.oApp.exec("TABLE_SET_COLUMN_NUM");
		this.oApp.exec("TABLE_SET_ROW_NUM");
		
		this._loadValuesFromHTML();
		
		var sTable, 
			elLinebreak, 
			elBody, 
			welBody,
			elTmpDiv,
			elTable,
			elFirstTD,
			oSelection,
			elTableHolder, 
			htBrowser;
			
		elBody = this.oApp.getWYSIWYGDocument().body;
		welBody = jindo.$Element(elBody);
		htBrowser = jindo.$Agent().navigator();
		
		this.nTableWidth = elBody.offsetWidth;
		
		sTable = this._getTableString();
	
		elTmpDiv = this.oApp.getWYSIWYGDocument().createElement("DIV");
		elTmpDiv.innerHTML = sTable;
		elTable = elTmpDiv.firstChild;
		elTable.className = this._sSETblClass;
				
		oSelection = this.oApp.getSelection();		
		oSelection = this._divideParagraph(oSelection);	// [SMARTEDITORSUS-306]
		
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["INSERT TABLE", {sSaveTarget:"BODY"}]);
				
		// If the table were inserted within a styled(strikethough & etc) paragraph, the table may inherit the style in IE.
		elTableHolder = this.oApp.getWYSIWYGDocument().createElement("DIV");
		// ¿µ¿ªÀ» Àâ¾ÒÀ» °æ¿ì, ¿µ¿ª Áö¿ì°í Å×ÀÌºí »ðÀÔ
		oSelection.deleteContents();
		oSelection.insertNode(elTableHolder);
		oSelection.selectNode(elTableHolder);
		this.oApp.exec("REMOVE_STYLE", [oSelection]);

		if(htBrowser.ie && this.oApp.getWYSIWYGDocument().body.childNodes.length === 1 && this.oApp.getWYSIWYGDocument().body.firstChild === elTableHolder){
			// IE¿¡¼­ tableÀÌ body¿¡ ¹Ù·Î ºÙ¾î ÀÖÀ» °æ¿ì, Á¤·Äµî¿¡¼­ ¹®Á¦°¡ ¹ß»ý ÇÔÀ¸·Î elTableHolder(DIV)¸¦ ³²°ÜµÒ
			elTableHolder.insertBefore(elTable, null);
		}else{
			elTableHolder.parentNode.insertBefore(elTable, elTableHolder);
			elTableHolder.parentNode.removeChild(elTableHolder);
		}

		// FF : Å×ÀÌºí ÇÏ´Ü¿¡ BRÀÌ ¾øÀ» °æ¿ì, Ä¿¼­°¡ Å×ÀÌºí ¹ØÀ¸·Î ÀÌµ¿ÇÒ ¼ö ¾ø¾î BRÀ» »ðÀÔ ÇØ ÁÜ.
		//[SMARTEDITORSUS-181][IE9] Ç¥³ª ¿ä¾à±Û µîÀÇ Å×ÀÌºí¿¡¼­ > Å×ÀÌºí ¿ÜºÎ·Î Ä¿¼­ ÀÌµ¿ ºÒ°¡
		if(htBrowser.firefox){
			elLinebreak = this.oApp.getWYSIWYGDocument().createElement("BR");
			elTable.parentNode.insertBefore(elLinebreak, elTable.nextSibling);
		}else if(htBrowser.ie ){			
			elLinebreak = this.oApp.getWYSIWYGDocument().createElement("p");
			elTable.parentNode.insertBefore(elLinebreak, elTable.nextSibling);
		}
		
		if(this.nStyleMode == 2){
			this.oApp.exec("STYLE_TABLE", [elTable, this.nTableStyleIdx]);
		}
		
		elFirstTD = elTable.getElementsByTagName("TD")[0];
		oSelection.selectNodeContents(elFirstTD.firstChild || elFirstTD);
		oSelection.collapseToEnd();
		oSelection.select();	
		
		this.oApp.exec("FOCUS");
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["INSERT TABLE", {sSaveTarget:"BODY"}]);
		
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
		this.oApp.exec('MSG_DISPLAY_REEDIT_MESSAGE_SHOW', [this.name, this.sReEditGuideMsg_table]);
	},
	
	/**
	 * P ¾È¿¡ Table ÀÌ Ãß°¡µÇÁö ¾Êµµ·Ï P ÅÂ±×¸¦ ºÐ¸®ÇÔ
	 * 
	 * [SMARTEDITORSUS-306]
	 *		P ¿¡ Table À» Ãß°¡ÇÑ °æ¿ì, DOM ¿¡¼­ ºñÁ¤»óÀûÀÎ P ¸¦ »ý¼ºÇÏ¿© ±úÁö´Â °æ¿ì°¡ ¹ß»ýÇÔ
	 *		Å×ÀÌºíÀÌ Ãß°¡µÇ´Â ºÎºÐ¿¡ P °¡ ÀÖ´Â °æ¿ì, P ¸¦ ºÐ¸®½ÃÄÑÁÖ´Â Ã³¸®
	 */
	_divideParagraph : function(oSelection){
		var oParentP,
			welParentP,
			sNodeVaule,
			sBM, oSWrapper, oEWrapper;
			
		oSelection.fixCommonAncestorContainer();	// [SMARTEDITORSUS-423] ¿£ÅÍ¿¡ ÀÇÇØ »ý¼ºµÈ P °¡ ¾Æ´Ñ ÀÌÀü P °¡ ¼±ÅÃµÇÁö ¾Êµµ·Ï fix ÇÏµµ·Ï Ã³¸®
		oParentP = oSelection.findAncestorByTagName("P");

		if(!oParentP){
			return oSelection;
		}

		if(!oParentP.firstChild || nhn.husky.SE2M_Utils.isBlankNode(oParentP)){
			oSelection.selectNode(oParentP);	// [SMARTEDITORSUS-423] ºÒÇÊ¿äÇÑ °³ÇàÀÌ ÀÏ¾î³ªÁö ¾Êµµ·Ï ºó P ¸¦ ¼±ÅÃÇÏ¿© TABLE ·Î ´ëÃ¼ÇÏµµ·Ï Ã³¸®
			oSelection.select();
			
			return oSelection;
		}
		
		sBM = oSelection.placeStringBookmark();
		
		oSelection.moveToBookmark(sBM);
					
		oSWrapper = this.oApp.getWYSIWYGDocument().createElement("P");
		oSelection.setStartBefore(oParentP.firstChild);
		oSelection.surroundContents(oSWrapper);
		oSelection.collapseToEnd();

		oEWrapper = this.oApp.getWYSIWYGDocument().createElement("P");
		oSelection.setEndAfter(oParentP.lastChild);
		oSelection.surroundContents(oEWrapper);
		oSelection.collapseToStart();
		
		oSelection.removeStringBookmark(sBM);
		
		welParentP = jindo.$Element(oParentP);
		welParentP.after(oEWrapper);
		welParentP.after(oSWrapper);

		welParentP.leave();
		
		oSelection = this.oApp.getEmptySelection();
		
		oSelection.setEndAfter(oSWrapper);
		oSelection.setStartBefore(oEWrapper);
		
		oSelection.select();
		
		return oSelection;
	},

	$ON_TABLE_CLOSE : function(){
		this.oApp.exec("TABLE_CLOSE_ALL", []);
		this.oApp.exec("DESELECT_UI", ["table"]);
	},
	
	$ON_TABLE_SET_BORDER_SIZE : function(nBorderWidth, nBorderWidthDiff){
		nBorderWidth = nBorderWidth || parseInt(this.elText_borderSize.value, 10) || 0;
		nBorderWidthDiff = nBorderWidthDiff || 0;

		nBorderWidth += nBorderWidthDiff;
		
		if(nBorderWidth < this.nMinBorderWidth){nBorderWidth = this.nMinBorderWidth;}
		if(nBorderWidth > this.nMaxBorderWidth){nBorderWidth = this.nMaxBorderWidth;}
		
		this.elText_borderSize.value = nBorderWidth;
	},

	$ON_TABLE_INC_BORDER_SIZE : function(){
		this.oApp.exec("TABLE_SET_BORDER_SIZE", [null, 1]);
	},

	$ON_TABLE_DEC_BORDER_SIZE : function(){
		this.oApp.exec("TABLE_SET_BORDER_SIZE", [null, -1]);
	},

	$ON_TABLE_TOGGLE_BORDER_STYLE_LAYER : function(){
		if(this.elLayer_borderStyle.style.display == "block"){
			this.oApp.exec("TABLE_HIDE_BORDER_STYLE_LAYER", []);
		}else{
			this.oApp.exec("TABLE_SHOW_BORDER_STYLE_LAYER", []);
		}
	},
	
	$ON_TABLE_SHOW_BORDER_STYLE_LAYER : function(){
		this.oApp.exec("TABLE_CLOSE_ALL", []);
		this.elBtn_borderStyle.className = "se2_view_more2";
		this.elLayer_borderStyle.style.display = "block";
		this._refresh();
	},
	
	$ON_TABLE_HIDE_BORDER_STYLE_LAYER : function(){
		this.elBtn_borderStyle.className = "se2_view_more";
		this.elLayer_borderStyle.style.display = "none";
		this._refresh();
	},

	$ON_TABLE_TOGGLE_STYLE_LAYER : function(){
		if(this.elLayer_tableStyle.style.display == "block"){
			this.oApp.exec("TABLE_HIDE_STYLE_LAYER", []);
		}else{
			this.oApp.exec("TABLE_SHOW_STYLE_LAYER", []);
		}
	},
	
	$ON_TABLE_SHOW_STYLE_LAYER : function(){
		this.oApp.exec("TABLE_CLOSE_ALL", []);
		this.elBtn_tableStyle.className = "se2_view_more2";
		this.elLayer_tableStyle.style.display = "block";
		this._refresh();
	},
	
	$ON_TABLE_HIDE_STYLE_LAYER : function(){
		this.elBtn_tableStyle.className = "se2_view_more";
		this.elLayer_tableStyle.style.display = "none";
		this._refresh();
	},

	$ON_TABLE_TOGGLE_BORDER_COLOR_PALLET : function(){
		if(this.welDropdownLayer.hasClass("p1")){
			this.oApp.exec("TABLE_HIDE_BORDER_COLOR_PALLET", []);
		}else{
			this.oApp.exec("TABLE_SHOW_BORDER_COLOR_PALLET", []);
		}
	},

	$ON_TABLE_SHOW_BORDER_COLOR_PALLET : function(){
		this.oApp.exec("TABLE_CLOSE_ALL", []);

		this.welDropdownLayer.addClass("p1");
		this.welDropdownLayer.removeClass("p2");
		
		this.oApp.exec("SHOW_COLOR_PALETTE", ["TABLE_SET_BORDER_COLOR_FROM_PALETTE", this.elPanel_borderColorPallet]);
		this.elPanel_borderColorPallet.parentNode.style.display = "block";
	},

	$ON_TABLE_HIDE_BORDER_COLOR_PALLET : function(){
		this.welDropdownLayer.removeClass("p1");
		
		this.oApp.exec("HIDE_COLOR_PALETTE", []);
		this.elPanel_borderColorPallet.parentNode.style.display = "none";
	},

	$ON_TABLE_TOGGLE_BGCOLOR_PALLET : function(){
		if(this.welDropdownLayer.hasClass("p2")){
			this.oApp.exec("TABLE_HIDE_BGCOLOR_PALLET", []);
		}else{
			this.oApp.exec("TABLE_SHOW_BGCOLOR_PALLET", []);
		}
	},

	$ON_TABLE_SHOW_BGCOLOR_PALLET : function(){
		this.oApp.exec("TABLE_CLOSE_ALL", []);
	
		this.welDropdownLayer.removeClass("p1");
		this.welDropdownLayer.addClass("p2");

		this.oApp.exec("SHOW_COLOR_PALETTE", ["TABLE_SET_BGCOLOR_FROM_PALETTE", this.elPanel_bgColorPallet]);
		this.elPanel_bgColorPallet.parentNode.style.display = "block";
	},

	$ON_TABLE_HIDE_BGCOLOR_PALLET : function(){
		this.welDropdownLayer.removeClass("p2");
		
		this.oApp.exec("HIDE_COLOR_PALETTE", []);
		this.elPanel_bgColorPallet.parentNode.style.display = "none";
	},

	$ON_TABLE_SET_BORDER_COLOR_FROM_PALETTE : function(sColorCode){
		this.oApp.exec("TABLE_SET_BORDER_COLOR", [sColorCode]);
		this.oApp.exec("TABLE_HIDE_BORDER_COLOR_PALLET", []);
	},

	$ON_TABLE_SET_BORDER_COLOR : function(sColorCode){
		this.elText_borderColor.value = sColorCode;
		this.elBtn_borderColor.style.backgroundColor = sColorCode;
	},

	$ON_TABLE_SET_BGCOLOR_FROM_PALETTE : function(sColorCode){
		this.oApp.exec("TABLE_SET_BGCOLOR", [sColorCode]);
		this.oApp.exec("TABLE_HIDE_BGCOLOR_PALLET", []);
	},
	
	$ON_TABLE_SET_BGCOLOR : function(sColorCode){
		this.elText_BGColor.value = sColorCode;
		this.elBtn_BGColor.style.backgroundColor = sColorCode;
	},

	$ON_TABLE_ENABLE_MANUAL_STYLE : function(){
		this.nStyleMode = 1;
		this._drawTableDropdownLayer();
	},
	
	$ON_TABLE_ENABLE_TEMPLATE_STYLE : function(){
		this.nStyleMode = 2;
		this._drawTableDropdownLayer();
	},
	
	$ON_EVENT_TABLE_CREATE_KEYDOWN : function(oEvent){
		if (oEvent.key().enter){
			this.elBtn_apply.focus();
			this.oApp.exec("TABLE_INSERT");
			oEvent.stop();
		}
	},
	
	_drawTableDropdownLayer : function(){
		if(this.nBorderStyleIdx == 1){
			this.elPanel_borderStylePreview.innerHTML = this.sNoBorderText;
			this.elLayer_Dim1.className = "se2_t_dim2";
		}else{
			this.elPanel_borderStylePreview.innerHTML = "";
			this.elLayer_Dim1.className = "se2_t_dim0";
		}
	
		if(this.nStyleMode == 1){
			this.elRadio_manualStyle.checked = true;
			this.elLayer_Dim2.className = "se2_t_dim3";
			
			this.elText_borderSize.disabled = false;
			this.elText_borderColor.disabled = false;
			this.elText_BGColor.disabled = false;
		}else{
			this.elRadio_templateStyle.checked = true;
			this.elLayer_Dim2.className = "se2_t_dim1";
			
			this.elText_borderSize.disabled = true;
			this.elText_borderColor.disabled = true;
			this.elText_BGColor.disabled = true;
		}
		this.oApp.exec("TABLE_CLOSE_ALL", []);
	},
	
	_selectBorderStyle : function(nStyleNum){
		this.elPanel_borderStylePreview.className = "se2_b_style"+nStyleNum;
		this.nBorderStyleIdx = nStyleNum;
		this._drawTableDropdownLayer();
	},
	
	_selectTableStyle : function(nStyleNum){
		this.elPanel_tableStylePreview.className = "se2_t_style"+nStyleNum;
		this.nTableStyleIdx = nStyleNum;
		this._drawTableDropdownLayer();
	},

	_showNewTable : function(){
		var oTmp = document.createElement("DIV");
		this._loadValuesFromHTML();
		
		oTmp.innerHTML = this._getPreviewTableString(this.nColumns, this.nRows);

		//this.nTableWidth = 0;
		//oTmp.innerHTML = this._getTableString();
		var oNewTable = oTmp.firstChild;
		this.elTable_preview.parentNode.insertBefore(oNewTable, this.elTable_preview);
		this.elTable_preview.parentNode.removeChild(this.elTable_preview);
		this.elTable_preview = oNewTable;

		this._refresh();
	},

	_getPreviewTableString : function(nColumns, nRows){
		var sTable = '<table border="0" cellspacing="1" class="se2_pre_table husky_se2m_table_preview">';
		var sRow = '<tr>';

		for(var i=0; i<nColumns; i++){
			sRow += "<td><p>&nbsp;</p></td>\n";
		}
		sRow += "</tr>\n";
		
		sTable += "<tbody>";
		for(var i=0; i<nRows; i++){
			sTable += sRow;
		}
		sTable += "</tbody>\n";

		sTable += "</table>\n";

		return sTable;
	},

	_loadValuesFromHTML : function(){
		this.nColumns = parseInt(this.elText_col.value, 10) || 1;
		this.nRows = parseInt(this.elText_row.value, 10) || 1;

		this.nBorderSize = parseInt(this.elText_borderSize.value, 10) || 1;
		this.sBorderColor = this.elText_borderColor.value;
		this.sBGColor = this.elText_BGColor.value;
	},
	
	_doGetTableString : function(nColumns, nRows, nBorderSize, sBorderColor, sBGColor, nBorderStyleIdx){
		var nTDWidth = parseInt(this.nTableWidth/nColumns, 10);
		var nBorderSize = this.nBorderSize;
		var sTableStyle = this.aTableStyleByBorder[nBorderStyleIdx].replace(/#BorderSize#/g, this.nBorderSize).replace(/#BorderSize\*([0-9]+)#/g, function(sAll, s1){return nBorderSize*parseInt(s1, 10);}).replace(/#BorderSize\+([0-9]+)#/g, function(sAll, s1){return nBorderSize+parseInt(s1, 10);}).replace("#BorderColor#", this.sBorderColor).replace("#BGColor#", this.sBGColor);
		var sTDStyle = this.aTDStyleByBorder[nBorderStyleIdx].replace(/#BorderSize#/g, this.nBorderSize).replace(/#BorderSize\*([0-9]+)#/g, function(sAll, s1){return nBorderSize*parseInt(s1, 10);}).replace(/#BorderSize\+([0-9]+)#/g, function(sAll, s1){return nBorderSize+parseInt(s1, 10);}).replace("#BorderColor#", this.sBorderColor).replace("#BGColor#", this.sBGColor);
		if(nTDWidth){
			sTDStyle += " width="+nTDWidth;
		}else{
			//sTableStyle += " width=100%";
			sTableStyle += "class=se2_pre_table";
		}

		// [SMARTEDITORSUS-365] Å×ÀÌºíÄü¿¡µðÅÍ > ¼Ó¼º Á÷Á¢ÀÔ·Â > Å×µÎ¸® ½ºÅ¸ÀÏ
		//		- Å×µÎ¸® ¾øÀ½À» ¼±ÅÃÇÏ´Â °æ¿ì º»¹®¿¡ »ðÀÔÇÏ´Â Ç¥¿¡ °¡ÀÌµå ¶óÀÎÀ» Ç¥½ÃÇØ ÁÝ´Ï´Ù. º¸±â ½Ã¿¡´Â Å×µÎ¸®°¡ º¸ÀÌÁö ¾Ê½À´Ï´Ù.
		//		- ±Û ÀúÀå ½Ã¿¡´Â ±Û ÀÛ¼º ½Ã¿¡ Àû¿ëÇÏ¿´´ø style À» Á¦°ÅÇÕ´Ï´Ù. ÀÌ¸¦ À§ÇØ¼­ ÀÓÀÇÀÇ ¼Ó¼º(attr_no_border_tbl)À» Ãß°¡ÇÏ¿´´Ù°¡ ÀúÀå ½ÃÁ¡¿¡¼­ Á¦°ÅÇØ ÁÖµµ·Ï ÇÕ´Ï´Ù.
		var sTempNoBorderClass = (nBorderStyleIdx == 1) ? 'attr_no_border_tbl="1"' : '';
		
		var sTable = "<table "+sTableStyle+" "+sTempNoBorderClass+">";
		var sRow = "<tr>";
		for(var i=0; i<nColumns; i++){
			sRow += "<td "+sTDStyle+"><p>&nbsp;</p></td>\n";
		}
		sRow += "</tr>\n";
		
		sTable += "<tbody>\n";
		for(var i=0; i<nRows; i++){
			sTable += sRow;
		}
		sTable += "</tbody>\n";

		sTable += "</table>\n<br>";
		
		return sTable;
	},
	
	_numRowKeydown : function(weEvent){
		var oKeyInfo = weEvent.key();

		// up
		if(oKeyInfo.keyCode == 38){
			this.oApp.exec("TABLE_INC_ROW", []);
		}

		// down
		if(oKeyInfo.keyCode == 40){
			this.oApp.exec("TABLE_DEC_ROW", []);
		}
	},

	_numColKeydown : function(weEvent){
		var oKeyInfo = weEvent.key();

		// up
		if(oKeyInfo.keyCode == 38){
			this.oApp.exec("TABLE_INC_COLUMN", []);
		}

		// down
		if(oKeyInfo.keyCode == 40){
			this.oApp.exec("TABLE_DEC_COLUMN", []);
		}
	},
	
	_borderSizeKeydown : function(weEvent){
		var oKeyInfo = weEvent.key();

		// up
		if(oKeyInfo.keyCode == 38){
			this.oApp.exec("TABLE_INC_BORDER_SIZE", []);
		}

		// down
		if(oKeyInfo.keyCode == 40){
			this.oApp.exec("TABLE_DEC_BORDER_SIZE", []);
		}
	},
	
	_refresh : function(){
		// the dropdown layer breaks without this line in IE 6 when modifying the preview table
		this.elDropdownLayer.style.zoom=0;
		this.elDropdownLayer.style.zoom="";
	}
	//@lazyload_js]
});
//}
nhn.husky.SE2M_TableEditor = jindo.$Class({
	name : "SE2M_TableEditor",
	
	_sSETblClass : "__se_tbl",
	_sSEReviewTblClass : "__se_tbl_review",

	STATUS : {
		S_0 : 1,				// neither cell selection nor cell resizing is active
		MOUSEDOWN_CELL : 2,		// mouse down on a table cell
		CELL_SELECTING : 3,		// cell selection is in progress
		CELL_SELECTED : 4,		// cell selection was (completely) made
		MOUSEOVER_BORDER : 5,	// mouse is over a table/cell border and the cell resizing grip is shown
		MOUSEDOWN_BORDER : 6	// mouse down on the cell resizing grip (cell resizing is in progress)
	},
	
	CELL_SELECTION_CLASS : "se2_te_selection",
	
	MIN_CELL_WIDTH : 5,
	MIN_CELL_HEIGHT : 5,
	
	TMP_BGC_ATTR : "_se2_tmp_te_bgc",
	TMP_BGIMG_ATTR : "_se2_tmp_te_bg_img",
	ATTR_TBL_TEMPLATE : "_se2_tbl_template",	
	
	nStatus : 1,
	nMouseEventsStatus : 0,
	
	aSelectedCells : [],

	$ON_REGISTER_CONVERTERS : function(){
		// remove the cell selection class
		this.oApp.exec("ADD_CONVERTER_DOM", ["WYSIWYG_TO_IR", jindo.$Fn(function(elTmpNode){
			if(this.aSelectedCells.length < 1){
				//return sContents;
				return;
			}

			var aCells;
			var aCellType = ["TD", "TH"];

			for(var n = 0; n < aCellType.length; n++){
				aCells = elTmpNode.getElementsByTagName(aCellType[n]);
				for(var i = 0, nLen = aCells.length; i < nLen; i++){
					if(aCells[i].className){
						aCells[i].className = aCells[i].className.replace(this.CELL_SELECTION_CLASS, "");
						if(aCells[i].getAttribute(this.TMP_BGC_ATTR)){
							aCells[i].style.backgroundColor = aCells[i].getAttribute(this.TMP_BGC_ATTR);
							aCells[i].removeAttribute(this.TMP_BGC_ATTR);
						}else if(aCells[i].getAttribute(this.TMP_BGIMG_ATTR)){
							jindo.$Element(this.aCells[i]).css("backgroundImage",aCells[i].getAttribute(this.TMP_BGIMG_ATTR));
							aCells[i].removeAttribute(this.TMP_BGIMG_ATTR);
						}
					}
				}
			}

//			this.wfnMouseDown.attach(this.elResizeCover, "mousedown");

//			return elTmpNode.innerHTML;
//			var rxSelectionColor = new RegExp("<(TH|TD)[^>]*)("+this.TMP_BGC_ATTR+"=[^> ]*)([^>]*>)", "gi");
		}, this).bind()]);
	},
	
	//@lazyload_js EVENT_EDITING_AREA_MOUSEMOVE:SE2M_TableTemplate.js[
	_assignHTMLObjects : function(){
		this.oApp.exec("LOAD_HTML", ["qe_table"]);

		this.elQELayer = jindo.$$.getSingle("DIV.q_table_wrap", this.oApp.htOptions.elAppContainer);
		this.elQELayer.style.zIndex = 150;
		this.elBtnAddRowBelow = jindo.$$.getSingle("BUTTON.se2_addrow", this.elQELayer);
		this.elBtnAddColumnRight = jindo.$$.getSingle("BUTTON.se2_addcol", this.elQELayer);
		this.elBtnSplitRow = jindo.$$.getSingle("BUTTON.se2_seprow", this.elQELayer);
		this.elBtnSplitColumn = jindo.$$.getSingle("BUTTON.se2_sepcol", this.elQELayer);
		this.elBtnDeleteRow = jindo.$$.getSingle("BUTTON.se2_delrow", this.elQELayer);
		this.elBtnDeleteColumn = jindo.$$.getSingle("BUTTON.se2_delcol", this.elQELayer);
		this.elBtnMergeCell = jindo.$$.getSingle("BUTTON.se2_merrow", this.elQELayer);
		this.elBtnBGPalette = jindo.$$.getSingle("BUTTON.husky_se2m_table_qe_bgcolor_btn", this.elQELayer);
		this.elBtnBGIMGPalette = jindo.$$.getSingle("BUTTON.husky_se2m_table_qe_bgimage_btn", this.elQELayer);

		this.elPanelBGPaletteHolder = jindo.$$.getSingle("DIV.husky_se2m_tbl_qe_bg_paletteHolder", this.elQELayer);
		this.elPanelBGIMGPaletteHolder = jindo.$$.getSingle("DIV.husky_se2m_tbl_qe_bg_img_paletteHolder", this.elQELayer);	
		
		this.elPanelTableBGArea = jindo.$$.getSingle("DIV.se2_qe2", this.elQELayer);
		this.elPanelTableTemplateArea = jindo.$$.getSingle("DL.se2_qe3", this.elQELayer);
		this.elPanelReviewBGArea = jindo.$$.getSingle("DL.husky_se2m_tbl_qe_review_bg", this.elQELayer);	
		
		this.elPanelBGImg = jindo.$$.getSingle("DD", this.elPanelReviewBGArea);
		
		this.welPanelTableBGArea = jindo.$Element(this.elPanelTableBGArea);
		this.welPanelTableTemplateArea = jindo.$Element(this.elPanelTableTemplateArea);
		this.welPanelReviewBGArea = jindo.$Element(this.elPanelReviewBGArea);
		
		//		this.elPanelReviewBtnArea = jindo.$$.getSingle("DIV.se2_btn_area", this.elQELayer); 	//My¸®ºä ¹öÆ° ·¹ÀÌ¾î
		this.elPanelDim1 = jindo.$$.getSingle("DIV.husky_se2m_tbl_qe_dim1", this.elQELayer);
		this.elPanelDim2 = jindo.$$.getSingle("DIV.husky_se2m_tbl_qe_dim2", this.elQELayer);
		this.elPanelDimDelCol = jindo.$$.getSingle("DIV.husky_se2m_tbl_qe_dim_del_col", this.elQELayer);
		this.elPanelDimDelRow = jindo.$$.getSingle("DIV.husky_se2m_tbl_qe_dim_del_row", this.elQELayer);
		
		this.elInputRadioBGColor = jindo.$$.getSingle("INPUT.husky_se2m_radio_bgc", this.elQELayer);		
		this.elInputRadioBGImg = jindo.$$.getSingle("INPUT.husky_se2m_radio_bgimg", this.elQELayer);		
		
		this.elSelectBoxTemplate = jindo.$$.getSingle("DIV.se2_select_ty2", this.elQELayer);
		this.elInputRadioTemplate = jindo.$$.getSingle("INPUT.husky_se2m_radio_template", this.elQELayer);
		this.elPanelQETemplate = jindo.$$.getSingle("DIV.se2_layer_t_style", this.elQELayer);
		this.elBtnQETemplate = jindo.$$.getSingle("BUTTON.husky_se2m_template_more", this.elQELayer);
		this.elPanelQETemplatePreview = jindo.$$.getSingle("SPAN.se2_t_style1", this.elQELayer);
		
		this.aElBtn_tableStyle = jindo.$$("BUTTON", this.elPanelQETemplate);
		for(i = 0; i < this.aElBtn_tableStyle.length; i++){
			this.oApp.registerBrowserEvent(this.aElBtn_tableStyle[i], "click", "TABLE_QE_SELECT_TEMPLATE");
		}
	},

	$LOCAL_BEFORE_FIRST : function(sMsg){
		if(!!sMsg.match(/(REGISTER_CONVERTERS)/)){
			this.oApp.acceptLocalBeforeFirstAgain(this, true);
			return true;
		}else{
			if(!sMsg.match(/(EVENT_EDITING_AREA_MOUSEMOVE)/)){
				this.oApp.acceptLocalBeforeFirstAgain(this, true);
				return false;
			}
		}
		this.htResizing = {};
		this.nDraggableCellEdge = 2;

		var elBody = jindo.$Element(document.body);
		this.nPageLeftRightMargin = parseInt(elBody.css("marginLeft"), 10) + parseInt(elBody.css("marginRight"), 10);
		this.nPageTopBottomMargin = parseInt(elBody.css("marginTop"), 10) + parseInt(elBody.css("marginBottom"), 10);
		
		//this.nPageLeftRightMargin = parseInt(elBody.css("marginLeft"), 10)+parseInt(elBody.css("marginRight"), 10) + parseInt(elBody.css("paddingLeft"), 10)+parseInt(elBody.css("paddingRight"), 10);
		//this.nPageTopBottomMargin = parseInt(elBody.css("marginTop"), 10)+parseInt(elBody.css("marginBottom"), 10) + parseInt(elBody.css("paddingTop"), 10)+parseInt(elBody.css("paddingBottom"), 10);
		
		this.QE_DIM_MERGE_BTN = 1;
		this.QE_DIM_BG_COLOR = 2;
		this.QE_DIM_REVIEW_BG_IMG = 3;
		this.QE_DIM_TABLE_TEMPLATE = 4;

		this.rxLastDigits = RegExp("([0-9]+)$");

		this._assignHTMLObjects();

		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [this.aElBtn_tableStyle]);

		this.addCSSClass(this.CELL_SELECTION_CLASS, "background-color:#B4C9E9;");

		this._createCellResizeGrip();

		this.elIFrame = this.oApp.getWYSIWYGWindow().frameElement;
		this.htFrameOffset = jindo.$Element(this.elIFrame).offset();

		var elTarget;

		this.sEmptyTDSrc = "";
		if(this.oApp.oNavigator.firefox){
			this.sEmptyTDSrc = "<p><br/></p>";
		}else{
			this.sEmptyTDSrc = "<p>&nbsp;</p>";
		}
		
		elTarget = this.oApp.getWYSIWYGDocument();
/*
		jindo.$Fn(this._mousedown_WYSIWYGDoc, this).attach(elTarget, "mousedown");
		jindo.$Fn(this._mousemove_WYSIWYGDoc, this).attach(elTarget, "mousemove");
		jindo.$Fn(this._mouseup_WYSIWYGDoc, this).attach(elTarget, "mouseup");
*/
		elTarget = this.elResizeCover;
		this.wfnMousedown_ResizeCover = jindo.$Fn(this._mousedown_ResizeCover, this);
		this.wfnMousemove_ResizeCover = jindo.$Fn(this._mousemove_ResizeCover, this);
		this.wfnMouseup_ResizeCover = jindo.$Fn(this._mouseup_ResizeCover, this);

		this.wfnMousedown_ResizeCover.attach(elTarget, "mousedown");

		this._changeTableEditorStatus(this.STATUS.S_0);

//		this.oApp.registerBrowserEvent(doc, "click", "EVENT_EDITING_AREA_CLICK");
		this.oApp.registerBrowserEvent(this.elBtnMergeCell, "click", "TE_MERGE_CELLS");
		
		this.oApp.registerBrowserEvent(this.elBtnSplitColumn, "click", "TE_SPLIT_COLUMN");
		this.oApp.registerBrowserEvent(this.elBtnSplitRow, "click", "TE_SPLIT_ROW");

//		this.oApp.registerBrowserEvent(this.elBtnAddColumnLeft, "click", "TE_INSERT_COLUMN_LEFT");
		this.oApp.registerBrowserEvent(this.elBtnAddColumnRight, "click", "TE_INSERT_COLUMN_RIGHT");

		this.oApp.registerBrowserEvent(this.elBtnAddRowBelow, "click", "TE_INSERT_ROW_BELOW");
//		this.oApp.registerBrowserEvent(this.elBtnAddRowAbove, "click", "TE_INSERT_ROW_ABOVE");

		this.oApp.registerBrowserEvent(this.elBtnDeleteColumn, "click", "TE_DELETE_COLUMN");
		this.oApp.registerBrowserEvent(this.elBtnDeleteRow, "click", "TE_DELETE_ROW");
		
		this.oApp.registerBrowserEvent(this.elInputRadioBGColor, "click", "DRAW_QE_RADIO_OPTION", [2]);
		this.oApp.registerBrowserEvent(this.elInputRadioBGImg, "click", "DRAW_QE_RADIO_OPTION", [3]);
		this.oApp.registerBrowserEvent(this.elInputRadioTemplate, "click", "DRAW_QE_RADIO_OPTION", [4]);
		this.oApp.registerBrowserEvent(this.elBtnBGPalette, "click", "TABLE_QE_TOGGLE_BGC_PALETTE");
//		this.oApp.registerBrowserEvent(this.elPanelReviewBtnArea, "click", "SAVE_QE_MY_REVIEW_ITEM"); //My¸®ºä ¹öÆ° ·¹ÀÌ¾î
		this.oApp.registerBrowserEvent(this.elBtnBGIMGPalette, "click", "TABLE_QE_TOGGLE_IMG_PALETTE");
		this.oApp.registerBrowserEvent(this.elPanelBGIMGPaletteHolder, "click", "TABLE_QE_SET_IMG_FROM_PALETTE");
		//this.elPanelQETemplate
		//this.elBtnQETemplate
		this.oApp.registerBrowserEvent(this.elBtnQETemplate, "click", "TABLE_QE_TOGGLE_TEMPLATE");

		this.oApp.registerBrowserEvent(document.body, "mouseup", "EVENT_OUTER_DOC_MOUSEUP");
		this.oApp.registerBrowserEvent(document.body, "mousemove", "EVENT_OUTER_DOC_MOUSEMOVE");
	},

	$ON_EVENT_EDITING_AREA_KEYUP : function(oEvent){
		// for undo/redo and other hotkey functions
		var oKeyInfo = oEvent.key();
		// 229: Korean/Eng, 33, 34: page up/down, 35,36: end/home, 37,38,39,40: left, up, right, down, 16: shift
		if(oKeyInfo.keyCode == 229 || oKeyInfo.alt || oKeyInfo.ctrl || oKeyInfo.keyCode == 16){
			return;
		}else if(oKeyInfo.keyCode == 8 || oKeyInfo.keyCode == 46){
			this.oApp.exec("DELETE_BLOCK_CONTENTS");
			oEvent.stop();
		}

		switch(this.nStatus){
			case this.STATUS.CELL_SELECTED:
				this._changeTableEditorStatus(this.STATUS.S_0);
				break;
		}
	},

	$ON_TABLE_QE_SELECT_TEMPLATE : function(weEvent){
		var aMatch = this.rxLastDigits.exec(weEvent.element.className);
		var elCurrentTable = this.elSelectionStartTable;

		this._changeTableEditorStatus(this.STATUS.S_0);
		this.oApp.exec("STYLE_TABLE", [elCurrentTable, aMatch[1]]);
		//this._selectTableStyle(aMatch[1]);

		var elSaveTarget = !!elCurrentTable && elCurrentTable.parentNode ? elCurrentTable.parentNode : null;
		var sSaveTarget = !elCurrentTable ? "BODY" : null; 
		
		this.oApp.exec("RECORD_UNDO_ACTION", ["CHANGE_TABLE_STYLE", {elSaveTarget:elSaveTarget, sSaveTarget : sSaveTarget, bDontSaveSelection:true}]); 
	},

	$BEFORE_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		if(sMode !== "WYSIWYG" && this.nStatus !== this.STATUS.S_0){
			this._changeTableEditorStatus(this.STATUS.S_0);
		}
	},
	
	// [Undo/Redo] Table Selection Ã³¸®¿Í °ü·ÃµÈ ºÎºÐ ÁÖ¼® Ã³¸®
	// $AFTER_DO_RECORD_UNDO_HISTORY : function(){
		// if(this.nStatus != this.STATUS.CELL_SELECTED){
			// return;
		// }
		// 		
		// if(this.aSelectedCells.length < 1){
			// return;
		// }
		// 
		// var aTables = this.oApp.getWYSIWYGDocument().getElementsByTagName("TABLE");
		// for(var nTableIdx = 0, nLen = aTables.length; nTableIdx < nLen; nTableIdx++){
			// if(aTables[nTableIdx] === this.elSelectionStartTable){
				// break;
			// }
		// }
		// 
		// var aUndoHistory = this.oApp.getUndoHistory();
		// var oUndoStateIdx = this.oApp.getUndoStateIdx();
		// if(!aUndoHistory[oUndoStateIdx.nIdx].htTableSelection){
			// aUndoHistory[oUndoStateIdx.nIdx].htTableSelection = [];
		// }
		// aUndoHistory[oUndoStateIdx.nIdx].htTableSelection[oUndoStateIdx.nStep] = {
			// nTableIdx : nTableIdx,
			// nSX : this.htSelectionSPos.x,
			// nSY : this.htSelectionSPos.y,
			// nEX : this.htSelectionEPos.x,
			// nEY : this.htSelectionEPos.y
		// };
	// },
	// 
	// $BEFORE_RESTORE_UNDO_HISTORY : function(){
		// if(this.nStatus == this.STATUS.CELL_SELECTED){
			// var oSelection = this.oApp.getEmptySelection();
			// oSelection.selectNode(this.elSelectionStartTable);
			// oSelection.collapseToEnd();
			// oSelection.select();
		// }
	// },
	// 
	// $AFTER_RESTORE_UNDO_HISTORY : function(){
		// var aUndoHistory = this.oApp.getUndoHistory();
		// var oUndoStateIdx = this.oApp.getUndoStateIdx();
		// 
		// if(aUndoHistory[oUndoStateIdx.nIdx].htTableSelection && aUndoHistory[oUndoStateIdx.nIdx].htTableSelection[oUndoStateIdx.nStep]){
			// var htTableSelection = aUndoHistory[oUndoStateIdx.nIdx].htTableSelection[oUndoStateIdx.nStep];
			// this.elSelectionStartTable = this.oApp.getWYSIWYGDocument().getElementsByTagName("TABLE")[htTableSelection.nTableIdx];
			// this.htMap = this._getCellMapping(this.elSelectionStartTable);
			// 			
			// this.htSelectionSPos.x = htTableSelection.nSX;
			// this.htSelectionSPos.y = htTableSelection.nSY;
			// this.htSelectionEPos.x = htTableSelection.nEX;
			// this.htSelectionEPos.y = htTableSelection.nEY;
			// this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
			// 			
			// this._startCellSelection();
			// this._changeTableEditorStatus(this.STATUS.CELL_SELECTED);
		// }else{
			// this._changeTableEditorStatus(this.STATUS.S_0);
		// }
	// },
	
	/**
	 * Å×ÀÌºí ¼¿ ¹è°æ»ö ¼ÂÆÃ
	 */
	$ON_TABLE_QE_TOGGLE_BGC_PALETTE : function(){
		if(this.elPanelBGPaletteHolder.parentNode.style.display == "block"){
			this.oApp.exec("HIDE_TABLE_QE_BGC_PALETTE", []);
		}else{
			this.oApp.exec("SHOW_TABLE_QE_BGC_PALETTE", []);
		}
	},

	$ON_SHOW_TABLE_QE_BGC_PALETTE : function(){
		this.elPanelBGPaletteHolder.parentNode.style.display = "block";
		this.oApp.exec("SHOW_COLOR_PALETTE", ["TABLE_QE_SET_BGC_FROM_PALETTE", this.elPanelBGPaletteHolder]);
	},
	
	$ON_HIDE_TABLE_QE_BGC_PALETTE : function(){
		this.elPanelBGPaletteHolder.parentNode.style.display = "none";
		this.oApp.exec("HIDE_COLOR_PALETTE", []);
	},
	
	$ON_TABLE_QE_SET_BGC_FROM_PALETTE : function(sColorCode){
		this.oApp.exec("TABLE_QE_SET_BGC", [sColorCode]);
		if(this.oSelection){
			this.oSelection.select();
		}
		this._changeTableEditorStatus(this.STATUS.S_0);
	},

	$ON_TABLE_QE_SET_BGC : function(sColorCode){
		this.elBtnBGPalette.style.backgroundColor = sColorCode;
		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			this.aSelectedCells[i].setAttribute(this.TMP_BGC_ATTR, sColorCode);
			this.aSelectedCells[i].removeAttribute(this.TMP_BGIMG_ATTR);
		}
		this.sQEAction = "TABLE_SET_BGCOLOR";
	},
	
	/**
	 * Å×ÀÌºí ¸®ºä Å×ÀÌºí ¹è°æ ÀÌ¹ÌÁö ¼ÂÆÃ 
	 */
	$ON_TABLE_QE_TOGGLE_IMG_PALETTE : function(){
		if(this.elPanelBGIMGPaletteHolder.parentNode.style.display == "block"){
			this.oApp.exec("HIDE_TABLE_QE_IMG_PALETTE", []);
		}else{
			this.oApp.exec("SHOW_TABLE_QE_IMG_PALETTE", []);
		}
	},
	
	$ON_SHOW_TABLE_QE_IMG_PALETTE : function(){
		this.elPanelBGIMGPaletteHolder.parentNode.style.display = "block";
	},
	
	$ON_HIDE_TABLE_QE_IMG_PALETTE : function(){
		this.elPanelBGIMGPaletteHolder.parentNode.style.display = "none";
	},
	
	$ON_TABLE_QE_SET_IMG_FROM_PALETTE : function(elEvt){
		this.oApp.exec("TABLE_QE_SET_IMG", [elEvt.element]);
		if(this.oSelection){
			this.oSelection.select();
		}
		this._changeTableEditorStatus(this.STATUS.S_0);
	},

	$ON_TABLE_QE_SET_IMG : function(elSelected){
		var sClassName = jindo.$Element(elSelected).className();
		var welBtnBGIMGPalette = jindo.$Element(this.elBtnBGIMGPalette);
		var aBtnClassNames = welBtnBGIMGPalette.className().split(" ");
		for(var i = 0, nLen = aBtnClassNames.length; i < nLen; i++){
			if(aBtnClassNames[i].indexOf("cellimg") > 0){
				welBtnBGIMGPalette.removeClass(aBtnClassNames[i]);
			}
		}
		jindo.$Element(this.elBtnBGIMGPalette).addClass(sClassName);
		
		var n = sClassName.substring(11, sClassName.length); //se2_cellimg11
		var sImageName = "pattern_";

		if(n === "0"){
			for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
				jindo.$Element(this.aSelectedCells[i]).css("backgroundImage", "");
				this.aSelectedCells[i].removeAttribute(this.TMP_BGC_ATTR);
				this.aSelectedCells[i].removeAttribute(this.TMP_BGIMG_ATTR);
			}
		}else{
			if(n == 19 || n == 20 || n == 21 || n == 22 || n == 25 || n == 26){ //ÆÄÀÏ »çÀÌÁî¶§¹®¿¡ jpg
				sImageName = sImageName + n + ".jpg";
			}else{
				sImageName = sImageName + n + ".gif";
			}
			
			for(var j = 0, nLen = this.aSelectedCells.length; j < nLen ; j++){
				jindo.$Element(this.aSelectedCells[j]).css("backgroundImage", "url("+"http://static.se2.naver.com/static/img/"+sImageName+")");
				this.aSelectedCells[j].removeAttribute(this.TMP_BGC_ATTR);
				this.aSelectedCells[j].setAttribute(this.TMP_BGIMG_ATTR, "url("+"http://static.se2.naver.com/static/img/"+sImageName+")");
			}
		} 
		this.sQEAction = "TABLE_SET_BGIMAGE";
	},
	
	$ON_SAVE_QE_MY_REVIEW_ITEM : function(){
		this.oApp.exec("SAVE_MY_REVIEW_ITEM");
		this.oApp.exec("CLOSE_QE_LAYER");
	},
	
	/**
	 * Å×ÀÌºí Äü ¿¡µðÅÍ Show 
	 */
	$ON_SHOW_COMMON_QE : function(){
		if(jindo.$Element(this.elSelectionStartTable).hasClass(this._sSETblClass)){
			this.oApp.exec("SHOW_TABLE_QE");
		}else{
			if(jindo.$Element(this.elSelectionStartTable).hasClass(this._sSEReviewTblClass)){
				this.oApp.exec("SHOW_REVIEW_QE");
			}
		}
	},
	
	$ON_SHOW_TABLE_QE : function(){
		this.oApp.exec("HIDE_TABLE_QE_BGC_PALETTE", []);
		this.oApp.exec("TABLE_QE_HIDE_TEMPLATE", []);
		this.oApp.exec("SETUP_TABLE_QE_MODE", [0]);
		this.oApp.exec("OPEN_QE_LAYER", [this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y], this.elQELayer, "table"]);
		//this.oApp.exec("FOCUS");
	},
	
	$ON_SHOW_REVIEW_QE : function(){
		this.oApp.exec("SETUP_TABLE_QE_MODE", [1]);
		this.oApp.exec("OPEN_QE_LAYER", [this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y], this.elQELayer, "review"]);
	},
	
	$ON_CLOSE_SUB_LAYER_QE : function(){
		if(typeof this.elPanelBGPaletteHolder != 'undefined'){
			this.elPanelBGPaletteHolder.parentNode.style.display = "none";
		}
		if(typeof this.elPanelBGIMGPaletteHolder != 'undefined'){
			this.elPanelBGIMGPaletteHolder.parentNode.style.display = "none";
		}
	},
	
	// 0: table
	// 1: review
	$ON_SETUP_TABLE_QE_MODE : function(nMode){
		var bEnableMerge = true;
		
		if(typeof nMode == "number"){
			this.nQEMode = nMode;
		}
		
		if(this.aSelectedCells.length < 2){
			bEnableMerge = false;
		}
		
		this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_MERGE_BTN, bEnableMerge]);

		//nullÀÎ°æ¿ì¸¦ ´ëºñÇØ¼­ default°ªÀ» ÁöÁ¤ÇØÁØ´Ù.
		var sBackgroundColor = this.aSelectedCells[0].getAttribute(this.TMP_BGC_ATTR) || "rgb(255,255,255)";

		var bAllMatched = true;
		for(var i = 1, nLen = this.aSelectedCells.length; i < nLen; i++){
			// [SMARTEDITORSUS-1552] µå·¡±×·Î ¼¿À» ¼±ÅÃÇÏ´Â Áß elCellÀÌ ¾ø´Â °æ¿ì ¿À·ù ¹ß»ý
			if(this.aSelectedCells[i]){
				if(sBackgroundColor != this.aSelectedCells[i].getAttribute(this.TMP_BGC_ATTR)){
					bAllMatched = false;
					break;
				}
			}
			// --[SMARTEDITORSUS-1552]
		}
		if(bAllMatched){
			this.elBtnBGPalette.style.backgroundColor = sBackgroundColor;
		}else{
			this.elBtnBGPalette.style.backgroundColor = "#FFFFFF";
		}
		
		var sBackgroundImage = this.aSelectedCells[0].getAttribute(this.TMP_BGIMG_ATTR) || "";
		var bAllMatchedImage = true;
		var sPatternInfo, nPatternImage = 0;
		var welBtnBGIMGPalette = jindo.$Element(this.elBtnBGIMGPalette);
		
		if(!!sBackgroundImage){
			var aPattern = sBackgroundImage.match(/\_[0-9]*/);
			sPatternInfo = (!!aPattern)?aPattern[0] : "_0";
			nPatternImage = sPatternInfo.substring(1, sPatternInfo.length);
			for(var i = 1, nLen = this.aSelectedCells.length; i < nLen; i++){
				if(sBackgroundImage != this.aSelectedCells[i].getAttribute(this.TMP_BGIMG_ATTR)){
					bAllMatchedImage = false;
					break;
				}
			}
		}
		
		var aBtnClassNames = welBtnBGIMGPalette.className().split(/\s/);
		for(var j = 0, nLen = aBtnClassNames.length; j < nLen; j++){
			if(aBtnClassNames[j].indexOf("cellimg") > 0){
				welBtnBGIMGPalette.removeClass(aBtnClassNames[j]);
			}
		}
		
		if(bAllMatchedImage && nPatternImage > 0){
			welBtnBGIMGPalette.addClass("se2_cellimg" + nPatternImage);
		}else{
			welBtnBGIMGPalette.addClass("se2_cellimg0");
		}
		
		if(this.nQEMode === 0){		//table
			this.elPanelTableTemplateArea.style.display = "block";
//			this.elSelectBoxTemplate.style.display = "block"; 
			this.elPanelReviewBGArea.style.display = "none";
			
//			this.elSelectBoxTemplate.style.position = "";
			
			//this.elPanelReviewBtnArea.style.display = "none"; //My¸®ºä ¹öÆ° ·¹ÀÌ¾î
			
			// ¹è°æArea¿¡¼­ css¸¦ Á¦°ÅÇØ¾ßÇÔ
			jindo.$Element(this.elPanelTableBGArea).className("se2_qe2");
			
			var nTpl = this.parseIntOr0(this.elSelectionStartTable.getAttribute(this.ATTR_TBL_TEMPLATE));
			if(nTpl){
				//this.elInputRadioTemplate.checked = "true";
			}else{
				this.elInputRadioBGColor.checked = "true";
				nTpl = 1;
			}
			
			this.elPanelQETemplatePreview.className = "se2_t_style" + nTpl;
			
			this.elPanelBGImg.style.position = "";
		}else if(this.nQEMode == 1){	//review
			this.elPanelTableTemplateArea.style.display = "none";
//			this.elSelectBoxTemplate.style.display = "none"; 
			this.elPanelReviewBGArea.style.display = "block";
			
//			this.elSelectBoxTemplate.style.position = "static";

			//	this.elPanelReviewBtnArea.style.display = "block"; //My¸®ºä ¹öÆ° ·¹ÀÌ¾î
			var nTpl = this.parseIntOr0(this.elSelectionStartTable.getAttribute(this.ATTR_REVIEW_TEMPLATE));
			
			this.elPanelBGImg.style.position = "relative";
		}else{
			this.elPanelTableTemplateArea.style.display = "none";
			this.elPanelReviewBGArea.style.display = "none";
		//	this.elPanelReviewBtnArea.style.display = "none";	//My¸®ºä ¹öÆ° ·¹ÀÌ¾î
		}
		
		this.oApp.exec("DRAW_QE_RADIO_OPTION", [0]);
	},

	// nClickedIdx
	// 0: none
	// 2: bg color
	// 3: bg img
	// 4: template
	$ON_DRAW_QE_RADIO_OPTION : function(nClickedIdx){
		if(nClickedIdx !== 0 && nClickedIdx != 2){
			this.oApp.exec("HIDE_TABLE_QE_BGC_PALETTE", []);
		}
		if(nClickedIdx !== 0 && nClickedIdx != 3){
			this.oApp.exec("HIDE_TABLE_QE_IMG_PALETTE", []);
		}
		if(nClickedIdx !== 0 && nClickedIdx != 4){
			this.oApp.exec("TABLE_QE_HIDE_TEMPLATE", []);
		}
		
		if(this.nQEMode === 0){
			// bg image option does not exist in table mode. so select the bgcolor option
			if(this.elInputRadioBGImg.checked){
				this.elInputRadioBGColor.checked = "true";
			}
			if(this.elInputRadioBGColor.checked){
				// one dimming layer is being shared so only need to dim once and the rest will be undimmed automatically
				//this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_BG_COLOR, true]);
				this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_TABLE_TEMPLATE, false]);
			}else{
				this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_BG_COLOR, false]);
				//this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_TABLE_TEMPLATE, true]);
			}
		}else{
			// template option does not exist in review mode. so select the bgcolor optio
			if(this.elInputRadioTemplate.checked){
				this.elInputRadioBGColor.checked = "true";
			}
			if(this.elInputRadioBGColor.checked){
				//this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_BG_COLOR, true]);
				this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_REVIEW_BG_IMG, false]);
			}else{
				this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_BG_COLOR, false]);
				//this.oApp.exec("TABLE_QE_DIM", [this.QE_DIM_REVIEW_BG_IMG, true]);
			}
		}
	},

	// nPart
	// 1: Merge cell btn
	// 2: Cell bg color
	// 3: Review - bg image
	// 4: Table - Template
	//
	// bUndim
	// true: Undim
	// false(default): Dim
	$ON_TABLE_QE_DIM : function(nPart, bUndim){
		var elPanelDim;
		var sDimClassPrefix = "se2_qdim";
		if(nPart == 1){
			elPanelDim = this.elPanelDim1;
		}else{
			elPanelDim = this.elPanelDim2;
		}
		
		if(bUndim){
			nPart = 0;
		}
		elPanelDim.className = sDimClassPrefix + nPart;
	},
	
	$ON_TE_SELECT_TABLE : function(elTable){
		this.elSelectionStartTable = elTable;
		this.htMap = this._getCellMapping(this.elSelectionStartTable);
	},
	
	$ON_TE_SELECT_CELLS : function(htSPos, htEPos){
		this._selectCells(htSPos, htEPos);
	},

	$ON_TE_MERGE_CELLS : function(){	
		if(this.aSelectedCells.length === 0 || this.aSelectedCells.length == 1){
			return;
		}
		this._removeClassFromSelection();

		var i, elFirstTD, elTD;

		elFirstTD = this.aSelectedCells[0];
		var elTable = nhn.husky.SE2M_Utils.findAncestorByTagName("TABLE", elFirstTD);
		
		var nHeight, nWidth;
		var elCurTD, elLastTD = this.aSelectedCells[0];
		nHeight = parseInt(elLastTD.style.height || elLastTD.getAttribute("height"), 10);
		nWidth = parseInt(elLastTD.style.width || elLastTD.getAttribute("width"), 10);
		//nHeight = elLastTD.offsetHeight;
		//nWidth = elLastTD.offsetWidth;
		
		for(i = this.htSelectionSPos.x + 1; i < this.htSelectionEPos.x + 1; i++){
			curTD = this.htMap[i][this.htSelectionSPos.y];
			if(curTD == elLastTD){
				continue;
			}
			elLastTD = curTD;
			nWidth += parseInt(curTD.style.width || curTD.getAttribute("width"), 10);
			//nWidth += curTD.offsetWidth;
		}
		
		elLastTD = this.aSelectedCells[0];
		for(i = this.htSelectionSPos.y + 1; i < this.htSelectionEPos.y + 1; i++){
			curTD = this.htMap[this.htSelectionSPos.x][i];
			if(curTD == elLastTD){
				continue;
			}
			elLastTD = curTD;
			nHeight += parseInt(curTD.style.height || curTD.getAttribute("height"), 10);
			//nHeight += curTD.offsetHeight;
		}
		
		if(nWidth){
			elFirstTD.style.width = nWidth + "px";
		}
		if(nHeight){
			elFirstTD.style.height = nHeight + "px";
		}
		
		elFirstTD.setAttribute("colSpan", this.htSelectionEPos.x - this.htSelectionSPos.x + 1);
		elFirstTD.setAttribute("rowSpan", this.htSelectionEPos.y - this.htSelectionSPos.y + 1);
		
		for(i = 1; i < this.aSelectedCells.length; i++){
			elTD = this.aSelectedCells[i];
			
			if(elTD.parentNode){
				if(!nhn.husky.SE2M_Utils.isBlankNode(elTD)){
					elFirstTD.innerHTML += elTD.innerHTML;
				}
				elTD.parentNode.removeChild(elTD);
			}
		}
//		this._updateSelection();
		
		this.htMap = this._getCellMapping(this.elSelectionStartTable);
		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);

		this._showTableTemplate(this.elSelectionStartTable);
		this._addClassToSelection();

		this.sQEAction = "TABLE_CELL_MERGE";

		this.oApp.exec("SHOW_COMMON_QE");
	},
	
	
	$ON_TABLE_QE_TOGGLE_TEMPLATE : function(){
		if(this.elPanelQETemplate.style.display == "block"){
			this.oApp.exec("TABLE_QE_HIDE_TEMPLATE");
		}else{
			this.oApp.exec("TABLE_QE_SHOW_TEMPLATE");
		}
	},
	
	$ON_TABLE_QE_SHOW_TEMPLATE : function(){
		this.elPanelQETemplate.style.display = "block";
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [this.elPanelQETemplate]);
	},
	
	$ON_TABLE_QE_HIDE_TEMPLATE : function(){
		this.elPanelQETemplate.style.display = "none";
	},
	
	$ON_STYLE_TABLE : function(elTable, nTableStyleIdx){
		if(!elTable){
			if(!this._t){
				this._t = 1;
			}
			elTable = this.elSelectionStartTable;
			nTableStyleIdx = (this._t++) % 20 + 1;
		}

		if(this.oSelection){
			this.oSelection.select();
		}
		this._applyTableTemplate(elTable, nTableStyleIdx);
	},
	
	$ON_TE_DELETE_COLUMN : function(){
		if(this.aSelectedCells.length === 0 || this.aSelectedCells.length == 1) {
			return;
		}
		
		this._selectAll_Column();
		this._deleteSelectedCells();
		this.sQEAction = "DELETE_TABLE_COLUMN";
		this._changeTableEditorStatus(this.STATUS.S_0);
	},
	
	$ON_TE_DELETE_ROW : function(){
		if(this.aSelectedCells.length === 0 || this.aSelectedCells.length == 1) {
			return;
		}
		
		this._selectAll_Row();
		this._deleteSelectedCells();
		this.sQEAction = "DELETE_TABLE_ROW";
		this._changeTableEditorStatus(this.STATUS.S_0);
	},

	$ON_TE_INSERT_COLUMN_RIGHT : function(){
		if(this.aSelectedCells.length === 0) {
			return;
		}
		
		this._selectAll_Column();
		this._insertColumnAfter(this.htSelectionEPos.x);
	},
	
	$ON_TE_INSERT_COLUMN_LEFT : function(){
		this._selectAll_Column();
		this._insertColumnAfter(this.htSelectionSPos.x - 1);
	},

	$ON_TE_INSERT_ROW_BELOW : function(){
		if(this.aSelectedCells.length === 0) {
			return;
		}
		
		this._insertRowBelow(this.htSelectionEPos.y);
	},
	
	$ON_TE_INSERT_ROW_ABOVE : function(){
		this._insertRowBelow(this.htSelectionSPos.y - 1);
	},

	$ON_TE_SPLIT_COLUMN : function(){
		var nSpan, nNewSpan, nWidth, nNewWidth;
		var elCurCell, elNewTD;
		
		if(this.aSelectedCells.length === 0) {
			return;
		}
		
		this._removeClassFromSelection();

		var elLastCell = this.aSelectedCells[0];
		// Assign colSpan>1 to all selected cells.
		// If current colSpan == 1 then increase the colSpan of the cell and all the vertically adjacent cells.
		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			elCurCell = this.aSelectedCells[i];
			nSpan = parseInt(elCurCell.getAttribute("colSpan"), 10) || 1;
			if(nSpan > 1){
				continue;
			}
			
			var htPos = this._getBasisCellPosition(elCurCell);
			for(var y = 0; y < this.htMap[0].length;){
				elCurCell = this.htMap[htPos.x][y];
				nSpan = parseInt(elCurCell.getAttribute("colSpan"), 10) || 1;
				elCurCell.setAttribute("colSpan", nSpan+1);
				y += parseInt(elCurCell.getAttribute("rowSpan"), 10) || 1;
			}
		}

		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			elCurCell = this.aSelectedCells[i];
			nSpan = parseInt(elCurCell.getAttribute("colSpan"), 10) || 1;
			nNewSpan = (nSpan/2).toFixed(0);
			
			elCurCell.setAttribute("colSpan", nNewSpan);
			
			elNewTD = this._shallowCloneTD(elCurCell);
			elNewTD.setAttribute("colSpan", nSpan-nNewSpan);
			elLastCell = elNewTD;

			nSpan = parseInt(elCurCell.getAttribute("rowSpan"), 10) || 1;
			elNewTD.setAttribute("rowSpan", nSpan);
			elNewTD.innerHTML = "&nbsp;";

			nWidth = elCurCell.width || elCurCell.style.width;
			if(nWidth){
				nWidth = this.parseIntOr0(nWidth);
				elCurCell.removeAttribute("width");
				nNewWidth = (nWidth/2).toFixed();
				elCurCell.style.width = nNewWidth + "px";
				elNewTD.style.width = (nWidth - nNewWidth) + "px";
			}

			elCurCell.parentNode.insertBefore(elNewTD, elCurCell.nextSibling);
		}

		this._reassignCellSizes(this.elSelectionStartTable);
		
		this.htMap = this._getCellMapping(this.elSelectionStartTable);

		var htPos = this._getBasisCellPosition(elLastCell);
		this.htSelectionEPos.x = htPos.x;

		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
		
		this.sQEAction = "SPLIT_TABLE_COLUMN";
		
		this.oApp.exec("SHOW_COMMON_QE");
	},
	
	$ON_TE_SPLIT_ROW : function(){
		var nSpan, nNewSpan, nHeight, nHeight;
		var elCurCell, elNewTD, htPos, elNewTR;
		
		if(this.aSelectedCells.length === 0) {
			return;
		}
		
		var aTR = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {oneTimeOffCache:true});
		this._removeClassFromSelection();
//top.document.title = this.htSelectionSPos.x+","+this.htSelectionSPos.y+"::"+this.htSelectionEPos.x+","+this.htSelectionEPos.y;

		var nNewRows = 0;
		// Assign rowSpan>1 to all selected cells.
		// If current rowSpan == 1 then increase the rowSpan of the cell and all the horizontally adjacent cells.
		var elNextTRInsertionPoint;
		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			elCurCell = this.aSelectedCells[i];
			nSpan = parseInt(elCurCell.getAttribute("rowSpan"), 10) || 1;
			if(nSpan > 1){
				continue;
			}
			
			htPos = this._getBasisCellPosition(elCurCell);
			elNextTRInsertionPoint = aTR[htPos.y];

			// a new TR has to be inserted when there's an increase in rowSpan
			elNewTR = this.oApp.getWYSIWYGDocument().createElement("TR");
			elNextTRInsertionPoint.parentNode.insertBefore(elNewTR, elNextTRInsertionPoint.nextSibling);
			nNewRows++;
			
			// loop through horizontally adjacent cells and increase their rowSpan
			for(var x = 0; x < this.htMap.length;){
				elCurCell = this.htMap[x][htPos.y];
				nSpan = parseInt(elCurCell.getAttribute("rowSpan"), 10) || 1;
				elCurCell.setAttribute("rowSpan", nSpan + 1);
				x += parseInt(elCurCell.getAttribute("colSpan"), 10) || 1;
			}
		}

		aTR = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {oneTimeOffCache:true});
		
		var htPos1, htPos2;
		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			elCurCell = this.aSelectedCells[i];
			nSpan = parseInt(elCurCell.getAttribute("rowSpan"), 10) || 1;
			nNewSpan = (nSpan/2).toFixed(0);
			
			elCurCell.setAttribute("rowSpan", nNewSpan);
			
			elNewTD = this._shallowCloneTD(elCurCell);
			elNewTD.setAttribute("rowSpan", nSpan - nNewSpan);

			nSpan = parseInt(elCurCell.getAttribute("colSpan"), 10) || 1;
			elNewTD.setAttribute("colSpan", nSpan);
			elNewTD.innerHTML = "&nbsp;";
			
			nHeight = elCurCell.height || elCurCell.style.height;
			if(nHeight){
				nHeight = this.parseIntOr0(nHeight);
				elCurCell.removeAttribute("height");
				nNewHeight = (nHeight/2).toFixed();
				elCurCell.style.height = nNewHeight + "px";
				elNewTD.style.height = (nHeight - nNewHeight) + "px";
			}

			//var elTRInsertTo = elCurCell.parentNode;
			//for(var ii=0; ii<nNewSpan; ii++) elTRInsertTo = elTRInsertTo.nextSibling;
			var nTRIdx = jindo.$A(aTR).indexOf(elCurCell.parentNode);
			var nNextTRIdx = parseInt(nTRIdx, 10)+parseInt(nNewSpan, 10);
			var elTRInsertTo = aTR[nNextTRIdx];

			var oSiblingTDs = elTRInsertTo.childNodes;
			var elInsertionPt = null;
			var tmp;
			htPos1 = this._getBasisCellPosition(elCurCell);
			for(var ii = 0, nNumTDs = oSiblingTDs.length; ii < nNumTDs; ii++){
				tmp = oSiblingTDs[ii];
				if(!tmp.tagName || tmp.tagName != "TD"){
					continue;
				}
				
				htPos2 = this._getBasisCellPosition(tmp);
				if(htPos1.x < htPos2.x){
					elInsertionPt = tmp;
					break;
				}
			}
			elTRInsertTo.insertBefore(elNewTD, elInsertionPt);
		}

		this._reassignCellSizes(this.elSelectionStartTable);
		
		this.htMap = this._getCellMapping(this.elSelectionStartTable);
		this.htSelectionEPos.y += nNewRows;

		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
		
		this.sQEAction = "SPLIT_TABLE_ROW";
		
		this.oApp.exec("SHOW_COMMON_QE");
	},
	
	$ON_MSG_CELL_SELECTED : function(){
		// disable row/col delete btn
		this.elPanelDimDelCol.className = "se2_qdim6r";
		this.elPanelDimDelRow.className = "se2_qdim6c";
	
		if(this.htSelectionSPos.x === 0 && this.htSelectionEPos.x === this.htMap.length - 1){
			this.oApp.exec("MSG_ROW_SELECTED");
		}
		
		if(this.htSelectionSPos.y === 0 && this.htSelectionEPos.y === this.htMap[0].length - 1){
			this.oApp.exec("MSG_COL_SELECTED");
		}

		this.oApp.exec("SHOW_COMMON_QE");
	},

	$ON_MSG_ROW_SELECTED : function(){
		this.elPanelDimDelRow.className = "";
	},
	
	$ON_MSG_COL_SELECTED : function(){
		this.elPanelDimDelCol.className = "";
	},

	$ON_EVENT_EDITING_AREA_MOUSEDOWN : function(wevE){
		if(!this.oApp.isWYSIWYGEnabled()){
			return;
		}

		switch(this.nStatus){
		case this.STATUS.S_0:
			// the user may just want to resize the image
			if(!wevE.element){return;}
			if(wevE.element.tagName == "IMG"){return;}
			if(this.oApp.getEditingMode() !== "WYSIWYG"){return;}
		
			// change the status to MOUSEDOWN_CELL if the mouse is over a table cell
			var elTD = nhn.husky.SE2M_Utils.findAncestorByTagName("TD", wevE.element);
			
			if(elTD && elTD.tagName == "TD"){
				var elTBL = nhn.husky.SE2M_Utils.findAncestorByTagName("TABLE", elTD);
				
				if(!jindo.$Element(elTBL).hasClass(this._sSETblClass) && !jindo.$Element(elTBL).hasClass(this._sSEReviewTblClass)){return;}
				if(!this._isValidTable(elTBL)){
					jindo.$Element(elTBL).removeClass(this._sSETblClass);
					jindo.$Element(elTBL).removeClass(this._sSEReviewTblClass);
					return;
				}
				
				if(elTBL){
					this.elSelectionStartTD = elTD;
					this.elSelectionStartTable = elTBL;
					this._changeTableEditorStatus(this.STATUS.MOUSEDOWN_CELL);
				}
			}
			break;
		case this.STATUS.MOUSEDOWN_CELL:
			break;
		case this.STATUS.CELL_SELECTING:
			break;
		case this.STATUS.CELL_SELECTED:
			this._changeTableEditorStatus(this.STATUS.S_0);
			break;
		}
	},

	$ON_EVENT_EDITING_AREA_MOUSEMOVE : function(wevE){
		if(this.oApp.getEditingMode() != "WYSIWYG"){return;}

		switch(this.nStatus){
			case this.STATUS.S_0:
				// 
				if(this._isOnBorder(wevE)){
					//this._changeTableEditorStatus(this.MOUSEOVER_BORDER);
					this._showCellResizeGrip(wevE);
				}else{
					this._hideResizer();
				}
				break;
			case this.STATUS.MOUSEDOWN_CELL:
				// change the status to CELL_SELECTING if the mouse moved out of the inital TD
				var elTD = nhn.husky.SE2M_Utils.findAncestorByTagName("TD", wevE.element);
				if((elTD && elTD !== this.elSelectionStartTD) || !elTD){
					if(!elTD){elTD = this.elSelectionStartTD;}
	
					this._reassignCellSizes(this.elSelectionStartTable);
					
					this._startCellSelection();
					this._selectBetweenCells(this.elSelectionStartTD, elTD);
				}
				break;
			case this.STATUS.CELL_SELECTING:
				// show selection
				var elTD = nhn.husky.SE2M_Utils.findAncestorByTagName("TD", wevE.element);
				if(!elTD || elTD === this.elLastSelectedTD){return;}
	
				var elTBL = nhn.husky.SE2M_Utils.findAncestorByTagName("TABLE", elTD);
				if(elTBL !== this.elSelectionStartTable){return;}
	
				this.elLastSelectedTD = elTD;
	
				this._selectBetweenCells(this.elSelectionStartTD, elTD);
	
				break;
			case this.STATUS.CELL_SELECTED:
				break;
		}
	},

	// ¼¿ ¼±ÅÃ »óÅÂ¿¡¼­ ¹®¼­¿µ¿ªÀ» »ó/ÇÏ·Î ¹þ¾î³¯ °æ¿ì, ¹þ¾î³­ ¹æÇâÀ¸·Î ¼±ÅÃ ¼¿À» ´Ã·Á°¡¸ç ¹®¼­ÀÇ ½ºÅ©·ÑÀ» ÇØÁÜ
	$ON_EVENT_OUTER_DOC_MOUSEMOVE : function(wevE){
		switch(this.nStatus){
			case this.STATUS.CELL_SELECTING:
				var htPos = wevE.pos();
				var nYPos = htPos.pageY;
				var nXPos = htPos.pageX;
				if(nYPos < this.htEditingAreaPos.top){
					var y = this.htSelectionSPos.y;
					if(y > 0){
						this.htSelectionSPos.y--;
						this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
	
						var oSelection = this.oApp.getSelection();
						oSelection.selectNodeContents(this.aSelectedCells[0]);
						oSelection.select();
						oSelection.oBrowserSelection.selectNone();
					}
				}else{
					if(nYPos > this.htEditingAreaPos.bottom){
						var y = this.htSelectionEPos.y;
						if(y < this.htMap[0].length - 1){
							this.htSelectionEPos.y++;
							this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
	
							var oSelection = this.oApp.getSelection();
							oSelection.selectNodeContents(this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y]);
							oSelection.select();
							oSelection.oBrowserSelection.selectNone();
						}
					}
				}
	
				if(nXPos < this.htEditingAreaPos.left){
					var x = this.htSelectionSPos.x;
					if(x > 0){
						this.htSelectionSPos.x--;
						this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
	
						var oSelection = this.oApp.getSelection();
						oSelection.selectNodeContents(this.aSelectedCells[0]);
						oSelection.select();
						oSelection.oBrowserSelection.selectNone();
					}
				}else{
					if(nXPos > this.htEditingAreaPos.right){
						var x = this.htSelectionEPos.x;
						if(x < this.htMap.length - 1){
							this.htSelectionEPos.x++;
							this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
	
							var oSelection = this.oApp.getSelection();
							oSelection.selectNodeContents(this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y]);
							oSelection.select();
							oSelection.oBrowserSelection.selectNone();
						}
					}
				}
				break;
		}
	},
	
	$ON_EVENT_OUTER_DOC_MOUSEUP : function(wevE){
		this._eventEditingAreaMouseup(wevE);
	},
	
	$ON_EVENT_EDITING_AREA_MOUSEUP : function(wevE){
		this._eventEditingAreaMouseup(wevE);
	},
	
	_eventEditingAreaMouseup : function(wevE){
		if(this.oApp.getEditingMode() != "WYSIWYG"){return;}

		switch(this.nStatus){
			case this.STATUS.S_0:
				break;
			case this.STATUS.MOUSEDOWN_CELL:
				this._changeTableEditorStatus(this.STATUS.S_0);
				break;
			case this.STATUS.CELL_SELECTING:
				this._changeTableEditorStatus(this.STATUS.CELL_SELECTED);
				break;
			case this.STATUS.CELL_SELECTED:
				break;
			}
	},

	/**
	 * TableÀÇ blockÀ¸·Î ÀâÈù ¿µ¿ªÀ» ³Ñ°ÜÁØ´Ù.
	 * @see hp_SE2M_TableBlockStyler.js
	 */
	$ON_GET_SELECTED_CELLS : function(sAttr,oReturn){
		if(!!this.aSelectedCells){
			oReturn[sAttr] = this.aSelectedCells;
		}
	},

	_coverResizeLayer : function(){
		// [SMARTEDITORSUS-1504] ¿¡µðÅÍ ÀüÃ¼ Å©±âº¸´Ù Ã¢ÀÌ ÀÛ¾ÆÁ³À» ¶§ elResizeGrid°¡ ÃÖ´ëÈ­µÈ elResizeCoverÀ¸·ÎºÎÅÍ ¹þ¾î³ª´Â ÀÌ½´°¡ ÀÖÀ½
		//this.elResizeCover.style.position = "absolute";
		this.elResizeCover.style.position = "fixed";
		// --[SMARTEDITORSUS-1504]
		
		var size = jindo.$Document().clientSize();
		this.elResizeCover.style.width = size.width - this.nPageLeftRightMargin + "px";
		this.elResizeCover.style.height = size.height - this.nPageTopBottomMargin + "px";
		//this.elResizeCover.style.width = size.width + "px";
		//this.elResizeCover.style.height = size.height + "px";
		//document.body.insertBefore(this.elResizeCover, document.body.firstChild);
		document.body.appendChild(this.elResizeCover);
	},
	
	_uncoverResizeLayer : function(){
		this.elResizeGrid.appendChild(this.elResizeCover);
		this.elResizeCover.style.position = "";
		this.elResizeCover.style.width = "100%";
		this.elResizeCover.style.height = "100%";
	},
	
	_reassignCellSizes : function(elTable){
		var allCells = new Array(2);
		allCells[0] = jindo.$$(">TBODY>TR>TD", elTable, {oneTimeOffCache:true});
		allCells[1] = jindo.$$(">TBODY>TR>TH", elTable, {oneTimeOffCache:true});
		
		var aAllCellsWithSizeInfo = new Array(allCells[0].length + allCells[1].length);
		var numCells = 0;
		
		var nTblBorderPadding = this.parseIntOr0(elTable.border);
		var nTblCellPadding = this.parseIntOr0(elTable.cellPadding);

		// remember all the dimensions first and then assign later.
		// this is done this way because if the table/cell size were set in %, setting one cell size would change size of other cells, which are still yet in %.
		// 1 for TD and 1 for TH
		for(var n = 0; n < 2; n++){
			for(var i = 0; i < allCells[n].length; i++){
				var elCell = allCells[n][i];
				var welCell = jindo.$Element(elCell);
				
				var htBrowser = jindo.$Agent().navigator();
				
				// [SMARTEDITORSUS-1427][SMARTEDITORSUS-1431][SMARTEDITORSUS-1491][SMARTEDITORSUS-1504] IE9, 10¿¡¼­ Jindo.$Element#css °¡ ºó ¼Ó¼º°ªÀ» 1px·Î °¡Á®¿À´Â ¹®Á¦Á¡ÀÌ ÀÖ¾î ´ëÃ¼
				/*var nPaddingLeft = this.parseIntOr0(welCell.css("paddingLeft"));
				var nPaddingRight = this.parseIntOr0(welCell.css("paddingRight"));
				var nPaddingTop = this.parseIntOr0(welCell.css("paddingTop"));
				var nPaddingBottom = this.parseIntOr0(welCell.css("paddingBottom"));
				var nBorderLeft = this.parseBorder(welCell.css("borderLeftWidth"), welCell.css("borderLeftStyle"));
				var nBorderRight = this.parseBorder(welCell.css("borderRightWidth"), welCell.css("borderRightStyle"));
				var nBorderTop = this.parseBorder(welCell.css("borderTopWidth"), welCell.css("borderTopStyle"));
				var nBorderBottom = this.parseBorder(welCell.css("borderBottomWidth"), welCell.css("borderBottomStyle"));*/
				var nPaddingLeft, nPaddingRight, nPaddingTop, nPaddingBottom;
				var nBorderLeft, nBorderRight, nBorderTop, nBorderBottom;
				// --[SMARTEDITORSUS-1427][SMARTEDITORSUS-1431][SMARTEDITORSUS-1491][SMARTEDITORSUS-1504]
				
				var nOffsetWidth, nOffsetHeight;
				
				// [SMARTEDITORSUS-1571] IE 10 ÀÌ»óÀÓ¿¡µµ ºÒ±¸ÇÏ°í, ¹®¼­ ¸ðµå°¡ 8 ÀÌÇÏ·Î ¼³Á¤µÇ¾î ÀÖ´Â °æ¿ì°¡ ÀÖ¾î ¸Þ¼­µå ±â¹Ý ºÐ±â·Î º¯°æ
				if(elCell.getComputedStyle){
				// --[SMARTEDITORSUS-1571]
					// getComputedStyle()·Î inheritµÈ ½ºÅ¸ÀÏÀ» È¹µæ. IE 8 ÀÌÇÏ¿¡¼­´Â Áö¿øµÇÁö ¾Ê´Â´Ù.  
					nPaddingLeft = parseFloat(getComputedStyle(elCell).paddingLeft, 10);
					nPaddingRight = parseFloat(getComputedStyle(elCell).paddingRight, 10);
					nPaddingTop = parseFloat(getComputedStyle(elCell).paddingTop, 10);
					nPaddingBottom = parseFloat(getComputedStyle(elCell).paddingBottom, 10);
					
					// ÃÖÃÊ ¸®»çÀÌÂ¡ Á÷Àü width attribute¿¡¼­ styleÀÇ width·Î ÀÌÇàÇÏ´Â °úÁ¤¿¡¼­ ¹Ì¼¼º¸Á¤ÀÌ ÀÖ±â ¶§¹®¿¡ Å©±â°¡ Á¶±Ý º¯ÇÑ´Ù.
					nBorderLeft = parseFloat(getComputedStyle(elCell).borderLeftWidth, 10);
					nBorderRight = parseFloat(getComputedStyle(elCell).borderRightWidth, 10);
					nBorderTop = parseFloat(getComputedStyle(elCell).borderTopWidth, 10);
					nBorderBottom = parseFloat(getComputedStyle(elCell).borderBottomWidth, 10);
				}else{ // ÀÌ ¹æ½ÄÀº inheritµÈ ½ºÅ¸ÀÏÀ» °¡Á®¿ÀÁö ¸øÇÏ´Â ¹®Á¦¿Í ÇÔ²², ÀÏºÎ ºê¶ó¿ìÀúÀÇ ¼Ò¼öÁ¡ °ªÀ» ¹ö¸²ÇÏ´Â ¹®Á¦°¡ ÀÖ´Ù.
					// [SMARTEDITORSUS-1427][SMARTEDITORSUS-1431][SMARTEDITORSUS-1491]
					nPaddingLeft = this.parseIntOr0(elCell.style.paddingLeft);
					nPaddingRight = this.parseIntOr0(elCell.style.paddingRight);
					nPaddingTop = this.parseIntOr0(elCell.style.paddingTop);
					nPaddingBottom = this.parseIntOr0(elCell.style.paddingBottom);
					// --[SMARTEDITORSUS-1427][SMARTEDITORSUS-1431][SMARTEDITORSUS-1491]
					
					// ±âÁ¸ ·ÎÁ÷À» »ç¿ë. IEÀÇ °æ¿ì bug·Î ºÐ·ùÇÏ¿© 1px¸¦ È¹µæÇÏµµ·Ï ¼³Á¤µÇ¾î ÀÖ´Ù.
					nBorderLeft = this.parseBorder(welCell.css("borderLeftWidth"), welCell.css("borderLeftStyle"));
					nBorderRight = this.parseBorder(welCell.css("borderRightWidth"), welCell.css("borderRightStyle"));
					nBorderTop = this.parseBorder(welCell.css("borderTopWidth"), welCell.css("borderTopStyle"));
					nBorderBottom = this.parseBorder(welCell.css("borderBottomWidth"), welCell.css("borderBottomStyle"));
				}
				
				/**
				 * ¸Å¹ø ¹ß»ýÇÏ´Â ¸®»çÀÌÂ¡ ¿ÀÂ÷¸¦ ÃÖ¼ÒÇÏ±â À§ÇÏ¿©, 2È¸Â÷ºÎÅÍ´Â 1È¸Â÷¿¡ Àû¿ëµÇ´Â style °ªÀ» °¡Á®¿Â´Ù.
				 * 
				 * width¿Í height attribute´Â ÃÖÃÊ 1È¸¿¡ Á¦°ÅµÈ´Ù. 
				 * Áï 2È¸Â÷ºÎÅÍ´Â, µ¿ÀûÀ¸·Î º¯ÇÏ´Â styleÀÇ width, height °ªÀ» ±×´ë·Î »ç¿ëÇÑ´Ù.
				 * */
				/*nOffsetWidth = elCell.offsetWidth - (nPaddingLeft + nPaddingRight + nBorderLeft + nBorderRight) + "px";
				nOffsetHeight = elCell.offsetHeight - (nPaddingTop + nPaddingBottom + nBorderTop + nBorderBottom) + "px";*/
				var nWidth = jindo.$Element(elCell).attr("width");
				var nHeight = jindo.$Element(elCell).attr("height");
				if(!nWidth && !nHeight){
					nOffsetWidth = elCell.style.width;
					nOffsetHeight = elCell.style.height;
				}else{
					nOffsetWidth = elCell.offsetWidth - (nPaddingLeft + nPaddingRight + nBorderLeft + nBorderRight) + "px";
					nOffsetHeight = elCell.offsetHeight - (nPaddingTop + nPaddingBottom + nBorderTop + nBorderBottom) + "px";
				}
				
				/*if(htBrowser.ie && (htBrowser.nativeVersion >= 9 && htBrowser.nativeVersion <= 10)){
					// IE9, IE10
					// [SMARTEDITORSUS-1427][SMARTEDITORSUS-1431][SMARTEDITORSUS-1491] IE9, 10¿¡¼­ Jindo.$Element#css °ü·Ã ¹®Á¦¿¡ ´ëÀÀÇÏ¸é ´Ù¸¥ ºê¶ó¿ìÀú¿Í µ¿ÀÏÇÑ ¼ö½Ä Àû¿ë °¡´É
					//nOffsetWidth = elCell.offsetWidth + "px";
					//nOffsetHeight = elCell.offsetHeight - (nPaddingTop + nPaddingBottom + nBorderTop + nBorderBottom) + "px";
					nOffsetWidth = elCell.offsetWidth - (nPaddingLeft + nPaddingRight + nBorderLeft + nBorderRight) + "px";
					nOffsetHeight = elCell.offsetHeight - (nPaddingTop + nPaddingBottom + nBorderTop + nBorderBottom) + "px";
					// --[SMARTEDITORSUS-1427][SMARTEDITORSUS-1431][SMARTEDITORSUS-1491]
				}else{
					// Firefox, Chrome, IE7, IE8
					nOffsetWidth = elCell.offsetWidth - (nPaddingLeft + nPaddingRight + nBorderLeft + nBorderRight) + "px";
					nOffsetHeight = elCell.offsetHeight - (nPaddingTop + nPaddingBottom + nBorderTop + nBorderBottom) + "px";
				}*/
				// --[SMARTEDITORSUS-1504]
				
				aAllCellsWithSizeInfo[numCells++] = [elCell, nOffsetWidth, nOffsetHeight];
			}
		}
		for(var i = 0; i < numCells; i++){
			var aCellInfo = aAllCellsWithSizeInfo[i];

			aCellInfo[0].removeAttribute("width");
			aCellInfo[0].removeAttribute("height");

			aCellInfo[0].style.width = aCellInfo[1];
			aCellInfo[0].style.height = aCellInfo[2];
			
//			jindo.$Element(aCellInfo[0]).css("width", aCellInfo[1]);
//			jindo.$Element(aCellInfo[0]).css("height", aCellInfo[2]);
		}

		elTable.removeAttribute("width");
		elTable.removeAttribute("height");
		elTable.style.width = "";
		elTable.style.height = "";
	},
	
	_mousedown_ResizeCover : function(oEvent){
		this.bResizing = true;
		this.nStartHeight = oEvent.pos().clientY;
		
		// [SMARTEDITORSUS-1504] Ç¥ Å×µÎ¸®¸¦ ´©¸¦ ¶§¸¶´Ù ±Û¾ç½ÄÀÌ 2px¾¿ ¼¼·Î·Î ±æ¾îÁö´Â ¹®Á¦°¡ ÀÖ´Âµ¥, ÀÌ¸¦ À§ÇÑ flag
		this.bResizingCover = true;
		// --[SMARTEDITORSUS-1504]
		
		this.wfnMousemove_ResizeCover.attach(this.elResizeCover, "mousemove");
		this.wfnMouseup_ResizeCover.attach(document, "mouseup");

		this._coverResizeLayer();
		this.elResizeGrid.style.border = "1px dotted black";

		this.nStartHeight = oEvent.pos().clientY;
		this.nStartWidth = oEvent.pos().clientX;
		
		// [SMARTEDITORSUS-1504] Ç¥ ¸®»çÀÌÁî¿ë gripperÀÇ ¹èÄ¡¸¦ WYSIWYG ÆíÁý ¿µ¿ª À§Ä¡ ±â¹ÝÀ¸·Î °³¼± 
		this.nClientXDiff = this.nStartWidth - this.htResizing.htEPos.clientX;
		this.nClientYDiff = this.nStartHeight - this.htResizing.htEPos.clientY; 
		// --[SMARTEDITORSUS-1504]
		
		this._reassignCellSizes(this.htResizing.elTable);
		
		this.htMap = this._getCellMapping(this.htResizing.elTable);
		var htPosition = this._getBasisCellPosition(this.htResizing.elCell);

		var nOffsetX = (parseInt(this.htResizing.elCell.getAttribute("colspan")) || 1) - 1;
		var nOffsetY = (parseInt(this.htResizing.elCell.getAttribute("rowspan")) || 1) - 1;
		var x = htPosition.x + nOffsetX + this.htResizing.nHA;
		var y = htPosition.y + nOffsetY + this.htResizing.nVA;

		if(x < 0 || y < 0){return;}

		this.htAllAffectedCells = this._getAllAffectedCells(x, y, this.htResizing.nResizeMode, this.htResizing.elTable);
	},

	_mousemove_ResizeCover : function(oEvent){
		// [SMARTEDITORSUS-1504] Ç¥ ¸ð¼­¸® Drag »ç¿ë¼º °³¼±
		// - ÃÖÃÊ ¸®»çÀÌÂ¡ ÈÄ ÇØ´ç À§Ä¡¿¡¼­ ¹Ù·Î ¸¶¿ì½º¸¦ ´­·¯ Drag °¡´É
		if(jindo.$Agent().navigator().chrome || jindo.$Agent().navigator().safari){
			if(this.htResizing.nPreviousResizeMode != undefined && this.htResizing.nPreviousResizeMode != 0){
				if(this.htResizing.nResizeMode != this.htResizing.nPreviousResizeMode){
					this.htResizing.nResizeMode = this.htResizing.nPreviousResizeMode;
					this._showResizer();
				}
			}
		}
		// --[SMARTEDITORSUS-1504]
		
		var nHeightChange = oEvent.pos().clientY - this.nStartHeight;
		var nWidthChange = oEvent.pos().clientX - this.nStartWidth;

		var oEventPos = oEvent.pos();

		// [SMARTEDITORSUS-1504] Ç¥ ¸®»çÀÌÁî¿ë gripperÀÇ ¹èÄ¡¸¦ WYSIWYG ÆíÁý ¿µ¿ª À§Ä¡ ±â¹ÝÀ¸·Î °³¼±
		/*if(this.htResizing.nResizeMode == 1){
			this.elResizeGrid.style.left = oEventPos.pageX - this.parseIntOr0(this.elResizeGrid.style.width)/2 + "px";
		}else{
			this.elResizeGrid.style.top = oEventPos.pageY - this.parseIntOr0(this.elResizeGrid.style.height)/2 + "px";
		}*/
		if(this.htResizing.nResizeMode == 1){
			this.elResizeGrid.style.left = oEvent.pos().clientX - this.nClientXDiff - this.parseIntOr0(this.elResizeGrid.style.width)/2 + "px";
		}else{
			this.elResizeGrid.style.top = oEvent.pos().clientY - this.nClientYDiff - this.parseIntOr0(this.elResizeGrid.style.height)/2 + "px";
		}
		// --[SMARTEDITORSUS-1504]
	},

	_mouseup_ResizeCover : function(oEvent){
		this.bResizing = false;
		this._hideResizer();
		this._uncoverResizeLayer();
		this.elResizeGrid.style.border = "";

		this.wfnMousemove_ResizeCover.detach(this.elResizeCover, "mousemove");
		this.wfnMouseup_ResizeCover.detach(document, "mouseup");

		var nHeightChange = 0;
		var nWidthChange = 0;

		if(this.htResizing.nResizeMode == 2){
			nHeightChange = oEvent.pos().clientY - this.nStartHeight;
		}
		if(this.htResizing.nResizeMode == 1){
			nWidthChange = oEvent.pos().clientX - this.nStartWidth;
			
			if(this.htAllAffectedCells.nMinBefore != -1 && nWidthChange < -1*this.htAllAffectedCells.nMinBefore){
				nWidthChange = -1 * this.htAllAffectedCells.nMinBefore + this.MIN_CELL_WIDTH;
			}
			if(this.htAllAffectedCells.nMinAfter != -1 && nWidthChange > this.htAllAffectedCells.nMinAfter){
				nWidthChange = this.htAllAffectedCells.nMinAfter - this.MIN_CELL_WIDTH;
			}
		}
		
		// [SMARTEDITORSUS-1504] FireFox´Â ¼Ò¼öÁ¡À¸·Î size°¡ ³ª¿À´Âµ¥, parseInt´Â ¼Ò¼öÁ¡ ÀÌÇÏ¸¦ ¹ö¸²
		var htBrowser = jindo.$Agent().navigator();
		var isIEUnder9 = false;
		
		if(htBrowser.ie){
			if(htBrowser.nativeVersion <= 8){
				// IE7, IE8
				isIEUnder9 = true;
			}
		}
		
		var aCellsBefore = this.htAllAffectedCells.aCellsBefore;
		for(var i = 0; i < aCellsBefore.length; i++){
			var elCell = aCellsBefore[i];
			
			var width, height;
			if(!isIEUnder9){
				width = parseFloat(elCell.style.width, 10) + nWidthChange;
				height = parseFloat(elCell.style.height, 10) + nHeightChange;
			}else{
				width = this.parseIntOr0(elCell.style.width) + nWidthChange;
				height = this.parseIntOr0(elCell.style.height) + nHeightChange;
			}
			
			//var width = this.parseIntOr0(elCell.style.width) + nWidthChange;
			elCell.style.width = Math.max(width, this.MIN_CELL_WIDTH) + "px";
			
			//var height = this.parseIntOr0(elCell.style.height) + nHeightChange;
			elCell.style.height = Math.max(height, this.MIN_CELL_HEIGHT) + "px";
		}
			
		var aCellsAfter = this.htAllAffectedCells.aCellsAfter;
		for(var i = 0; i < aCellsAfter.length; i++){
			var elCell = aCellsAfter[i];

			var width, height;
			if(!isIEUnder9){
				width = parseFloat(elCell.style.width, 10) - nWidthChange;
				height = parseFloat(elCell.style.height, 10) - nHeightChange;
			}else{
				width = this.parseIntOr0(elCell.style.width) - nWidthChange;
				height = this.parseIntOr0(elCell.style.height) - nHeightChange;
			}
			
			//var width = this.parseIntOr0(elCell.style.width) - nWidthChange;
			elCell.style.width = Math.max(width, this.MIN_CELL_WIDTH) + "px";
			
			//var height = this.parseIntOr0(elCell.style.height) - nHeightChange;
			elCell.style.height = Math.max(height, this.MIN_CELL_HEIGHT) + "px";
		}
		// --[SMARTEDITORSUS-1504]
		
		// [SMARTEDITORSUS-1504] Ç¥ Å×µÎ¸®¸¦ ´©¸¦ ¶§¸¶´Ù ±Û¾ç½ÄÀÌ 2px¾¿ ¼¼·Î·Î ±æ¾îÁö´Â ¹®Á¦°¡ ÀÖ´Âµ¥, ÀÌ¸¦ À§ÇÑ flag
		this.bResizingCover = false;
		// --[SMARTEDITORSUS-1504]
	},

	$ON_CLOSE_QE_LAYER : function(){
		this._changeTableEditorStatus(this.STATUS.S_0);
	},
	
	_changeTableEditorStatus : function(nNewStatus){
		if(this.nStatus == nNewStatus){return;}
		this.nStatus = nNewStatus;

		switch(nNewStatus){
			case this.STATUS.S_0:
				if(this.nStatus == this.STATUS.MOUSEDOWN_CELL){
					break;
				}
	
				this._deselectCells();
				
				// È÷½ºÅä¸® ÀúÀå (¼±ÅÃ À§Ä¡´Â ÀúÀåÇÏÁö ¾ÊÀ½)
				if(!!this.sQEAction){
					this.oApp.exec("RECORD_UNDO_ACTION", [this.sQEAction, {elSaveTarget:this.elSelectionStartTable, bDontSaveSelection:true}]); 
					this.sQEAction = "";
				}
				
				if(this.oApp.oNavigator["safari"] || this.oApp.oNavigator["chrome"]){
					this.oApp.getWYSIWYGDocument().onselectstart = null;
				}
	
				this.oApp.exec("ENABLE_WYSIWYG", []);
				this.oApp.exec("CLOSE_QE_LAYER");
				
				this.elSelectionStartTable = null;
				break;
			case this.STATUS.CELL_SELECTING:
				if(this.oApp.oNavigator.ie){
					document.body.setCapture(false);
				}
				break;
			case this.STATUS.CELL_SELECTED:
				this.oApp.delayedExec("MSG_CELL_SELECTED", [], 0);
				if(this.oApp.oNavigator.ie){
					document.body.releaseCapture();
				}
				break;
		}

		this.oApp.exec("TABLE_EDITOR_STATUS_CHANGED", [this.nStatus]);
	},
	
	_isOnBorder : function(wevE){
		// ===========================[Start: Set/init global resizing info]===========================
		// 0: not resizing
		// 1: horizontal resizing
		// 2: vertical resizing
		this.htResizing.nResizeMode = 0;
		this.htResizing.elCell = wevE.element;
		if(wevE.element.tagName != "TD" && wevE.element.tagName != "TH"){return false;}

		this.htResizing.elTable = nhn.husky.SE2M_Utils.findAncestorByTagName("TABLE", this.htResizing.elCell);
		if(!this.htResizing.elTable){return;}

		if(!jindo.$Element(this.htResizing.elTable).hasClass(this._sSETblClass) && !jindo.$Element(this.htResizing.elTable).hasClass(this._sSEReviewTblClass)){return;}
		
		// Adjustment variables: to be used to map the x, y position of the resizing point relative to elCell
		// eg) When left border of a cell at 2,2 is selected, the actual cell that has to be resized is the one at 1,2. So, set the horizontal adjustment to -1.
		// Vertical Adjustment
		this.htResizing.nVA = 0;
		// Horizontal Adjustment
		this.htResizing.nHA = 0;

		this.htResizing.nBorderLeftPos = 0;
		this.htResizing.nBorderTopPos = -1;
		this.htResizing.htEPos = wevE.pos(true);
		this.htResizing.nBorderSize = this.parseIntOr0(this.htResizing.elTable.border);
		// ===========================[E N D: Set/init global resizing info]===========================

		// Separate info is required as the offsetX/Y are different in IE and FF
		// For IE, (0, 0) is top left corner of the cell including the border.
		// For FF, (0, 0) is top left corner of the cell excluding the border.
		var nAdjustedDraggableCellEdge1;
		var nAdjustedDraggableCellEdge2;
		if(jindo.$Agent().navigator().ie || jindo.$Agent().navigator().safari){
			nAdjustedDraggableCellEdge1 = this.htResizing.nBorderSize + this.nDraggableCellEdge;
			nAdjustedDraggableCellEdge2 = this.nDraggableCellEdge;
		}else{
			nAdjustedDraggableCellEdge1 = this.nDraggableCellEdge;
			nAdjustedDraggableCellEdge2 = this.htResizing.nBorderSize + this.nDraggableCellEdge;
		}
		
		// [SMARTEDITORSUS-1504] °æ°è¼± ÆÇº°¿¡ »ç¿ë
		var elCellWidth = this.htResizing.elCell.clientWidth,  
		elCellHeight = this.htResizing.elCell.clientHeight;
		
		nRightBorderCriteria = elCellWidth - this.htResizing.htEPos.offsetX,
		nBottomBorderCriteria = elCellHeight - this.htResizing.htEPos.offsetY;
		// --[SMARTEDITORSUS-1504]
		
 		// top border of the cell is selected
		if(this.htResizing.htEPos.offsetY <= nAdjustedDraggableCellEdge1){
			// top border of the first cell can't be dragged
			if(this.htResizing.elCell.parentNode.previousSibling){
				this.htResizing.nVA = -1;
				
				// [SMARTEDITORSUS-1504] Ç¥ ¸®»çÀÌÁî¿ë gripper ¹èÄ¡ °³¼±
				//this.htResizing.nResizeMode = 2;
				this.htResizing.nResizeMode = 4;
				// --[SMARTEDITORSUS-1504]
			}
		}
		// bottom border of the cell is selected
		// [SMARTEDITORSUS-1504] Ç¥ ¸ð¼­¸® Drag »ç¿ë¼º °³¼±
		//if(this.htResizing.elCell.offsetHeight-nAdjustedDraggableCellEdge2 <= this.htResizing.htEPos.offsetY){
		if(nBottomBorderCriteria <= nAdjustedDraggableCellEdge2){
			this.htResizing.nBorderTopPos = this.htResizing.elCell.offsetHeight + nAdjustedDraggableCellEdge1 - 1;
			this.htResizing.nResizeMode = 2;
		}
		// --[SMARTEDITORSUS-1504]
		
		// left border of the cell is selected
		if(this.htResizing.htEPos.offsetX <= nAdjustedDraggableCellEdge1){
			// left border of the first cell can't be dragged
			// [SMARTEDITORSUS-1504] Ç¥ ¸®»çÀÌÁî¿ë gripper ¹èÄ¡ °³¼±
			// ÀÏ¹Ý Ç¥´Â ¾Æ·¡ if¹®À» °ÅÄ¡Áö ¾ÊÁö¸¸, ±Û¾ç½ÄÀÇ °æ¿ì °¡Àå ÁÂÃø cellÀÇ previousSiblingÀÌ textNodeÀÌ±â ¶§¹®¿¡ if¹®¿¡ ºÎÇÕÇÏ´Â ¹®Á¦°¡ ÀÖ¾ú´Ù.
			/*if(this.htResizing.elCell.previousSibling){
				this.htResizing.nHA = -1;
				
				this.htResizing.nResizeMode = 0;
			}*/
			
			// °¡Àå ÁÂÃøÀÇ cellÀº ±× offsetLeft°¡ tableÀÇ scrollLeft¿Í °°´Ù.
			if(this.htResizing.elTable.scrollLeft != this.htResizing.elCell.offsetLeft){
				this.htResizing.nHA = -1;
				
				this.htResizing.nResizeMode = 3;
			}
			// --[SMARTEDITORSUS-1504]
		}
		// right border of the cell is selected
		// [SMARTEDITORSUS-1504] Ç¥ ¸ð¼­¸® Drag »ç¿ë¼º °³¼±
		//if(this.htResizing.elCell.offsetWidth - nAdjustedDraggableCellEdge2 <= this.htResizing.htEPos.offsetX){
		if(nRightBorderCriteria <= nAdjustedDraggableCellEdge1){
			this.htResizing.nBorderLeftPos = this.htResizing.elCell.offsetWidth + nAdjustedDraggableCellEdge1 - 1;
			this.htResizing.nResizeMode = 1;
		}
		// --[SMARTEDITORSUS-1504]
		
		// [SMARTEDITORSUS-1504] Ç¥ ¸ð¼­¸® Drag »ç¿ë¼º °³¼±
		if(jindo.$Agent().navigator().chrome || jindo.$Agent().navigator().safari){
			if(!this.htResizing.elPreviousCell){
				this.htResizing.elPreviousCell = this.htResizing.elCell;
			}else{
				if(this.htResizing.elCell != this.htResizing.elPreviousCell){
					this.htResizing.elPreviousCell = this.htResizing.elCell;
				}
			}
		}
		// --[SMARTEDITORSUS-1504]
		
		if(this.htResizing.nResizeMode === 0){return false;}
		
		return true;
	},
	
	_showCellResizeGrip : function(){
		// [SMARTEDITORSUS-1504] gripper°¡ WYSIWYG ÆíÁý¿µ¿ª À§Ä¡Á¤º¸¿¡ ±â¹ÝÇÏ¿© ¹èÄ¡µÇµµ·Ï º¯°æ
		/*if(this.htResizing.nResizeMode == 1){
			this.elResizeCover.style.cursor = "col-resize";
		}else{
			this.elResizeCover.style.cursor = "row-resize";
		}

		this._showResizer();*/
		// ¸¸¾à iframe ³»ºÎ¿¡ gripper¸¦ »ý¼ºÇÑ´Ù¸é, Ä¿¼­ À§Ä¡¸¦ ±â¹ÝÀ¸·Î »ý¼ºÇØ ÁÖ¸é µÊ
		/*if(this.htResizing.nResizeMode == 1){
			this._setResizerSize((this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2, this.parseIntOr0(jindo.$Element(this.elIFrame).css("height")));
			jindo.$Element(this.elResizeGrid).offset(this.htFrameOffset.top, this.htFrameOffset.left + this.htResizing.htEPos.clientX - this.parseIntOr0(this.elResizeGrid.style.width)/2 - this.htResizing.htEPos.offsetX + this.htResizing.nBorderLeftPos);
		}else{
			//°¡º¯ÆøÀ» Áö¿øÇÏ±â ¶§¹®¿¡ ¸Å¹ø ÇöÀç ContainerÀÇ Å©±â¸¦ ±¸ÇØ¿Í¼­ GripÀ» »ý¼ºÇØ¾ß ÇÑ´Ù.
			var elIFrameWidth = this.oApp.elEditingAreaContainer.offsetWidth + "px";
			this._setResizerSize(this.parseIntOr0(elIFrameWidth), (this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2);
			jindo.$Element(this.elResizeGrid).offset(this.htFrameOffset.top + this.htResizing.htEPos.clientY - this.parseIntOr0(this.elResizeGrid.style.height)/2 - this.htResizing.htEPos.offsetY + this.htResizing.nBorderTopPos, this.htFrameOffset.left);
		}*/
		if(this.htResizing.nResizeMode == 1 || this.htResizing.nResizeMode == 3){
			this.elResizeCover.style.cursor = "col-resize";
		}else if(this.htResizing.nResizeMode == 2 || this.htResizing.nResizeMode == 4){
			this.elResizeCover.style.cursor = "row-resize";
		}

		this._showResizer();
		
		// gripper´Â ´ë»ó ¼¿¿¡¼­ ¾î´À °æ°è À§¿¡ Ä¿¼­°¡ À§Ä¡Çß´À³Ä¿¡ ±â¹ÝÇÏ¿© ¹èÄ¡
		if(this.htResizing.nResizeMode == 1){ // ¿À¸¥ÂÊ °æ°è
			this._setResizerSize((this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2, this.parseIntOr0(jindo.$Element(this.elIFrame).css("height")));
			this.elResizeGrid.style.top = "0px";
			this.elResizeGrid.style.left = this.htResizing.elCell.clientWidth + this.htResizing.htEPos.clientX - this.htResizing.htEPos.offsetX - this.parseIntOr0(this.elResizeGrid.style.width)/2 + "px";
		}else if(this.htResizing.nResizeMode == 2){ // ¾Æ·¡ÂÊ °æ°è
			//°¡º¯ÆøÀ» Áö¿øÇÏ±â ¶§¹®¿¡ ¸Å¹ø ÇöÀç ContainerÀÇ Å©±â¸¦ ±¸ÇØ¿Í¼­ GripÀ» »ý¼ºÇØ¾ß ÇÑ´Ù.
			var elIFrameWidth = this.oApp.elEditingAreaContainer.offsetWidth + "px";
			this._setResizerSize(this.parseIntOr0(elIFrameWidth), (this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2);
			this.elResizeGrid.style.top = this.htResizing.elCell.clientHeight + this.htResizing.htEPos.clientY - this.htResizing.htEPos.offsetY - this.parseIntOr0(this.elResizeGrid.style.height)/2 + "px";
			this.elResizeGrid.style.left = "0px";
		}else if(this.htResizing.nResizeMode == 3){ // ¿ÞÂÊ °æ°è
			this._setResizerSize((this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2, this.parseIntOr0(jindo.$Element(this.elIFrame).css("height")));
			this.elResizeGrid.style.top = "0px";
			this.elResizeGrid.style.left = + this.htResizing.htEPos.clientX - this.htResizing.htEPos.offsetX - this.parseIntOr0(this.elResizeGrid.style.width)/2 + "px";
			
			// ÀÌÈÄ ÀÛ¾÷µéÀº ¿À¸¥ÂÊ °æ°è¸¦ ±âÁØÀ¸·Î ÀÏ°ýÃ³¸®
			this.htResizing.nResizeMode = 1;
		}else if(this.htResizing.nResizeMode == 4){ //À§ÂÊ °æ°è
			//°¡º¯ÆøÀ» Áö¿øÇÏ±â ¶§¹®¿¡ ¸Å¹ø ÇöÀç ContainerÀÇ Å©±â¸¦ ±¸ÇØ¿Í¼­ GripÀ» »ý¼ºÇØ¾ß ÇÑ´Ù.
			var elIFrameWidth = this.oApp.elEditingAreaContainer.offsetWidth + "px";
			this._setResizerSize(this.parseIntOr0(elIFrameWidth), (this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2);
			this.elResizeGrid.style.top = this.htResizing.htEPos.clientY - this.htResizing.htEPos.offsetY - this.parseIntOr0(this.elResizeGrid.style.height)/2 + "px";
			this.elResizeGrid.style.left = "0px";
			
			// ÀÌÈÄ ÀÛ¾÷µéÀº ¾Æ·¡ÂÊ °æ°è¸¦ ±âÁØÀ¸·Î ÀÏ°ýÃ³¸®
			this.htResizing.nResizeMode = 2;
		}
		 // --[SMARTEDITORSUS-1504]
	},
	
	_getAllAffectedCells : function(basis_x, basis_y, iResizeMode, oTable){
		if(!oTable){return [];}

		var oTbl = this._getCellMapping(oTable);
		var iTblX = oTbl.length;
		var iTblY = oTbl[0].length;

		// ¼±ÅÃ Å×µÎ¸®ÀÇ ¾ÕÂÊ ¼¿
		var aCellsBefore = [];
		// ¼±ÅÃ Å×µÎ¸®ÀÇ µÚÂÊ ¼¿
		var aCellsAfter = [];
		
		var htResult;

		var nMinBefore = -1, nMinAfter = -1;
		// horizontal resizing -> need to get vertical rows
		if(iResizeMode == 1){
			for(var y = 0; y < iTblY; y++){
				if(aCellsBefore.length>0 && aCellsBefore[aCellsBefore.length-1] == oTbl[basis_x][y]){continue;}
				aCellsBefore[aCellsBefore.length] = oTbl[basis_x][y];

				var nWidth = parseInt(oTbl[basis_x][y].style.width);
				if(nMinBefore == -1 || nMinBefore > nWidth){
					nMinBefore = nWidth;
				}
			}
			
			if(oTbl.length > basis_x+1){
				for(var y = 0; y < iTblY; y++){
					if(aCellsAfter.length>0 && aCellsAfter[aCellsAfter.length-1] == oTbl[basis_x+1][y]){continue;}
					aCellsAfter[aCellsAfter.length] = oTbl[basis_x+1][y];

					var nWidth = parseInt(oTbl[basis_x + 1][y].style.width);
					if(nMinAfter == -1 || nMinAfter > nWidth){
						nMinAfter = nWidth;
					}
				}
			}
			htResult = {aCellsBefore: aCellsBefore, aCellsAfter: aCellsAfter, nMinBefore: nMinBefore, nMinAfter: nMinAfter};
		}else{
			for(var x = 0; x < iTblX; x++){
				if(aCellsBefore.length>0 && aCellsBefore[aCellsBefore.length - 1] == oTbl[x][basis_y]){continue;}
				aCellsBefore[aCellsBefore.length] = oTbl[x][basis_y];

				if(nMinBefore == -1 || nMinBefore > oTbl[x][basis_y].style.height){
					nMinBefore = oTbl[x][basis_y].style.height;
				}
			}
			// ³ôÀÌ ¸®»çÀÌÂ¡ ½Ã¿¡´Â ¼±ÅÃ Å×µÎ¸® ¾ÕÂÊ ¼¿¸¸ Á¶Àý ÇÔÀ¸·Î ¾Æ·¡ÂÊ ¼¿Àº »ý¼º ÇÒ ÇÊ¿ä ¾øÀ½
			
			htResult = {aCellsBefore: aCellsBefore, aCellsAfter: aCellsAfter, nMinBefore: nMinBefore, nMinAfter: nMinAfter};
		}

		return htResult;
	},
	
	_createCellResizeGrip : function(){
		this.elTmp = document.createElement("DIV");
		try{
			this.elTmp.innerHTML = '<div style="position:absolute; overflow:hidden; z-index: 99; "><div onmousedown="return false" style="background-color:#000000;filter:alpha(opacity=0);opacity:0.0;-moz-opacity:0.0;-khtml-opacity:0.0;cursor: col-resize; left: 0px; top: 0px; width: 100%; height: 100%;font-size:1px;z-index: 999; "></div></div>';
			this.elResizeGrid = this.elTmp.firstChild;
			this.elResizeCover = this.elResizeGrid.firstChild;
		}catch(e){}
		
		// [SMARTEDITORSUS-1504] gripper¸¦ WYSIWYG ÆíÁý ¿µ¿ª À§Ä¡ Á¤º¸¿¡ ±â¹ÝÇÏ¿© ¹èÄ¡ÇÏµµ·Ï °³¼±
		//document.body.appendChild(this.elResizeGrid);
		// document.body ´ë½Å WYSIWYG ÆíÁý ¿µ¿ªÀ» µÑ·¯½Ñ container div¿¡ Ãß°¡
		var oContainer = jindo.$$.getSingle(".husky_seditor_editing_area_container");
		oContainer.appendChild(this.elResizeGrid);
		// --[SMARTEDITORSUS-1504]
	},
	
	_selectAll_Row : function(){
		this.htSelectionSPos.x = 0;
		this.htSelectionEPos.x = this.htMap.length - 1;
		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
	},
	
	_selectAll_Column : function(){
		this.htSelectionSPos.y = 0;
		this.htSelectionEPos.y = this.htMap[0].length - 1;
		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
	},
	
	_deleteSelectedCells : function(){
		var elTmp;

		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			elTmp = this.aSelectedCells[i];
			elTmp.parentNode.removeChild(elTmp);
		}

		var aTR = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {oneTimeOffCache:true});
		var nSelectionWidth = this.htSelectionEPos.x - this.htSelectionSPos.x + 1;
		var nWidth = this.htMap.length;
		if(nSelectionWidth == nWidth){
			for(var i = 0, nLen = aTR.length; i < nLen; i++){
				elTmp = aTR[i];

				// There can be empty but necessary TR's because of Rowspan
				if(!this.htMap[0][i] || !this.htMap[0][i].parentNode || this.htMap[0][i].parentNode.tagName !== "TR"){
					elTmp.parentNode.removeChild(elTmp);
				}
			}

			aTR = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {oneTimeOffCache:true});
		}

		if(aTR.length < 1){
			this.elSelectionStartTable.parentNode.removeChild(this.elSelectionStartTable);
		}
		
		this._updateSelection();
	},
	
	_insertColumnAfter : function(){
		this._removeClassFromSelection();
		this._hideTableTemplate(this.elSelectionStartTable);

		var aTR = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {oneTimeOffCache:true});
		var sInserted;
		var sTmpAttr_Inserted = "_tmp_inserted";
		var elCell, elCellClone, elCurTR, elInsertionPt;
		// copy each cells in the following order: top->down, right->left
		// +---+---+---+---+
		// |...|.2.|.1.|...|
		// |---+---+.1.|...|
		// |...|.3.|.1.|...|
		// |...|.3.+---+...|
		// |...|.3.|.4.+...|
		// |...+---+---+...|
		// |...|.6.|.5.|...|
		// +---+---+---+---+
		
		// [SMARTEDITORSUS-991] IE´Â insertionPtÀÇ previousSibling¿¡µµ ¹è°æ»öÀ» Àû¿ëÇØÁà¾ß ÇÒ ÇÊ¿ä°¡ ÀÖÀ½.
		var htBrowser = jindo.$Agent().navigator();
		// --[SMARTEDITORSUS-991]
		
		for(var y = 0, nYLen = this.htMap[0].length; y < nYLen; y++){
			elCurTR = aTR[y];
			for(var x = this.htSelectionEPos.x; x >= this.htSelectionSPos.x; x--){
				elCell = this.htMap[x][y];
				//sInserted = elCell.getAttribute(sTmpAttr_Inserted);
				//if(sInserted){continue;}

				//elCell.setAttribute(sTmpAttr_Inserted, "o");
				elCellClone = this._shallowCloneTD(elCell);
				
				// elCellCloneÀÇ outerHTML¿¡ Á¤»óÀûÀÎ rowSpanÀÌ ÀÖ´õ¶óµµ IE¿¡¼­´Â ÀÌ À§Ä¡¿¡¼­ Ç×»ó 1À» ¹ÝÈ¯. (elCellClone.rowSpan & elCellClone.getAttribute("rowSpan")).
				//var nSpan = parseInt(elCellClone.getAttribute("rowSpan"));
				var nSpan = parseInt(elCell.getAttribute("rowSpan"));

				if(nSpan > 1){
					elCellClone.setAttribute("rowSpan", 1);
					elCellClone.style.height = "";
				}
				nSpan = parseInt(elCell.getAttribute("colSpan"));

				if(nSpan > 1){
					elCellClone.setAttribute("colSpan", 1);
					elCellClone.style.width = "";
				}
				
				// ÇöÀç ÁÙ(TR)¿¡ ¼ÓÇÑ ¼¿(TD)À» Ã£¾Æ¼­ ±× ¾Õ¿¡ append ÇÑ´Ù.
				elInsertionPt = null;
				for(var xx = this.htSelectionEPos.x; xx >= this.htSelectionSPos.x; xx--){
					if(this.htMap[xx][y].parentNode == elCurTR){
						elInsertionPt = this.htMap[xx][y].nextSibling;
						break;
					}
				}
				elCurTR.insertBefore(elCellClone, elInsertionPt);
				
				// [SMARTEDITORSUS-991] IE´Â insertionPtÀÇ previousSibling¿¡µµ styleÀ» Àû¿ëÇØÁà¾ß ÇÒ ÇÊ¿ä°¡ ÀÖÀ½.
				// [SMARTEDITORSUS-1639] IE¿¡¼­ JS¿À·ù°¡ ¹ß»ýµÇ¾î ¹æ¾îÃ³¸® (»óÇÏ¼¿ÀÌ º´ÇÕµÈ »óÅÂ¿¡¼­ ¿­»ðÀÔÇÏ´Â °æ¿ì ¹ß»ý)
				if(htBrowser.ie && htBrowser.nativeVersion >= 9 && elInsertionPt){
					elInsertionPt.previousSibling.style.backgroundColor = elCellClone.style.backgroundColor;
				}
				// --[SMARTEDITORSUS-991]
			}
		}
		// remove the insertion marker from the original cells
		for(var i = 0, nLen = this.aSelectedCells.length; i < nLen; i++){
			this.aSelectedCells[i].removeAttribute(sTmpAttr_Inserted);
		}

		var nSelectionWidth = this.htSelectionEPos.x - this.htSelectionSPos.x + 1;
		var nSelectionHeight = this.htSelectionEPos.y - this.htSelectionSPos.y + 1;
		this.htSelectionSPos.x += nSelectionWidth;
		this.htSelectionEPos.x += nSelectionWidth;

		this.htMap = this._getCellMapping(this.elSelectionStartTable);
		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);

		this._showTableTemplate(this.elSelectionStartTable);
		this._addClassToSelection();

		this.sQEAction = "INSERT_TABLE_COLUMN";
		
		this.oApp.exec("SHOW_COMMON_QE");
	},
	
	_insertRowBelow : function(){
		this._selectAll_Row();

		this._removeClassFromSelection();
		this._hideTableTemplate(this.elSelectionStartTable);

		var elRowClone;
		var elTBody = this.htMap[0][0].parentNode.parentNode;
		
		var aTRs = jindo.$$(">TR", elTBody, {oneTimeOffCache:true});
		var elInsertionPt = aTRs[this.htSelectionEPos.y + 1] || null;

		// [SMARTEDITORSUS-991] IE´Â insertionPtÀÇ previousSibling¿¡µµ ¹è°æ»öÀ» Àû¿ëÇØÁà¾ß ÇÒ ÇÊ¿ä°¡ ÀÖÀ½.
		var htBrowser = jindo.$Agent().navigator();
		// --[SMARTEDITORSUS-991]
		
		for(var y = this.htSelectionSPos.y; y <= this.htSelectionEPos.y; y++){
			elRowClone = this._getTRCloneWithAllTD(y);
			elTBody.insertBefore(elRowClone, elInsertionPt);
			
			// [SMARTEDITORSUS-991] IE´Â insertionPtÀÇ previousSibling¿¡µµ Ãß°¡·Î ¹è°æ»öÀ» Àû¿ëÇØÁà¾ß ÇÒ ÇÊ¿ä°¡ ÀÖÀ½.
			if(htBrowser.ie && htBrowser.nativeVersion >= 9){
				// IEÀÇ °æ¿ì tr »çÀÌ¿¡µµ ºó ÅØ½ºÆ® ³ëµå¸¦ ÇÏ³ª Ãß°¡ÇØ Áà¾ß ÇÑ´Ù.
				var elEmptyTextNode = aTRs[this.htSelectionEPos.y].nextSibling.cloneNode();
				elTBody.insertBefore(elEmptyTextNode, elInsertionPt);
				
				// ½ºÅ¸ÀÏÀ» Àû¿ë½ÃÄÑ ÁÙ ´ë»ó tr
				var elPreviousSiblingParent = this.htMap[0][y].parentNode;
				
				var aOriginalPreviousSibling = elPreviousSiblingParent.childNodes;
				var aPreviousSibling = [];
				for(var i = 0, len = aOriginalPreviousSibling.length; i < len; i++){
					aPreviousSibling.push(aOriginalPreviousSibling[i]);
				}
				
				// ¹è°æ»öÀ» º¹»çÇÏ±â À§ÇØ ÁØºñ
				var aRowClone = elRowClone.childNodes;

				for(var i = 0, len = aRowClone.length; i < len; i++){
					var elCloneTD = aRowClone[i];
					var elPreviousTD = aPreviousSibling[i];
					// [SMARTEDITORSUS-1639] º´ÇÕ ÈÄ Ãß°¡½Ã JS ¿À·ù°¡ ¹ß»ýÇÏ´Â ¹®Á¦°¡ ÀÖ¾î nodeName È®ÀÎ
					if(elCloneTD.nodeName == "TD" && elPreviousTD && elPreviousTD.nodeName == "TD"){
						elPreviousTD.style.backgroundColor = elCloneTD.style.backgroundColor;
					}
				}
			}
			// --[SMARTEDITORSUS-991]
		}

		var nSelectionWidth = this.htSelectionEPos.x - this.htSelectionSPos.x + 1;
		var nSelectionHeight = this.htSelectionEPos.y - this.htSelectionSPos.y + 1;
		this.htSelectionSPos.y += nSelectionHeight;
		this.htSelectionEPos.y += nSelectionHeight;

		this.htMap = this._getCellMapping(this.elSelectionStartTable);
		this._selectCells(this.htSelectionSPos, this.htSelectionEPos);

		this._showTableTemplate(this.elSelectionStartTable);
		this._addClassToSelection();

		this.sQEAction = "INSERT_TABLE_ROW";
		
		this.oApp.exec("SHOW_COMMON_QE");
	},

	_updateSelection : function(){
		this.aSelectedCells = jindo.$A(this.aSelectedCells).filter(function(v){return (v.parentNode!==null && v.parentNode.parentNode!==null);}).$value();
	},
	
	_startCellSelection : function(){
		this.htMap = this._getCellMapping(this.elSelectionStartTable);

		// De-select the default selection
		this.oApp.getEmptySelection().oBrowserSelection.selectNone();

		if(this.oApp.oNavigator["safari"] || this.oApp.oNavigator["chrome"]){
			this.oApp.getWYSIWYGDocument().onselectstart = function(){return false;};
		}
		
		var elIFrame = this.oApp.getWYSIWYGWindow().frameElement;
		this.htEditingAreaPos = jindo.$Element(elIFrame).offset();
		this.htEditingAreaPos.height = elIFrame.offsetHeight;
		this.htEditingAreaPos.bottom = this.htEditingAreaPos.top + this.htEditingAreaPos.height;
		this.htEditingAreaPos.width = elIFrame.offsetWidth;
		this.htEditingAreaPos.right = this.htEditingAreaPos.left + this.htEditingAreaPos.width;

/*
		if(!this.oNavigatorInfo["firefox"]){
			this.oApp.exec("DISABLE_WYSIWYG", []);
		}
*/
		this._changeTableEditorStatus(this.STATUS.CELL_SELECTING);
	},

	_selectBetweenCells : function(elCell1, elCell2){
		this._deselectCells();
		
		var oP1 = this._getBasisCellPosition(elCell1);
		var oP2 = this._getBasisCellPosition(elCell2);
		this._setEndPos(oP1);
		this._setEndPos(oP2);

		var oStartPos = {}, oEndPos = {};

		oStartPos.x = Math.min(oP1.x, oP1.ex, oP2.x, oP2.ex);
		oStartPos.y = Math.min(oP1.y, oP1.ey, oP2.y, oP2.ey);

		oEndPos.x = Math.max(oP1.x, oP1.ex, oP2.x, oP2.ex);
		oEndPos.y = Math.max(oP1.y, oP1.ey, oP2.y, oP2.ey);

		this._selectCells(oStartPos, oEndPos);
	},

	_getNextCell : function(elCell){
		while(elCell){
			elCell = elCell.nextSibling;
			if(elCell && elCell.tagName && elCell.tagName.match(/^TD|TH$/)){return elCell;}
		}
		
		return null;
	},

	_getCellMapping : function(elTable){
		var aTR = jindo.$$(">TBODY>TR", elTable, {oneTimeOffCache:true});
		var nTD = 0;
		var aTD_FirstRow = aTR[0].childNodes;
/*
		// remove empty TR's from the bottom of the table
		for(var i=aTR.length-1; i>0; i--){
			if(!aTR[i].childNodes || aTR[i].childNodes.length === 0){
				aTR[i].parentNode.removeChild(aTR[i]);
				aTR = aTR.slice(0, i);
				
				if(this.htSelectionSPos.y>=i) this.htSelectionSPos.y--;
				if(this.htSelectionEPos.y>=i) this.htSelectionEPos.y--;
			}else{
				break;
			}
		}
*/
		// count the number of columns
		for(var i = 0; i < aTD_FirstRow.length; i++){
			var elTmp = aTD_FirstRow[i];
			
			if(!elTmp.tagName || !elTmp.tagName.match(/^TD|TH$/)){continue;}

			if(elTmp.getAttribute("colSpan")){
				nTD += this.parseIntOr0(elTmp.getAttribute("colSpan"));
			}else{
				nTD ++;
			}
		}

		var nTblX = nTD;
		var nTblY = aTR.length;

		var aCellMapping = new Array(nTblX);
		for(var x = 0; x < nTblX; x++){
			aCellMapping[x] = new Array(nTblY);
		}

		for(var y = 0; y < nTblY; y++){
			var elCell = aTR[y].childNodes[0];

			if(!elCell){continue;}
			if(!elCell.tagName || !elCell.tagName.match(/^TD|TH$/)){elCell = this._getNextCell(elCell);}

			var x = -1;
			while(elCell){
				x++;
				if(!aCellMapping[x]){aCellMapping[x] = [];}
				if(aCellMapping[x][y]){continue;}
				var colSpan = parseInt(elCell.getAttribute("colSpan"), 10) || 1;
				var rowSpan = parseInt(elCell.getAttribute("rowSpan"), 10) || 1;
/*
				if(y+rowSpan >= nTblY){
					rowSpan = nTblY-y;
					elCell.setAttribute("rowSpan", rowSpan);
				}
*/
				for(var yy = 0; yy < rowSpan; yy++){
					for(var xx = 0; xx < colSpan; xx++){
						if(!aCellMapping[x+xx]){
							aCellMapping[x+xx] = [];
						}
						aCellMapping[x+xx][y+yy] = elCell;
					}
				}

				elCell = this._getNextCell(elCell);
			}
		}
		
		// remove empty TR's
		// (»ó´Ü TDÀÇ rowspan¸¸À¸·Î ÁöÅÊµÇ´Â) ºó TRÀÌ ÀÖÀ» °æ¿ì IE7 ÀÌÇÏ¿¡¼­ ·£´õ¸µ ¿À·ù°¡ ¹ß»ý ÇÒ ¼ö ÀÖ¾î ºó TRÀ» Áö¿ö ÁÜ
		var bRowRemoved = false;
		var elLastCell = null;
		for(var y = 0, nRealY = 0, nYLen = aCellMapping[0].length; y < nYLen; y++, nRealY++){
			elLastCell = null;
			if(!aTR[y].innerHTML.match(/TD|TH/i)){
				for(var x = 0, nXLen = aCellMapping.length; x < nXLen; x++){
					elCell = aCellMapping[x][y];
					if(!elCell || elCell === elLastCell){
						continue;
					}
					elLastCell = elCell;
					var rowSpan = parseInt(elCell.getAttribute("rowSpan"), 10) || 1;

					if(rowSpan > 1){
						elCell.setAttribute("rowSpan", rowSpan - 1);
					}
				}
				aTR[y].parentNode.removeChild(aTR[y]);

				if(this.htSelectionEPos.y >= nRealY){
					nRealY--;
					this.htSelectionEPos.y--;
				}
				
				bRowRemoved = true;
			}
		}
		if(bRowRemoved){
			return this._getCellMapping(elTable);
		}
		
		return aCellMapping;
	},
	
	_selectCells : function(htSPos, htEPos){
		this.aSelectedCells = this._getSelectedCells(htSPos, htEPos);
		this._addClassToSelection();
	},

	_deselectCells : function(){
		this._removeClassFromSelection();
	
		this.aSelectedCells = [];
		this.htSelectionSPos = {x:-1, y:-1};
		this.htSelectionEPos = {x:-1, y:-1};
	},
	
	_addClassToSelection : function(){
		var welCell, elCell;
		for(var i = 0; i < this.aSelectedCells.length; i++){
			elCell = this.aSelectedCells[i];

			// [SMARTEDITORSUS-1552] µå·¡±×·Î ¼¿À» ¼±ÅÃÇÏ´Â Áß elCellÀÌ ¾ø´Â °æ¿ì ¿À·ù ¹ß»ý
			if(elCell){
				// [SMARTEDITORSUS-1498][SMARTEDITORSUS-1549] ¼±ÅÃµÈ ¸ðµç ¼¿¿¡¼­ µå·¡±×°¡ ¹ß»ýÇÏÁö ¸øÇÏ°Ô ¹æÁö(FF, Chrome)
				if(elCell.ondragstart == null){
					elCell.ondragstart = function(){
						return false;
					};
				}
				// --[SMARTEDITORSUS-1498][SMARTEDITORSUS-1549]
					
				welCell = jindo.$Element(elCell);
				welCell.addClass(this.CELL_SELECTION_CLASS);
				
				// [SMARTEDITORSUS-1498][SMARTEDITORSUS-1549] ¼±ÅÃµÈ ¸ðµç ¼¿¿¡¼­ µå·¡±×°¡ ¹ß»ýÇÏÁö ¸øÇÏ°Ô ¹æÁö(FF, Chrome)
				welCell.addClass("undraggable");
				// --[SMARTEDITORSUS-1498][SMARTEDITORSUS-1549]
				
				if(elCell.style.backgroundColor){
					elCell.setAttribute(this.TMP_BGC_ATTR, elCell.style.backgroundColor);
					welCell.css("backgroundColor", "");
				}
				
				if(elCell.style.backgroundImage) {
					elCell.setAttribute(this.TMP_BGIMG_ATTR, elCell.style.backgroundImage);
					welCell.css("backgroundImage", "");
				}
			}
			// --[SMARTEDITORSUS-1552]
		}
	},

	_removeClassFromSelection : function(){
		var welCell, elCell;
		
		for(var i = 0; i < this.aSelectedCells.length; i++){
			elCell = this.aSelectedCells[i];

			// [SMARTEDITORSUS-1552] µå·¡±×·Î ¼¿À» ¼±ÅÃÇÏ´Â Áß elCellÀÌ ¾ø´Â °æ¿ì ¿À·ù ¹ß»ý
			if(elCell){
				welCell = jindo.$Element(elCell);
				welCell.removeClass(this.CELL_SELECTION_CLASS);
				
				// [SMARTEDITORSUS-1498][SMARTEDITORSUS-1549] ¼±ÅÃµÈ ¸ðµç ¼¿¿¡¼­ µå·¡±×°¡ ¹ß»ýÇÏÁö ¸øÇÏ°Ô ¹æÁö(FF, Chrome)
				welCell.removeClass("undraggable");
				// --[SMARTEDITORSUS-1498][SMARTEDITORSUS-1549]
				
				//¹è°æ»ö
				if(elCell.getAttribute(this.TMP_BGC_ATTR)){
					elCell.style.backgroundColor = elCell.getAttribute(this.TMP_BGC_ATTR);
					elCell.removeAttribute(this.TMP_BGC_ATTR);
				}
				//¹è°æÀÌ¹ÌÁö 
				if(elCell.getAttribute(this.TMP_BGIMG_ATTR)) {
					welCell.css("backgroundImage",elCell.getAttribute(this.TMP_BGIMG_ATTR));
					elCell.removeAttribute(this.TMP_BGIMG_ATTR);
				}
			}
			// --[SMARTEDITORSUS-1552]
		}
	},

	_expandAndSelect : function(htPos1, htPos2){
		var x, y, elTD, nTmp, i;

		// expand top
		if(htPos1.y > 0){
			for(x = htPos1.x; x <= htPos2.x; x++){
				elTD = this.htMap[x][htPos1.y];
				if(this.htMap[x][htPos1.y - 1] == elTD){
					nTmp = htPos1.y - 2;
					while(nTmp >= 0 && this.htMap[x][nTmp] == elTD){
						nTmp--;
					}
					htPos1.y = nTmp + 1;
					this._expandAndSelect(htPos1, htPos2);
					return;
				}
			}
		}
		
		// expand left
		if(htPos1.x > 0){
			for(y = htPos1.y; y <= htPos2.y; y++){
				elTD = this.htMap[htPos1.x][y];
				if(this.htMap[htPos1.x - 1][y] == elTD){
					nTmp = htPos1.x - 2;
					while(nTmp >= 0 && this.htMap[nTmp][y] == elTD){
						nTmp--;
					}
					htPos1.x = nTmp + 1;
					this._expandAndSelect(htPos1, htPos2);
					return;
				}
			}
		}

		// expand bottom
		if(htPos2.y < this.htMap[0].length - 1){
			for(x = htPos1.x; x <= htPos2.x; x++){
				elTD = this.htMap[x][htPos2.y];
				if(this.htMap[x][htPos2.y + 1] == elTD){
					nTmp = htPos2.y + 2;
					while(nTmp < this.htMap[0].length && this.htMap[x][nTmp] == elTD){
						nTmp++;
					}
					htPos2.y = nTmp - 1;
					this._expandAndSelect(htPos1, htPos2);
					return;
				}
			}
		}

		// expand right
		if(htPos2.x < this.htMap.length - 1){
			for(y = htPos1.y; y <= htPos2.y; y++){
				elTD = this.htMap[htPos2.x][y];
				if(this.htMap[htPos2.x + 1][y] == elTD){
					nTmp = htPos2.x + 2;
					while(nTmp < this.htMap.length && this.htMap[nTmp][y] == elTD){
						nTmp++;
					}
					htPos2.x = nTmp - 1;
					this._expandAndSelect(htPos1, htPos2);
					return;
				}
			}
		}
	},
	
	_getSelectedCells : function(htPos1, htPos2){
		this._expandAndSelect(htPos1, htPos2);
		var x1 = htPos1.x;
		var y1 = htPos1.y;

		var x2 = htPos2.x;
		var y2 = htPos2.y;

		this.htSelectionSPos = htPos1;
		this.htSelectionEPos = htPos2;
		
		var aResult = [];

		for(var y = y1; y <= y2; y++){
			for(var x = x1; x <= x2; x++){
				if(jindo.$A(aResult).has(this.htMap[x][y])){
					continue;
				}
				aResult[aResult.length] = this.htMap[x][y];
			}
		}
		return aResult;
	},

	_setEndPos : function(htPos){
		var nColspan, nRowspan;

		nColspan = parseInt(htPos.elCell.getAttribute("colSpan"), 10) || 1;
		nRowspan = parseInt(htPos.elCell.getAttribute("rowSpan"), 10) || 1;
		htPos.ex = htPos.x + nColspan - 1;
		htPos.ey = htPos.y + nRowspan - 1;
	},

	_getBasisCellPosition : function(elCell){
		var x = 0, y = 0;
		for(x = 0; x < this.htMap.length; x++){
			for(y = 0; y < this.htMap[x].length; y++){
				if(this.htMap[x][y] == elCell){
					return {'x': x, 'y': y, elCell: elCell};
				}
			}
		}
		return {'x': 0, 'y': 0, elCell: elCell};
	},
	
	_applyTableTemplate : function(elTable, nTemplateIdx){
		// clear style first if already exists
		/*
		if(elTable.getAttribute(this.ATTR_TBL_TEMPLATE)){
			this._doApplyTableTemplate(elTable, nhn.husky.SE2M_TableTemplate[this.parseIntOr0(elTable.getAttribute(this.ATTR_TBL_TEMPLATE))], true);
		}else{
			this._clearAllTableStyles(elTable);
		}
		*/
		
		if (!elTable) {
			return;
		}

		// »ç¿ëÀÚ°¡ ÁöÁ¤ÇÑ ½ºÅ¸ÀÏ ¹«½ÃÇÏ°í »õ ÅÛÇÃ¸´ Àû¿ë
		// http://bts.nhncorp.com/nhnbts/browse/COM-871
		this._clearAllTableStyles(elTable);
		
		this._doApplyTableTemplate(elTable, nhn.husky.SE2M_TableTemplate[nTemplateIdx], false);
		elTable.setAttribute(this.ATTR_TBL_TEMPLATE, nTemplateIdx);
	},
	
	_clearAllTableStyles : function(elTable){
		elTable.removeAttribute("border");
		elTable.removeAttribute("cellPadding");
		elTable.removeAttribute("cellSpacing");
		elTable.style.padding = "";
		elTable.style.border = "";
		elTable.style.backgroundColor = "";
		elTable.style.color = "";
		
		var aTD = jindo.$$(">TBODY>TR>TD", elTable, {oneTimeOffCache:true});
		for(var i = 0, nLen = aTD.length; i < nLen; i++){
			aTD[i].style.padding = "";
			aTD[i].style.border = "";
			aTD[i].style.backgroundColor = "";
			aTD[i].style.color = "";
		}
	},
	
	_hideTableTemplate : function(elTable){
		if(elTable.getAttribute(this.ATTR_TBL_TEMPLATE)){
			this._doApplyTableTemplate(elTable, nhn.husky.SE2M_TableTemplate[this.parseIntOr0(elTable.getAttribute(this.ATTR_TBL_TEMPLATE))], true);
		}
	},
	
	_showTableTemplate : function(elTable){
		if(elTable.getAttribute(this.ATTR_TBL_TEMPLATE)){
			this._doApplyTableTemplate(elTable, nhn.husky.SE2M_TableTemplate[this.parseIntOr0(elTable.getAttribute(this.ATTR_TBL_TEMPLATE))], false);
		}
	},
	
	_doApplyTableTemplate : function(elTable, htTableTemplate, bClearStyle){
		var htTableProperty = htTableTemplate.htTableProperty;
		var htTableStyle = htTableTemplate.htTableStyle;
		var ht1stRowStyle = htTableTemplate.ht1stRowStyle;
		var ht1stColumnStyle = htTableTemplate.ht1stColumnStyle;
		var aRowStyle = htTableTemplate.aRowStyle;
		var elTmp;

		// replace all TH's with TD's

		if(htTableProperty){
			this._copyAttributesTo(elTable, htTableProperty, bClearStyle);
		}
		if(htTableStyle){
			this._copyStylesTo(elTable, htTableStyle, bClearStyle);
		}

		var aTR = jindo.$$(">TBODY>TR", elTable, {oneTimeOffCache:true});

		var nStartRowNum = 0;
		if(ht1stRowStyle){
			var nStartRowNum = 1;
			 
			for(var ii = 0, nNumCells = aTR[0].childNodes.length; ii < nNumCells; ii++){
				elTmp = aTR[0].childNodes[ii];
				if(!elTmp.tagName || !elTmp.tagName.match(/^TD|TH$/)){continue;}
				this._copyStylesTo(elTmp, ht1stRowStyle, bClearStyle);
			}
		}

		var nRowSpan;
		var elFirstEl;
		if(ht1stColumnStyle){
			// if the style's got a row heading, skip the 1st row. (it was taken care above)
			var nRowStart = ht1stRowStyle ? 1 : 0;
			
			for(var i = nRowStart, nLen = aTR.length; i < nLen;){
				elFirstEl = aTR[i].firstChild;
				
				nRowSpan = 1;

				if(elFirstEl && elFirstEl.tagName.match(/^TD|TH$/)){
					nRowSpan = parseInt(elFirstEl.getAttribute("rowSpan"), 10) || 1;
					this._copyStylesTo(elFirstEl, ht1stColumnStyle, bClearStyle);
				}

				i += nRowSpan;
			}
		}

		if(aRowStyle){
			var nNumStyles = aRowStyle.length;
			for(var i = nStartRowNum, nLen = aTR.length; i < nLen; i++){
				for(var ii = 0, nNumCells = aTR[i].childNodes.length; ii < nNumCells; ii++){
					var elTmp = aTR[i].childNodes[ii];
					if(!elTmp.tagName || !elTmp.tagName.match(/^TD|TH$/)){continue;}
					this._copyStylesTo(elTmp, aRowStyle[(i+nStartRowNum)%nNumStyles], bClearStyle);
				}
			}
		}
	},
	
	_copyAttributesTo : function(oTarget, htProperties, bClearStyle){
		var elTmp;
		for(var x in htProperties){
			if(htProperties.hasOwnProperty(x)){
				if(bClearStyle){
					if(oTarget[x]){
						elTmp = document.createElement(oTarget.tagName);
						elTmp[x] = htProperties[x];
						if(elTmp[x] == oTarget[x]){
							oTarget.removeAttribute(x);
						}
					}
				}else{
					elTmp = document.createElement(oTarget.tagName);
					elTmp.style[x] = "";
					if(!oTarget[x] || oTarget.style[x] == elTmp.style[x]){oTarget.setAttribute(x, htProperties[x]);}
				}
			}
		}
	},
	
	_copyStylesTo : function(oTarget, htProperties, bClearStyle){
		var elTmp;
		for(var x in htProperties){
			if(htProperties.hasOwnProperty(x)){
				if(bClearStyle){
					if(oTarget.style[x]){
						elTmp = document.createElement(oTarget.tagName);
						elTmp.style[x] = htProperties[x];
						if(elTmp.style[x] == oTarget.style[x]){
							oTarget.style[x] = "";
						}
					}
				}else{
					elTmp = document.createElement(oTarget.tagName);
					elTmp.style[x] = "";
					if(!oTarget.style[x] || oTarget.style[x] == elTmp.style[x] || x.match(/^border/)){oTarget.style[x] = htProperties[x];}
				}
			}
		}
	},
	
	_hideResizer : function(){
		this.elResizeGrid.style.display = "none";
	},
	
	_showResizer : function(){
		this.elResizeGrid.style.display = "block";
	},
	
	_setResizerSize : function(width, height){
		this.elResizeGrid.style.width = width + "px";
		this.elResizeGrid.style.height = height + "px";
	},
	
	parseBorder : function(vBorder, sBorderStyle){
		if(sBorderStyle == "none"){return 0;}

		var num = parseInt(vBorder, 10);
		if(isNaN(num)){
			if(typeof(vBorder) == "string"){
				// IE Bug
				return 1;
/*
				switch(vBorder){
				case "thin":
					return 1;
				case "medium":
					return 3;
				case "thick":
					return 5;
				}
*/
			}
		}
		return num;
	},
	
	parseIntOr0 : function(num){
		num = parseInt(num, 10);
		if(isNaN(num)){return 0;}
		return num;
	},
	
	_getTRCloneWithAllTD : function(nRow){
		var elResult = this.htMap[0][nRow].parentNode.cloneNode(false);

		var elCurTD, elCurTDClone;
		for(var i = 0, nLen = this.htMap.length; i < nLen; i++){
			elCurTD = this.htMap[i][nRow];
			if(elCurTD.tagName == "TD"){
				elCurTDClone = this._shallowCloneTD(elCurTD);
				elCurTDClone.setAttribute("rowSpan", 1);
				elCurTDClone.setAttribute("colSpan", 1);
				elCurTDClone.style.width = "";
				elCurTDClone.style.height = "";
				elResult.insertBefore(elCurTDClone, null);
			}
		}
		
		return elResult;
	},
	
	_shallowCloneTD : function(elTD){
		var elResult = elTD.cloneNode(false);
		
		elResult.innerHTML = this.sEmptyTDSrc;
		
		return elResult;
	},
	
	// elTblÀÌ ²Ë Âù Á÷»ç°¢Çü ÇüÅÂÀÇ Å×ÀÌºíÀÎÁö È®ÀÎ
	_isValidTable : function(elTbl){
		if(!elTbl || !elTbl.tagName || elTbl.tagName != "TABLE"){
			return false;
		}

		this.htMap = this._getCellMapping(elTbl);
		var nXSize = this.htMap.length;
		if(nXSize < 1){return false;}

		var nYSize = this.htMap[0].length;
		if(nYSize < 1){return false;}

		for(var i = 1; i < nXSize; i++){
			// Ã¹¹øÂ° ¿­°ú ±æÀÌ°¡ ´Ù¸¥ ¿­ÀÌ ÇÏ³ª¶óµµ ÀÖ´Ù¸é Á÷»ç°¢ÇüÀÌ ¾Æ´Ô
			if(this.htMap[i].length != nYSize || !this.htMap[i][nYSize - 1]){
				return false;
			}
			
			// ºóÄ­ÀÌ ÇÏ³ª¶óµµ ÀÖ´Ù¸é ²Ë Âù Á÷»ç°¢ÇüÀÌ ¾Æ´Ô
			for(var j = 0; j < nYSize; j++){
				if(!this.htMap[i] || !this.htMap[i][j]){
					return false;
				}
			}
		}
		
		return true;
	},
	
	addCSSClass : function(sClassName, sClassRule){
		var oDoc = this.oApp.getWYSIWYGDocument();
		if(oDoc.styleSheets[0] && oDoc.styleSheets[0].addRule){
			// IE
			oDoc.styleSheets[0].addRule("." + sClassName, sClassRule);
		}else{
			// FF
			var elHead = oDoc.getElementsByTagName("HEAD")[0]; 
			var elStyle = oDoc.createElement ("STYLE"); 
			//styleElement.type = "text / css"; 
			elHead.appendChild (elStyle); 
			
			elStyle.sheet.insertRule("." + sClassName + " { "+sClassRule+" }", 0);
		}
	}
	//@lazyload_js]
});
/**
 * @name SE2M_QuickEditor_Common
 * @class
 * @description Quick Editor Common function Class
 * @author NHN AjaxUI Lab - mixed 
 * @version 1.0
 * @since 2009.09.29
 * */
nhn.husky.SE2M_QuickEditor_Common = jindo.$Class({
	/**
	 * class ÀÌ¸§
	 * @type {String}
	 */
	name : "SE2M_QuickEditor_Common",
	/**
	 * È¯°æ Á¤º¸.
	 * @type {Object}
	 */
	_environmentData : "",
	/**
	 * ÇöÀç Å¸ÀÔ (table|img)
	 * @type {String}
	 */
	_currentType :"",
	/**
	 * ÀÌº¥Æ®°¡ ·¹ÀÌ¾î ¾È¿¡¼­ È£ÃâµÇ¾ú´ÂÁö ¾Ë±â À§ÇÑ º¯¼ö
	 * @type {Boolean}
	 */
	_in_event : false,
	/**
	 * AjaxÃ³¸®¸¦ ÇÏÁö ¾ÊÀ½
	 * @type {Boolean}
	 */
	_bUseConfig : true,
	
	/**
	 * °øÅë ¼­¹ö¿¡¼­ °³ÀÎ ¼³Á¤ ¹Þ¾Æ¿À´Â AjaxUrl 
	 * @See SE2M_Configuration.js
	 */
	_sBaseAjaxUrl : "",
	_sAddTextAjaxUrl : "",
	
	/**
	 * ÃÊ±â ÀÎ½ºÅÏ½º »ý¼º ½ÇÇàµÇ´Â ÇÔ¼ö.
	 */
	$init : function() {
		this.waHotkeys = new jindo.$A([]);
		this.waHotkeyLayers = new jindo.$A([]);
	},
	
	$ON_MSG_APP_READY : function() {
		var htConfiguration = nhn.husky.SE2M_Configuration.QuickEditor;
		
		if(htConfiguration){
			this._bUseConfig = (!!htConfiguration.common && typeof htConfiguration.common.bUseConfig !== "undefined") ? htConfiguration.common.bUseConfig : true;	
		}

    	if(!this._bUseConfig){	
			this.setData("{table:'full',img:'full',review:'full'}");
		} else {
			this._sBaseAjaxUrl = htConfiguration.common.sBaseAjaxUrl;
			this._sAddTextAjaxUrl = htConfiguration.common.sAddTextAjaxUrl;
		
			this.getData();
		}
	},
	
	//»èÁ¦ ½Ã¿¡ qe layer close
	$ON_EVENT_EDITING_AREA_KEYDOWN : function(oEvent){
		var oKeyInfo = oEvent.key();
		//Backspace : 8, Delete :46
		if (oKeyInfo.keyCode == 8 || oKeyInfo.keyCode == 46 ) {
			// [SMARTEDITORSUS-1213][IE9, 10] »çÁø »èÁ¦ ÈÄ zindex 1000ÀÎ div°¡ ÀÜÁ¸ÇÏ´Âµ¥, ±× À§·Î ½æ³×ÀÏ drag¸¦ ½ÃµµÇÏ´Ù º¸´Ï dropÀÌ ºÒ°¡´É.
			var htBrowser = jindo.$Agent().navigator();
			if(htBrowser.ie && htBrowser.nativeVersion > 8){ 
				var elFirstChild = jindo.$$.getSingle("DIV.husky_seditor_editing_area_container").childNodes[0];
				if((elFirstChild.tagName == "DIV") && (elFirstChild.style.zIndex == 1000)){
					elFirstChild.parentNode.removeChild(elFirstChild);
				}
			}
			// --[SMARTEDITORSUS-1213]
			this.oApp.exec("CLOSE_QE_LAYER", [oEvent]);
		}
	},
	
	getData : function() {
		var self = this;
		jindo.$Ajax(self._sBaseAjaxUrl, {
			type : "jsonp",
			timeout : 1,
			onload: function(rp) {
				var result = rp.json().result;
				// [SMARTEDITORSUS-1028][SMARTEDITORSUS-1517] QuickEditor ¼³Á¤ API °³¼±
				//if (!!result && !!result.length) {
				if (!!result && !!result.text_data) {
					//self.setData(result[result.length - 1]);
					self.setData(result.text_data);
				} else {
					self.setData("{table:'full',img:'full',review:'full'}");
				}
				// --[SMARTEDITORSUS-1028][SMARTEDITORSUS-1517]
			},
			
			onerror : function() {
				self.setData("{table:'full',img:'full',review:'full'}");
			},
			
			ontimeout : function() {
				self.setData("{table:'full',img:'full',review:'full'}");
			}	
		}).request({ text_key : "qeditor_fold" });
	},
	
	setData : function(sResult){
		var oResult = {
			table : "full",
			img : "full",
			review : "full"
		};
		
		if(sResult){
			oResult = eval("("+sResult+")");	
		}
		
		this._environmentData = {
			table : {
				isOpen   : false,
				type     : oResult["table"],//full,fold,
				isFixed  : false,
				position : []
			},
			img : {
				isOpen   : false,
				type     : oResult["img"],//full,fold
				isFixed  : false
			},
			review : {
				isOpen   : false,
				type     : oResult["review"],//full,fold
				isFixed  : false,
				position : []
			}
		};
		
		
		this.waTableTagNames =jindo.$A(["table","tbody","td","tfoot","th","thead","tr"]);
	},
	
	/**
	 * À§ÁöÀ¨ ¿µ¿ª¿¡ ´ÜÃàÅ°°¡ µî·ÏµÉ ¶§, 
	 * tab °ú shift+tab (µé¿©¾²±â / ³»¾î¾²±â ) ¸¦ Á¦¿ÜÇÑ ´ÜÃàÅ° ¸®½ºÆ®¸¦ ÀúÀåÇÑ´Ù.
	 */
	$ON_REGISTER_HOTKEY : function(sHotkey, sCMD, aArgs){
		if(sHotkey != "tab" && sHotkey != "shift+tab"){
			this.waHotkeys.push([sHotkey, sCMD, aArgs]);
		}
	},
	
	//@lazyload_js OPEN_QE_LAYER[
	$ON_MSG_BEFOREUNLOAD_FIRED : function(){
		// [SMARTEDITORSUS-1028][SMARTEDITORSUS-1517] QuickEditor ¼³Á¤ API °³¼±À¸·Î, submit ÀÌÈÄ ¹ß»ýÇÏ°Ô µÇ´Â beforeunload ÀÌº¥Æ® ÇÚµé¸µ Á¦°Å
		/*if (!this._environmentData || !this._bUseConfig) {
			return;
		}
		
		jindo.$Ajax(this._sAddTextAjaxUrl,{
			type : "jsonp",
			onload: function(){}
		}).request({
			text_key :"qeditor_fold",
			text_data : "{table:'"+this._environmentData["table"]["type"]+"',img:'"+this._environmentData["img"]["type"]+"',review:'"+this._environmentData["review"]["type"]+"'}" 
		});*/
		// --[SMARTEDITORSUS-1028][SMARTEDITORSUS-1517]
	},
	/**
	 * openTypeÀ» ÀúÀåÇÏ´Â ÇÔ¼ö.
	 * @param {String} sType
	 * @param {Boolean} bBol
	 */
	setOpenType : function(sType,bBol){
		// [SMARTEDITORSUS-1213] ÀÛ¼ºµÈ ÄÁÅÙÃ÷ ¼öÁ¤ È­¸é¿¡¼­ »çÁøÀÌ ·ÎµåµÇÀÚ¸¶ÀÚ ¹Ù·Î »çÁøÀ» Å¬¸¯ÇÏ¸é QuickEditor¸¦ ¶ç¿ì´Â µ¥ ¹®Á¦°¡ ÀÖÀ½ 
		if(typeof(this._environmentData) == "undefined" || this._environmentData == null){
			this._environmentData = {};
		}
		if(typeof(this._environmentData[sType]) == "undefined" || this._environmentData[sType] == null){
			this._environmentData[sType] = {};
		}
		if(typeof(this._environmentData[sType].isOpen) == "undefined" || this._environmentData[sType].isOpen == null){
			this._environmentData[sType].isOpen = true;
		}
		// --[SMARTEDITORSUS-1213]
		
		this._environmentData[sType].isOpen = bBol;
	},
	/**
	 * ·¹ÀÌ¾î°¡ ¿ÀÇÂ ÇÒ ¶§ ½ÇÇàµÇ´Â ÀÌº¥Æ®.
	 * ·¹ÀÌ¾î°¡ Ã³À½ ¶ã ¶§,
	 * 		ÀúÀåµÈ ´ÜÃàÅ° ¸®½ºÆ®¸¦ ·¹ÀÌ¾î¿¡ µî·ÏÇÏ°í (·¹ÀÌ¾î°¡ ¶° ÀÖÀ»¶§µµ ´ÜÃàÅ°°¡ ¸Ôµµ·Ï ÇÏ±â À§ÇØ)
	 * 		·¹ÀÌ¾î¿¡ ´ëÇÑ Å°º¸µå/¸¶¿ì½º ÀÌº¥Æ®¸¦ µî·ÏÇÑ´Ù.
	 * @param {Element} oEle
	 * @param {Element} oLayer
	 * @param {String} sType(img|table|review)
	 */
	$ON_OPEN_QE_LAYER : function(oEle,oLayer,sType){
		if(this.waHotkeys.length() > 0 && !this.waHotkeyLayers.has(oLayer)){
			this.waHotkeyLayers.push(oLayer);
			
			var aParam;
			for(var i=0, nLen=this.waHotkeys.length(); i<nLen; i++){
				aParam = this.waHotkeys.get(i);
				this.oApp.exec("ADD_HOTKEY", [aParam[0], aParam[1], aParam[2], oLayer]);
			}
		}
		
		var  type = sType;//?sType:"table";//this.get_type(oEle);
		if(type){
			this.targetEle = oEle;
			this.currentEle = oLayer;
			this.layer_show(type,oEle);	
		}
	},
	/**
	 * ·¹ÀÌ¾î°¡ ´ÝÇûÀ»¶§ ½ÇÇàµÇ´Â ÀÌº¥Æ®.
	 * @param {jindo.$Event} weEvent
	 */
	$ON_CLOSE_QE_LAYER : function(weEvent){
		if(!this.currentEle){return;} 
//		this.oApp.exec("HIDE_EDITING_AREA_COVER");
//		this.oApp.exec("ENABLE_ALL_UI");
		this.oApp.exec("CLOSE_SUB_LAYER_QE");

		this.layer_hide(weEvent);
	},
		
	/**
	 * ¾îÇÃ¸®ÄÉÀÌ¼ÇÀÌ ÁØºñ´Ü°èÀÏ¶§ ½ÇÇàµÇ´Â ÀÌº¥Æ®
	 */
	$LOCAL_BEFORE_FIRST : function(sMsg) {
		if (!sMsg.match(/OPEN_QE_LAYER/)) { // (sMsg == "$ON_CLOSE_QE_LAYER" && !this.currentEle)
			this.oApp.acceptLocalBeforeFirstAgain(this, true);
			if(sMsg.match(/REGISTER_HOTKEY/)){
				return true;
			}
			
			return false;
		}
		
		this.woEditor = jindo.$Element(this.oApp.elEditingAreaContainer);
		this.woStandard = jindo.$Element(this.oApp.htOptions.elAppContainer).offset();
		this._qe_wrap = jindo.$$.getSingle("DIV.quick_wrap", this.oApp.htOptions.elAppContainer);
		
		var that = this;
		
		new jindo.DragArea(this._qe_wrap, {
			sClassName : 'q_dragable',   
			bFlowOut : false,
			nThreshold : 1
		}).attach({
			beforeDrag : function(oCustomEvent) {
				oCustomEvent.elFlowOut = oCustomEvent.elArea.parentNode;
			},
			dragStart: function(oCustomEvent){
				if(!jindo.$Element(oCustomEvent.elDrag).hasClass('se2_qmax')){
					oCustomEvent.elDrag = oCustomEvent.elDrag.parentNode;
				}
				that.oApp.exec("SHOW_EDITING_AREA_COVER");
			},
			dragEnd : function(oCustomEvent){
				that.changeFixedMode();
				that._in_event = false;
				//if(that._currentType=="review"||that._currentType=="table"){	// [SMARTEDITORSUS-153] ÀÌ¹ÌÁö Äü ¿¡µðÅÍµµ °°Àº ·ÎÁ÷À¸·Î Ã³¸®ÇÏµµ·Ï ¼öÁ¤
					var richEle = jindo.$Element(oCustomEvent.elDrag);
					that._environmentData[that._currentType].position = [richEle.css("top"),richEle.css("left")];
				//}
				that.oApp.exec("HIDE_EDITING_AREA_COVER");
			}
		});
		
		var imgFn = jindo.$Fn(this.toggle,this).bind("img");
		var tableFn = jindo.$Fn(this.toggle,this).bind("table");
		
		jindo.$Fn(imgFn,this).attach(jindo.$$.getSingle(".q_open_img_fold", this.oApp.htOptions.elAppContainer),"click");
		jindo.$Fn(imgFn,this).attach(jindo.$$.getSingle(".q_open_img_full", this.oApp.htOptions.elAppContainer),"click");
		
		jindo.$Fn(tableFn,this).attach(jindo.$$.getSingle(".q_open_table_fold", this.oApp.htOptions.elAppContainer),"click");
		jindo.$Fn(tableFn,this).attach(jindo.$$.getSingle(".q_open_table_full", this.oApp.htOptions.elAppContainer),"click");  
	},
	/**
	 * ·¹ÀÌ¾îÀÇ ÃÖ´ëÈ­/ÃÖ¼ÒÈ­¸¦ Åä±Û¸µ ÇÏ´Â ÇÔ¼ö.
	 * @param {String} sType(table|img)
	 * @param {jindo.$Event} weEvent
	 */
	toggle : function(sType,weEvent){
		sType = this._currentType;
//		var oBefore = jindo.$Element(jindo.$$.getSingle("._"+this._environmentData[sType].type,this.currentEle));
//		var beforeX = oBefore.css("left");
//		var beforeY = oBefore.css("top");
		
		this.oApp.exec("CLOSE_QE_LAYER", [weEvent]);
		
		if(this._environmentData[sType].type=="full"){
			this._environmentData[sType].type = "fold";
		}else{
			this._environmentData[sType].type = "full";
		}
		
		// [SMARTEDITORSUS-1028][SMARTEDITORSUS-1517] QuickEditor ¼³Á¤ API °³¼±À¸·Î, submit ÀÌÈÄ ¹ß»ýÇÏ°Ô µÇ´Â beforeunload ÀÌº¥Æ® ´ë½Å È£Ãâ ½ÃÁ¡ º¯°æ
		// QuickEditor¸¦ Á¢°í ÆîÄ¥ ¶§¸¶´Ù API Åë½ÅÀ» °ÅÄ¡±â ¶§¹®¿¡ submitÀÌ³ª beforeunload¿¡ ±¸¾Ö¹ÞÁö ¾Ê°í ¾ÈÁ¤ÀûÀÎ µ¥ÀÌÅÍ ÀúÀå °¡´É
		if (!this._environmentData || !this._bUseConfig) {
			return;
		}
		
		jindo.$Ajax(this._sAddTextAjaxUrl,{
			type : "jsonp",
			onload: function(){}
		}).request({
			text_key :"qeditor_fold",
			text_data : "{table:'"+this._environmentData["table"]["type"]+"',img:'"+this._environmentData["img"]["type"]+"',review:'"+this._environmentData["review"]["type"]+"'}" 
		});
		// --[SMARTEDITORSUS-1028][SMARTEDITORSUS-1517]
		
//		this.positionCopy(beforeX,beforeY,this._environmentData[sType].type);
				
		this.oApp.exec("OPEN_QE_LAYER", [this.targetEle,this.currentEle,sType]);
		this._in_event = false;
		weEvent.stop(jindo.$Event.CANCEL_DEFAULT);
	},
	/**
	 * Åä±Û¸µ½Ã Àü¿¡ ¿¤¸®¸ÕÆ®¿¡ À§Ä¡¸¦ Ä«ÇÇÇÏ´Â ÇÔ¼ö.
	 * @param {Number} beforeX
	 * @param {Number} beforeY
	 * @param {Element} sAfterEle
	 */
	positionCopy:function(beforeX, beforeY, sAfterEle){
		jindo.$Element(jindo.$$.getSingle("._"+sAfterEle,this.currentEle)).css({
			top : beforeY,
			left : beforeX
		});
	},
	/**
	 * ·¹ÀÌ¾î¸¦ °íÁ¤À¸·Î ÇÒ¶§ ½ÇÇàµÇ´Â ÇÔ¼ö.
	 */
	changeFixedMode : function(){
		this._environmentData[this._currentType].isFixed = true;
	},
	/**
	 * ¿¡µðÆÃ ¿µ¿ª¿¡¼­ keyupÇÒ¶§ ½ÇÇàµÇ´Â ÇÔ¼ö.
	 * @param {jindo.$Event} weEvent
	 */
/*
	$ON_EVENT_EDITING_AREA_KEYUP:function(weEvent){
		if(this._currentType&&(!this._in_event)&&this._environmentData[this._currentType].isOpen){
			this.oApp.exec("CLOSE_QE_LAYER", [weEvent]);
		}
		this._in_event = false;
	},
*/
	$ON_HIDE_ACTIVE_LAYER : function(){
		this.oApp.exec("CLOSE_QE_LAYER");
	},

	/**
	 * ¿¡µðÆÃ ¿µ¿ª¿¡¼­ mousedownÇÒ¶§ ½ÇÇàµÇ´Â ÇÔ¼ö.
	 * @param {jindo.$Event} weEvent
	 */
	$ON_EVENT_EDITING_AREA_MOUSEDOWN:function(weEvent){
		if(this._currentType&&(!this._in_event)&&this._environmentData[this._currentType].isOpen){
			this.oApp.exec("CLOSE_QE_LAYER", [weEvent]);
		}
		this._in_event = false;
	},
	/**
	 * ¿¡µðÆÃ ¿µ¿ª¿¡¼­ mousewheelÇÒ¶§ ½ÇÇàµÇ´Â ÇÔ¼ö.
	 * @param {jindo.$Event} weEvent
	 */
	$ON_EVENT_EDITING_AREA_MOUSEWHEEL:function(weEvent){
		if(this._currentType&&(!this._in_event)&&this._environmentData[this._currentType].isOpen){
			this.oApp.exec("CLOSE_QE_LAYER", [weEvent]);
		}
		this._in_event = false;
	},
	/**
	 * ·¹ÀÌ¾î¸¦ ¶ç¿ì´Âµ¥ ·¹ÀÌ¾î°¡ table(ÅÛÇÃ¸´),imgÀÎÁö¸¦ È®ÀÎÇÏ¿© id¸¦ ¹ÝÈ¯ÇÏ´Â ÇÔ¼ö.
	 * @param {Element} oEle
	 * @return {String} layer id
	 */
	get_type : function(oEle){
		var tagName = oEle.tagName.toLowerCase();
		
		if(this.waTableTagNames.has(tagName)){
			return "table";
		}else if(tagName=="img"){
			return "img";
		}
	},
	/**
	 * Äü¿¡µðÅÍ¿¡¼­ keyup½Ã ½ÇÇàµÇ´Â ÀÌº¥Æ®
	 */
	$ON_QE_IN_KEYUP : function(){
		this._in_event = true;
	},
	/**
	 * Äü¿¡µðÅÍ¿¡¼­ mousedown½Ã ½ÇÇàµÇ´Â ÀÌº¥Æ®
	 */
	$ON_QE_IN_MOUSEDOWN : function(){
		this._in_event = true;
	},
	/**
	 * Äü¿¡µðÅÍ¿¡¼­ mousewheel½Ã ½ÇÇàµÇ´Â ÀÌº¥Æ®
	 */
	$ON_QE_IN_MOUSEWHEEL : function(){
		this._in_event = true;
	},
	/**
	 * ·¹ÀÌ¾î¸¦ ¼û±â´Â ÇÔ¼ö.
	 * @param {jindo.$Event} weEvent
	 */
	layer_hide : function(weEvent){
		this.setOpenType(this._currentType,false);
		
		jindo.$Element(jindo.$$.getSingle("._"+this._environmentData[this._currentType].type,this.currentEle)).hide();
	},
	/**
	 * ´Ê°Ô ÀÌº¥Æ® ¹ÙÀÎµù ÇÏ´Â ÇÔ¼ö.
	 * ·¹ÀÌ¾î°¡ Ã³À½ ¶ã ¶§ ÀÌº¥Æ®¸¦ µî·ÏÇÑ´Ù.
	 */
	lazy_common : function(){
		this.oApp.registerBrowserEvent(jindo.$(this._qe_wrap), "keyup", "QE_IN_KEYUP");
		this.oApp.registerBrowserEvent(jindo.$(this._qe_wrap), "mousedown", "QE_IN_MOUSEDOWN");
		this.oApp.registerBrowserEvent(jindo.$(this._qe_wrap), "mousewheel", "QE_IN_MOUSEWHEEL");
		this.lazy_common = function(){};
	},
	/**
	 * ·¹ÀÌ¾î¸¦ º¸¿©ÁÖ´Â ÇÔ¼ö.
	 * @param {String} sType
	 * @param {Element} oEle
	 */
	layer_show : function(sType,oEle){
		this._currentType = sType;
		this.setOpenType(this._currentType,true);
		var  layer = jindo.$$.getSingle("._"+this._environmentData[this._currentType].type,this.currentEle);
		jindo.$Element(layer)
			.show()
			.css( this.get_position_layer(oEle , layer) );
			
			
		this.lazy_common();
	},
	/**
	 * ·¹ÀÌ¾îÀÇ À§Ä¡¸¦ ¹ÝÈ¯ ÇÏ´Â ÇÔ¼ö
	 *		°íÁ¤ »óÅÂ°¡ ¾Æ´Ï°Å³ª ÃÖ¼ÒÈ­ »óÅÂÀÌ¸é ¿¤¸®¸ÕÆ® À§Ä¡¿¡ Äü¿¡µðÅÍ¸¦ ¶ç¿ì°í
	 *		°íÁ¤ »óÅÂÀÌ°í ÃÖ´ëÈ­ »óÅÂÀÌ¸é Ç¥³ª ±Û ¾ç½ÄÀº ÀúÀåµÈ À§Ä¡¿¡ ¶ç¿öÁÖ°í, ÀÌ¹ÌÁö´Â...?
	 * @param {Element} oEle
	 * @param {Element} oLayer
	 */
	get_position_layer : function(oEle , oLayer){
		if(!this.isCurrentFixed() || this._environmentData[this._currentType].type == "fold"){
			return this.calculateLayer(oEle , oLayer);
		}
		
		//if(this._currentType == "review" || this._currentType == "table"){	// [SMARTEDITORSUS-153] ÀÌ¹ÌÁö Äü ¿¡µðÅÍµµ °°Àº ·ÎÁ÷À¸·Î Ã³¸®ÇÏµµ·Ï ¼öÁ¤
			var position = this._environmentData[this._currentType].position;
			var nTop = parseInt(position[0], 10);
			var nAppHeight = this.getAppPosition().h;
			var nLayerHeight = jindo.$Element(oLayer).height();
		
			// [SMARTEDITORSUS-129] ÆíÁý ¿µ¿ª ³ôÀÌ¸¦ ÁÙ¿´À» ¶§ Äü¿¡µðÅÍ°¡ ¿µ¿ªÀ» ¹þ¾î³ªÁö ¾Êµµ·Ï Ã³¸®
			if((nTop + nLayerHeight + this.nYGap) > nAppHeight){
				nTop = nAppHeight - nLayerHeight;
				this._environmentData[this._currentType].position[0] = nTop;
			}
			
			return {
				top : nTop + "px",
				left :position[1]
			};	
		//}
		//return this.calculateLayer(null , oLayer);
	},
	/**
	 * ÇöÀç ·¹ÀÌ¾î°¡ °íÁ¤ÇüÅÂÀÎÁö ¹ÝÈ¯ÇÏ´Â ÇÔ¼ö.
	 */
	isCurrentFixed : function(){
		return this._environmentData[this._currentType].isFixed;
	},
	/**
	 * ·¹ÀÌ¾î¸¦ ¶ç¿ï À§Ä¡¸¦ °è»êÇÏ´Â ÇÔ¼ö.
	 * @param {Element} oEle
	 * @param {Element} oLayer
	 */
	calculateLayer : function(oEle, oLayer){
		/*
		 * ±âÁØÀ» ÇÑ±ºµ¥·Î ¸¸µé¾î¾ß ÇÔ.
		 * 1. ¿¡µðÅÍ´Â ÆäÀÌÁö
		 * 2. ¿¤¸®¸ÕÆ®´Â ¾È¿¡ ¿¡µðÆÃ ¿µ¿ª
		 * 3. ·¹ÀÌ¾î´Â ¿¡µðÆÃ ¿µ¿ª
		 * 
		 * ±âÁØÀº ÆäÀÌÁö·Î ÇÔ.
		 */
		var positionInfo = this.getPositionInfo(oEle, oLayer);
		
		return {
			top  : positionInfo.y + "px",
			left : positionInfo.x + "px"
		};
	},
	/**
	 * À§Ä¡¸¦ ¹ÝÈ¯ ÇÏ´Â ÇÔ¼ö.
	 * @param {Element} oEle
	 * @param {Element} oLayer
	 */
	getPositionInfo : function(oEle, oLayer){
		this.nYGap = jindo.$Agent().navigator().ie? -16 : -18;
		this.nXGap = 1;
		
		var oRevisePosition = {};

		var eleInfo = this.getElementPosition(oEle, oLayer);
		var appInfo = this.getAppPosition();
		var layerInfo = {
			w : jindo.$Element(oLayer).width(),
			h : jindo.$Element(oLayer).height()
		};

		if((eleInfo.x + layerInfo.w + this.nXGap) > appInfo.w){
			oRevisePosition.x = appInfo.w - layerInfo.w ; 
		}else{
			oRevisePosition.x = eleInfo.x + this.nXGap;
		}
		
		if((eleInfo.y + layerInfo.h + this.nYGap) > appInfo.h){
			oRevisePosition.y = appInfo.h - layerInfo.h - 2;
		}else{
			oRevisePosition.y = eleInfo.y + this.nYGap;
		}
		
		return {
			x : oRevisePosition.x ,
			y : oRevisePosition.y 
		};
	},
	/**
	 * ±âÁØ ¿¤¸®¸ÕÆ®ÀÇ À§Ä¡¸¦ ¹ÝÈ¯ÇÏ´Â ÇÔ¼ö
	 *		¿¤¸®¸ÕÆ®°¡ ÀÖ´Â °æ¿ì
	 * @param {Element} eEle
	 */
	getElementPosition : function(eEle, oLayer){
		var wEle, oOffset, nEleWidth, nEleHeight, nScrollX, nScrollY;
		
		if(eEle){
			wEle = jindo.$Element(eEle);
			oOffset = wEle.offset();
			nEleWidth = wEle.width();
			nEleHeight = wEle.height();
		}else{
			oOffset = {
				top : parseInt(oLayer.style.top, 10) - this.nYGap,
				left : parseInt(oLayer.style.left, 10) - this.nXGap
			};
			nEleWidth = 0;
			nEleHeight = 0;
		}

		var oAppWindow = this.oApp.getWYSIWYGWindow();
		
		if(typeof oAppWindow.scrollX == "undefined"){
			nScrollX = oAppWindow.document.documentElement.scrollLeft;
			nScrollY = oAppWindow.document.documentElement.scrollTop;
		}else{
			nScrollX = oAppWindow.scrollX;
			nScrollY = oAppWindow.scrollY;
		}

		var oEditotOffset = this.woEditor.offset();
		return {
			x : oOffset.left - nScrollX + nEleWidth,
			y : oOffset.top  - nScrollY + nEleHeight
		};
	},
	/**
	 * ¿¡µðÅÍÀÇ Å©±â °è»êÇÏ´Â ÇÔ¼ö.
	 */
	getAppPosition : function(){
		return {
			w : this.woEditor.width(),
			h : this.woEditor.height() 
		};
	}
	//@lazyload_js]
});
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the hotkey feature
 * @name hp_Hotkey.js
 */
nhn.husky.Hotkey = jindo.$Class({
	name : "Hotkey",

	$init : function(){
		this.oShortcut = shortcut;
	},
	
	$ON_ADD_HOTKEY : function(sHotkey, sCMD, aArgs, elTarget){
		if(!aArgs){aArgs = [];}
		
		var func = jindo.$Fn(this.oApp.exec, this.oApp).bind(sCMD, aArgs);
		this.oShortcut(sHotkey, elTarget).addEvent(func);		
	}
});
//}
/**
 * @classDescription shortcut
 * @author AjaxUI Lab - mixed
 */

function Shortcut(sKey,sId){
	var sKey = sKey.replace(/\s+/g,"");
	var store = Shortcut.Store;
	var action = Shortcut.Action;
	if(typeof sId === "undefined"&&sKey.constructor == String){
		store.set("document",sKey,document);
		return action.init(store.get("document"),sKey);
	}else if(sId.constructor == String&&sKey.constructor == String){
		store.set(sId,sKey,jindo.$(sId));
		return action.init(store.get(sId),sKey);
	}else if(sId.constructor != String&&sKey.constructor == String){
		var fakeId = "nonID"+new Date().getTime();
		fakeId = Shortcut.Store.searchId(fakeId,sId);
		store.set(fakeId,sKey,sId);
		return action.init(store.get(fakeId),sKey);
	}
	alert(sId+"´Â ¹Ýµå½Ã stringÀÌ°Å³ª  ¾ø¾î¾ß µË´Ï´Ù.");
};


Shortcut.Store = {
	anthorKeyHash:{},
	datas:{},
	currentId:"",
	currentKey:"",
	searchId:function(sId,oElement){
		jindo.$H(this.datas).forEach(function(oValue,sKey){
			if(oElement == oValue.element){
				sId = sKey;
				jindo.$H.Break();
			}
		});
		return sId;
	},
	set:function(sId,sKey,oElement){
		this.currentId = sId;
		this.currentKey = sKey;
		var idData = this.get(sId);
		this.datas[sId] =  idData?idData.createKey(sKey):new Shortcut.Data(sId,sKey,oElement);
	},
	get:function(sId,sKey){
		if(sKey){
			return this.datas[sId].keys[sKey];
		}else{
			return this.datas[sId];
		}
	},              
	reset:function(sId){
		var data = this.datas[sId];
		Shortcut.Helper.bind(data.func,data.element,"detach");
		
		delete this.datas[sId];		       
	},
	allReset: function(){
		jindo.$H(this.datas).forEach(jindo.$Fn(function(value,key) {
			this.reset(key); 
		},this).bind());
	}
};

Shortcut.Data = jindo.$Class({
	$init:function(sId,sKey,oElement){
		this.id = sId;
		this.element = oElement;
		this.func = jindo.$Fn(this.fire,this).bind();
		
		Shortcut.Helper.bind(this.func,oElement,"attach");
		this.keys = {};
		this.keyStemp = {};
		this.createKey(sKey);		
	},
	createKey:function(sKey){
		this.keyStemp[Shortcut.Helper.keyInterpretor(sKey)] = sKey;
		this.keys[sKey] = {};
		var data = this.keys[sKey];
		data.key = sKey;
		data.events = [];
		data.commonExceptions = [];
//		data.keyAnalysis = Shortcut.Helper.keyInterpretor(sKey);
		data.stopDefalutBehavior = true;
		
		return this;
	},
	getKeyStamp : function(eEvent){
		
		
		var sKey     = eEvent.keyCode || eEvent.charCode;
		var returnVal = "";
		
		returnVal += eEvent.altKey?"1":"0";
		returnVal += eEvent.ctrlKey?"1":"0";
		returnVal += eEvent.metaKey?"1":"0";
		returnVal += eEvent.shiftKey?"1":"0";
		returnVal += sKey;
		return returnVal;
	},
	fire:function(eEvent){
		eEvent = eEvent||window.eEvent;
		
		var oMatchKeyData = this.keyStemp[this.getKeyStamp(eEvent)];
		
		if(oMatchKeyData){
			this.excute(new jindo.$Event(eEvent),oMatchKeyData);
		}
		
	},
	excute:function(weEvent,sRawKey){
		var isExcute = true;
		var staticFun = Shortcut.Helper;
		var data = this.keys[sRawKey];
		
		if(staticFun.notCommonException(weEvent,data.commonExceptions)){
			jindo.$A(data.events).forEach(function(v){
				if(data.stopDefalutBehavior){
					var leng = v.exceptions.length;
					if(leng){
						for(var i=0;i<leng;i++){
							if(!v.exception[i](weEvent)){
								isExcute = false;
								break;
							}
						}
						if(isExcute){
							v.event(weEvent);
							if(jindo.$Agent().navigator().ie){
								var e = weEvent._event;
								e.keyCode = "";
								e.charCode = "";
							}
							weEvent.stop();
						}else{
							jindo.$A.Break();
						}
					}else{
						v.event(weEvent);
						if(jindo.$Agent().navigator().ie){
							var e = weEvent._event;
							e.keyCode = "";
							e.charCode = "";
						}
						weEvent.stop();
					}
				}
			});
		}
	},
	addEvent:function(fpEvent,sRawKey){
		var events = this.keys[sRawKey].events;
		if(!Shortcut.Helper.hasEvent(fpEvent,events)){
			events.push({
				event:fpEvent,
				exceptions:[]
			});
		};
	},
	addException:function(fpException,sRawKey){
		var commonExceptions = this.keys[sRawKey].commonExceptions;
		if(!Shortcut.Helper.hasException(fpException,commonExceptions)){
			commonExceptions.push(fpException);
		};
	},
	removeException:function(fpException,sRawKey){
		var commonExceptions = this.keys[sRawKey].commonExceptions;
		commonExceptions = jindo.$A(commonExceptions).filter(function(exception){
								 return exception!=fpException;
						   }).$value();
	},
	removeEvent:function(fpEvent,sRawKey){
		var events = this.keys[sRawKey].events;
		events = jindo.$A(events).filter(function(event) {
					 return event!=fpEvent;
				 }).$value();
		this.unRegister(sRawKey);
	},
	unRegister:function(sRawKey){
		var aEvents = this.keys[sRawKey].events;
		
		if(aEvents.length)
			delete this.keys[sRawKey];
			
		var hasNotKey = true;
		for(var i in this.keys){
			hasNotKey  =false;
			break;
		}
		
		if(hasNotKey){
			Shortcut.Helper.bind(this.func,this.element,"detach");
			delete Shortcut.Store.datas[this.id];
		}
		
	},
	startDefalutBehavior: function(sRawKey){
		 this._setDefalutBehavior(sRawKey,false);
	},
	stopDefalutBehavior: function(sRawKey){
		 this._setDefalutBehavior(sRawKey,true);
	},
	_setDefalutBehavior: function(sRawKey,bType){
		this.keys[sRawKey].stopDefalutBehavior = bType;
	}
});

Shortcut.Helper = {
	keyInterpretor:function(sKey){
		var keyArray = sKey.split("+");
		var wKeyArray = jindo.$A(keyArray);
		
		var returnVal = "";
		
		returnVal += wKeyArray.has("alt")?"1":"0";
		returnVal += wKeyArray.has("ctrl")?"1":"0";
		returnVal += wKeyArray.has("meta")?"1":"0";
		returnVal += wKeyArray.has("shift")?"1":"0";
		
		var wKeyArray = wKeyArray.filter(function(v){
			return !(v=="alt"||v=="ctrl"||v=="meta"||v=="shift")
		});
		var key = wKeyArray.$value()[0];
		
		if(key){
			
			var sKey  = Shortcut.Store.anthorKeyHash[key.toUpperCase()]||key.toUpperCase().charCodeAt(0);
			returnVal += sKey;
		}
		
		return returnVal;
	},
	notCommonException:function(e,exceptions){
		var leng = exceptions.length;
		for(var i=0;i<leng ;i++){
			if(!exceptions[i](e))
				return false;
		}
		return true;
	},
	hasEvent:function(fpEvent,aEvents){
		var nLength = aEvents.length;
		for(var i=0; i<nLength; ++i){
			if(aEvents.event==fpEvent){
				return true;
			}
		};
		return false;
	},
	hasException:function(fpException,commonExceptions){
		var nLength = commonExceptions.length;
		for(var i=0; i<nLength; ++i){
			if(commonExceptions[i]==fpException){
				return true;
			}
		};
		return false;
	},
	bind:function(wfFunc,oElement,sType){
	   if(sType=="attach"){
	   	 domAttach(oElement,"keydown",wfFunc);
	   }else{
	   	 domDetach(oElement,"keydown",wfFunc);
	   }
	}
	
};

(function domAttach (){
	if(document.addEventListener){
		window.domAttach = function(dom,ev,fn){
			dom.addEventListener(ev, fn, false);		
		}
	}else{
		window.domAttach = function(dom,ev,fn){
			dom.attachEvent("on"+ev, fn);		
		}
	}
})();

(function domDetach (){
	if(document.removeEventListener){
		window.domDetach = function(dom,ev,fn){
			dom.removeEventListener(ev, fn, false);		
		}
	}else{
		window.domDetach = function(dom,ev,fn){
			dom.detachEvent("on"+ev, fn);		
		}
	}
})();



Shortcut.Action ={
	init:function(oData,sRawKey){
		this.dataInstance = oData;
		this.rawKey = sRawKey;
		return this;
	},
	addEvent:function(fpEvent){
		this.dataInstance.addEvent(fpEvent,this.rawKey);		                                        
		return this;
	},
	removeEvent:function(fpEvent){
		this.dataInstance.removeEvent(fpEvent,this.rawKey);
		return this;
	},
	addException : function(fpException){
		this.dataInstance.addException(fpException,this.rawKey);
		return this;
	},
	removeException : function(fpException){
		this.dataInstance.removeException(fpException,this.rawKey);
		return this;
	},
//	addCommonException : function(fpException){
//		return this;
//	},
//	removeCommonEexception : function(fpException){
//		return this;
//	},
	startDefalutBehavior: function(){ 
		this.dataInstance.startDefalutBehavior(this.rawKey);
		return this;
	},
	stopDefalutBehavior: function(){ 
		this.dataInstance.stopDefalutBehavior(this.rawKey);
		return this;
	},
	resetElement: function(){ 
		Shortcut.Store.reset(this.dataInstance.id);
		return this;
	},
	resetAll: function(){
		Shortcut.Store.allReset();
		return this;
	}
};

(function (){
	Shortcut.Store.anthorKeyHash = {
		BACKSPACE : 8,
		TAB		  : 9,
		ENTER	  : 13,
		ESC		  : 27,
		SPACE	  : 32,
		PAGEUP	  : 33,
		PAGEDOWN  : 34,
		END		  : 35,
		HOME	  : 36,
		LEFT	  : 37,
		UP		  : 38,
		RIGHT	  : 39,
		DOWN	  : 40,
		DEL	  	  : 46,
		COMMA	  : 188,//(,)
		PERIOD	  : 190,//(.)
		SLASH	  : 191//(/),
	};
	var hash = Shortcut.Store.anthorKeyHash;
	for(var i=1 ; i < 13 ; i++){
		Shortcut.Store.anthorKeyHash["F"+i] = i+111;
	}
	var agent = jindo.$Agent().navigator();
	if(agent.ie||agent.safari||agent.chrome){
		hash.HYPHEN = 189;//(-)
		hash.EQUAL  = 187;//(=)
	}else{
		hash.HYPHEN = 109;
		hash.EQUAL  = 61;
	}
})();
var shortcut = Shortcut;
if(typeof window.nhn=='undefined') window.nhn = {};

/**
 * @fileOverview This file contains a function that takes care of the draggable layers
 * @name N_DraggableLayer.js
 */
nhn.DraggableLayer = jindo.$Class({
	$init : function(elLayer, oOptions){
		this.elLayer = elLayer;
		
		this.setOptions(oOptions);

		this.elHandle = this.oOptions.elHandle;
		
		elLayer.style.display = "block";
		elLayer.style.position = "absolute";
		elLayer.style.zIndex = "9999";

		this.aBasePosition = this.getBaseOffset(elLayer);

		// "number-ize" the position and set it as inline style. (the position could've been set as "auto" or set by css, not inline style)
		var nTop = (this.toInt(jindo.$Element(elLayer).offset().top) - this.aBasePosition.top);
		var nLeft = (this.toInt(jindo.$Element(elLayer).offset().left) - this.aBasePosition.left);

		var htXY = this._correctXY({x:nLeft, y:nTop});
		
		elLayer.style.top = htXY.y+"px";
		elLayer.style.left = htXY.x+"px";

		this.$FnMouseDown = jindo.$Fn(jindo.$Fn(this._mousedown, this).bind(elLayer), this);
		this.$FnMouseMove = jindo.$Fn(jindo.$Fn(this._mousemove, this).bind(elLayer), this);
		this.$FnMouseUp = jindo.$Fn(jindo.$Fn(this._mouseup, this).bind(elLayer), this);

		this.$FnMouseDown.attach(this.elHandle, "mousedown");
		this.elHandle.ondragstart = new Function('return false');
		this.elHandle.onselectstart = new Function('return false');
	},

	_mousedown : function(elLayer, oEvent){
		if(oEvent.element.tagName == "INPUT") return;

		this.oOptions.fnOnDragStart();
		
		this.MouseOffsetY = (oEvent.pos().clientY-this.toInt(elLayer.style.top)-this.aBasePosition['top']);
		this.MouseOffsetX = (oEvent.pos().clientX-this.toInt(elLayer.style.left)-this.aBasePosition['left']);

		this.$FnMouseMove.attach(elLayer.ownerDocument, "mousemove");
		this.$FnMouseUp.attach(elLayer.ownerDocument, "mouseup");

		this.elHandle.style.cursor = "move";
	},

	_mousemove : function(elLayer, oEvent){
		var nTop = (oEvent.pos().clientY-this.MouseOffsetY-this.aBasePosition['top']);
		var nLeft = (oEvent.pos().clientX-this.MouseOffsetX-this.aBasePosition['left']);

		var htXY = this._correctXY({x:nLeft, y:nTop});

		elLayer.style.top = htXY.y + "px";
		elLayer.style.left = htXY.x + "px";
	},

	_mouseup : function(elLayer, oEvent){
		this.oOptions.fnOnDragEnd();

		this.$FnMouseMove.detach(elLayer.ownerDocument, "mousemove");
		this.$FnMouseUp.detach(elLayer.ownerDocument, "mouseup");
		
		this.elHandle.style.cursor = "";
	},
	
	_correctXY : function(htXY){
		var nLeft = htXY.x;
		var nTop = htXY.y;
		
		if(nTop<this.oOptions.nMinY) nTop = this.oOptions.nMinY;
		if(nTop>this.oOptions.nMaxY) nTop = this.oOptions.nMaxY;

		if(nLeft<this.oOptions.nMinX) nLeft = this.oOptions.nMinX;
		if(nLeft>this.oOptions.nMaxX) nLeft = this.oOptions.nMaxX;
		
		return {x:nLeft, y:nTop};
	},
	
	toInt : function(num){
		var result = parseInt(num);
		return result || 0;
	},
	
	findNonStatic : function(oEl){
		if(!oEl) return null;
		if(oEl.tagName == "BODY") return oEl;
		
		if(jindo.$Element(oEl).css("position").match(/absolute|relative/i)) return oEl;

		return this.findNonStatic(oEl.offsetParent);
	},
	
	getBaseOffset : function(oEl){
		var oBase = this.findNonStatic(oEl.offsetParent) || oEl.ownerDocument.body;
		var tmp = jindo.$Element(oBase).offset();

		return {top: tmp.top, left: tmp.left};
	},
	
	setOptions : function(htOptions){
		this.oOptions = htOptions || {};
		this.oOptions.bModal = this.oOptions.bModal || false;
		this.oOptions.elHandle = this.oOptions.elHandle || this.elLayer;
		this.oOptions.nMinX = this.oOptions.nMinX || -999999;
		this.oOptions.nMinY = this.oOptions.nMinY || -999999;
		this.oOptions.nMaxX = this.oOptions.nMaxX || 999999;
		this.oOptions.nMaxY = this.oOptions.nMaxY || 999999;
		this.oOptions.fnOnDragStart = this.oOptions.fnOnDragStart || function(){};
		this.oOptions.fnOnDragEnd = this.oOptions.fnOnDragEnd || function(){};
	}
});
/*[
 * TOGGLE_ACTIVE_LAYER
 *
 * ¾×Æ¼ºê ·¹ÀÌ¾î°¡ È­¸é¿¡ º¸ÀÌ´Â ¿©ºÎ¸¦ Åä±Û ÇÑ´Ù.
 *
 * oLayer HTMLElement ·¹ÀÌ¾î·Î »ç¿ëÇÒ HTML Element
 * sOnOpenCmd string È­¸é¿¡ º¸ÀÌ´Â °æ¿ì ¹ß»ý ÇÒ ¸Þ½ÃÁö(¿É¼Ç)
 * aOnOpenParam array sOnOpenCmd¿Í ÇÔ²² ³Ñ°ÜÁÙ ÆÄ¶ó¹ÌÅÍ(¿É¼Ç)
 * sOnCloseCmd string ÇØ´ç ·¹ÀÌ¾î°¡ È­¸é¿¡¼­ ¼û°ÜÁú ¶§ ¹ß»ý ÇÒ ¸Þ½ÃÁö(¿É¼Ç)
 * aOnCloseParam array sOnCloseCmd¿Í ÇÔ²² ³Ñ°ÜÁÙ ÆÄ¶ó¹ÌÅÍ(¿É¼Ç)
 *
---------------------------------------------------------------------------]*/
/*[
 * SHOW_ACTIVE_LAYER
 *
 * ¾×Æ¼ºê ·¹ÀÌ¾î°¡ È­¸é¿¡ º¸ÀÌ´Â ¿©ºÎ¸¦ Åä±Û ÇÑ´Ù.
 *
 * oLayer HTMLElement ·¹ÀÌ¾î·Î »ç¿ëÇÒ HTML Element
 * sOnCloseCmd string ÇØ´ç ·¹ÀÌ¾î°¡ È­¸é¿¡¼­ ¼û°ÜÁú ¶§ ¹ß»ý ÇÒ ¸Þ½ÃÁö(¿É¼Ç)
 * aOnCloseParam array sOnCloseCmd¿Í ÇÔ²² ³Ñ°ÜÁÙ ÆÄ¶ó¹ÌÅÍ(¿É¼Ç)
 *
---------------------------------------------------------------------------]*/
/*[
 * 	HIDE_ACTIVE_LAYER
 *
 * ÇöÀç È­¸é¿¡ º¸ÀÌ´Â ¾×Æ¼ºê ·¹ÀÌ¾î¸¦ È­¸é¿¡¼­ ¼û±ä´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc ÇÑ¹ø¿¡ ÇÑ°³¸¸ È­¸é¿¡ º¸¿©¾ß ÇÏ´Â ·¹ÀÌ¾î¸¦ °ü¸®ÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.ActiveLayerManager = jindo.$Class({
	name : "ActiveLayerManager",
	oCurrentLayer : null,
	
	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator();
	},
	
	$ON_TOGGLE_ACTIVE_LAYER : function(oLayer, sOnOpenCmd, aOnOpenParam, sOnCloseCmd, aOnCloseParam){
		if(oLayer == this.oCurrentLayer){
			this.oApp.exec("HIDE_ACTIVE_LAYER", []);
		}else{
			this.oApp.exec("SHOW_ACTIVE_LAYER", [oLayer, sOnCloseCmd, aOnCloseParam]);
			if(sOnOpenCmd){this.oApp.exec(sOnOpenCmd, aOnOpenParam);}
		}
	},
	
	$ON_SHOW_ACTIVE_LAYER : function(oLayer, sOnCloseCmd, aOnCloseParam){
		oLayer = jindo.$(oLayer);

		var oPrevLayer = this.oCurrentLayer;
		if(oLayer == oPrevLayer){return;}

		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
		
		this.sOnCloseCmd = sOnCloseCmd;
		this.aOnCloseParam = aOnCloseParam;

		oLayer.style.display = "block";
		this.oCurrentLayer = oLayer;
		this.oApp.exec("ADD_APP_PROPERTY", ["oToolBarLayer", this.oCurrentLayer]);
	},

	$ON_HIDE_ACTIVE_LAYER : function(){
		var oLayer = this.oCurrentLayer;
		if(!oLayer){return;}
		oLayer.style.display = "none";
		this.oCurrentLayer = null;
		if(this.sOnCloseCmd){
			this.oApp.exec(this.sOnCloseCmd, this.aOnCloseParam);
		}

		if(!!this.oNavigator.msafari){
			this.oApp.getWYSIWYGWindow().focus();
		}
	},
	
	$ON_HIDE_ACTIVE_LAYER_IF_NOT_CHILD : function(el){
		var elTmp = el;
		while(elTmp){
			if(elTmp == this.oCurrentLayer){
				return;
			}
			elTmp = elTmp.parentNode;
		}
		this.oApp.exec("HIDE_ACTIVE_LAYER");
	},

	// for backward compatibility only.
	// use HIDE_ACTIVE_LAYER instead!
	$ON_HIDE_CURRENT_ACTIVE_LAYER : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	}
});
/*[
 * SHOW_DIALOG_LAYER
 *
 * ´ÙÀÌ¾ó·Î±× ·¹ÀÌ¾î¸¦ È­¸é¿¡ º¸¿©ÁØ´Ù.
 *
 * oLayer HTMLElement ´ÙÀÌ¾ó·Î±× ·¹ÀÌ¾î·Î »ç¿ë ÇÒ HTML ¿¤¸®¸ÕÆ®
 *
---------------------------------------------------------------------------]*/
/*[
 * HIDE_DIALOG_LAYER
 *
 * ´ÙÀÌ¾ó·Î±× ·¹ÀÌ¾î¸¦ È­¸é¿¡ ¼û±ä´Ù.
 *
 * oLayer HTMLElement ¼û±æ ´ÙÀÌ¾ó·Î±× ·¹ÀÌ¾î¿¡ ÇØ´ç ÇÏ´Â HTML ¿¤¸®¸ÕÆ®
 *
---------------------------------------------------------------------------]*/
/*[
 * HIDE_LAST_DIALOG_LAYER
 *
 * ¸¶Áö¸·À¸·Î È­¸é¿¡ Ç¥½ÃÇÑ ´ÙÀÌ¾ó·Î±× ·¹ÀÌ¾î¸¦ ¼û±ä´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/*[
 * HIDE_ALL_DIALOG_LAYER
 *
 * Ç¥½Ã ÁßÀÎ ¸ðµç ´ÙÀÌ¾ó·Î±× ·¹ÀÌ¾î¸¦ ¼û±ä´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc µå·¡±×°¡ °¡´ÉÇÑ ·¹ÀÌ¾î¸¦ ÄÁÆ®·Ñ ÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.DialogLayerManager = jindo.$Class({
	name : "DialogLayerManager",
	aMadeDraggable : null,
	aOpenedLayers : null,

	$init : function(){
		this.aMadeDraggable = [];
		this.aDraggableLayer = [];
		this.aOpenedLayers = [];
	},
	
	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator();
	},
	
	//@lazyload_js SHOW_DIALOG_LAYER,TOGGLE_DIALOG_LAYER:N_DraggableLayer.js[
	$ON_SHOW_DIALOG_LAYER : function(elLayer, htOptions){
		elLayer = jindo.$(elLayer);
		htOptions = htOptions || {};
		
		if(!elLayer){return;}

		if(jindo.$A(this.aOpenedLayers).has(elLayer)){return;}

		this.oApp.exec("POSITION_DIALOG_LAYER", [elLayer]);
		
		this.aOpenedLayers[this.aOpenedLayers.length] = elLayer;

		var oDraggableLayer;
		var nIdx = jindo.$A(this.aMadeDraggable).indexOf(elLayer);

		if(nIdx == -1){
			oDraggableLayer = new nhn.DraggableLayer(elLayer, htOptions);
			this.aMadeDraggable[this.aMadeDraggable.length] = elLayer;
			this.aDraggableLayer[this.aDraggableLayer.length] = oDraggableLayer;
		}else{
			if(htOptions){
				oDraggableLayer = this.aDraggableLayer[nIdx];
				oDraggableLayer.setOptions(htOptions);
			}
			elLayer.style.display = "block";
		}
		
		if(htOptions.sOnShowMsg){
			this.oApp.exec(htOptions.sOnShowMsg, htOptions.sOnShowParam);
		}
	},

	$ON_HIDE_LAST_DIALOG_LAYER : function(){
		this.oApp.exec("HIDE_DIALOG_LAYER", [this.aOpenedLayers[this.aOpenedLayers.length-1]]);
	},

	$ON_HIDE_ALL_DIALOG_LAYER : function(){
		for(var i=this.aOpenedLayers.length-1; i>=0; i--){
			this.oApp.exec("HIDE_DIALOG_LAYER", [this.aOpenedLayers[i]]);
		}
	},

	$ON_HIDE_DIALOG_LAYER : function(elLayer){
		elLayer = jindo.$(elLayer);

		if(elLayer){elLayer.style.display = "none";}
		this.aOpenedLayers = jindo.$A(this.aOpenedLayers).refuse(elLayer).$value();
		
		if(!!this.oNavigator.msafari){
			this.oApp.getWYSIWYGWindow().focus();
		}
	},

	$ON_TOGGLE_DIALOG_LAYER : function(elLayer, htOptions){
		if(jindo.$A(this.aOpenedLayers).indexOf(elLayer)){
			this.oApp.exec("SHOW_DIALOG_LAYER", [elLayer, htOptions]);
		}else{
			this.oApp.exec("HIDE_DIALOG_LAYER", [elLayer]);
		}
	},
	
	$ON_SET_DIALOG_LAYER_POSITION : function(elLayer, nTop, nLeft){
		elLayer.style.top = nTop;
		elLayer.style.left = nLeft;
	}
	//@lazyload_js]
});
//{
/**
 * @fileOverview This file contains 
 * @name hp_LazyLoader.js
 */
nhn.husky.LazyLoader = jindo.$Class({
	name : "LazyLoader",

	// sMsg : KEY
	// contains htLoadingInfo : {}
	htMsgInfo : null,
	
	// contains objects
	//	sURL : HTML to be loaded
	//	elTarget : where to append the HTML
	//	sSuccessCallback : message name
	//	sFailureCallback : message name
	//	nLoadingStatus : 
	//		0 : loading not started
	//		1 : loading started
	//		2 : loading ended
	aLoadingInfo : null,

	// aToDo : [{aMsgs: ["EXECCOMMAND"], sURL: "http://127.0.0.1/html_snippet.txt", elTarget: elPlaceHolder}, ...]
	$init : function(aToDo){
		this.htMsgInfo = {};
		this.aLoadingInfo = [];
		this.aToDo = aToDo;
	},
	
	$ON_MSG_APP_READY : function(){
		for(var i=0; i<this.aToDo.length; i++){
			var htToDoDetail = this.aToDo[i];
			this._createBeforeHandlersAndSaveURLInfo(htToDoDetail.oMsgs, htToDoDetail.sURL, htToDoDetail.elTarget, htToDoDetail.htOptions);
		}
	},

	$LOCAL_BEFORE_ALL : function(sMsgHandler, aParams){
		var sMsg = sMsgHandler.replace("$BEFORE_", "");

		var htCurMsgInfo = this.htMsgInfo[sMsg];

		// ignore current message
		if(htCurMsgInfo.nLoadingStatus == 1){return true;}
		
		// the HTML was loaded before(probably by another message), remove the loading handler and re-send the message
		if(htCurMsgInfo.nLoadingStatus == 2){
			this[sMsgHandler] = function(){
				this._removeHandler(sMsgHandler);
				this.oApp.delayedExec(sMsg, aParams, 0);
				return false;
			};
			return true;
		}

		htCurMsgInfo.bLoadingStatus = 1;
		(new jindo.$Ajax(htCurMsgInfo.sURL, {
			onload : jindo.$Fn(this._onload, this).bind(sMsg, aParams)
		})).request();

		return true;
	},

	_onload : function(sMsg, aParams, oResponse){
		if(oResponse._response.readyState == 4) {
			this.htMsgInfo[sMsg].elTarget.innerHTML = oResponse.text();
			this.htMsgInfo[sMsg].nLoadingStatus = 2;
			this._removeHandler("$BEFORE_"+sMsg);
			this.oApp.exec("sMsg", aParams);
		}else{
			this.oApp.exec(this.htMsgInfo[sMsg].sFailureCallback, []);
		}
	},

	_removeHandler : function(sMsgHandler){
		delete this[sMsgHandler];
		this.oApp.createMessageMap(sMsgHandler);
	},
	
	_createBeforeHandlersAndSaveURLInfo : function(oMsgs, sURL, elTarget, htOptions){
		htOptions = htOptions || {};

		var htNewInfo = {
			sURL : sURL,
			elTarget : elTarget,
			sSuccessCallback : htOptions.sSuccessCallback,
			sFailureCallback : htOptions.sFailureCallback,
			nLoadingStatus : 0
		};
		this.aLoadingInfo[this.aLoadingInfo.legnth] = htNewInfo;

		// extract msgs if plugin is given
		if(!(oMsgs instanceof Array)){
			var oPlugin = oMsgs;

			oMsgs = [];
			var htMsgAdded = {};
			for(var sFunctionName in oPlugin){
				if(sFunctionName.match(/^\$(BEFORE|ON|AFTER)_(.+)$/)){
					var sMsg = RegExp.$2;
					if(sMsg == "MSG_APP_READY"){continue;}

					if(!htMsgAdded[sMsg]){
						oMsgs[oMsgs.length] = RegExp.$2;
						htMsgAdded[sMsg] = true;
					}
				}
			}
		}

		for(var i=0; i<oMsgs.length; i++){
			// create HTML loading handler
			var sTmpMsg = "$BEFORE_"+oMsgs[i];
			this[sTmpMsg] = function(){return false;};
			this.oApp.createMessageMap(sTmpMsg);

			// add loading info
			this.htMsgInfo[oMsgs[i]] = htNewInfo;
		}
	}
});
//}
//{
/**
 * @fileOverview This file contains Husky plugin that maps a message code to the actual message
 * @name hp_MessageManager.js
 */
nhn.husky.MessageManager = jindo.$Class({
	name : "MessageManager",

	oMessageMap : null,
	sLocale : "ko_KR",
	
	$init : function(oMessageMap, sLocale){
		switch(sLocale) {
			case "ja_JP" :
				this.oMessageMap = oMessageMap_ja_JP;
				break;
			case "en_US" :
				this.oMessageMap = oMessageMap_en_US;
				break;
			case "zh_CN" :
				this.oMessageMap = oMessageMap_zh_CN;
				break;
			default :  // Korean
				this.oMessageMap = oMessageMap;
				break;
		}
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["$MSG", jindo.$Fn(this.getMessage, this).bind()]);
	},

	getMessage : function(sMsg){
		if(this.oMessageMap[sMsg]){return unescape(this.oMessageMap[sMsg]);}
		return sMsg;
	}
});
//}
/**
 * @name nhn.husky.PopUpManager
 * @namespace
 * @description ÆË¾÷ ¸Å´ÏÀú Å¬·¡½º.
 * <dt><strong>Spec Code</strong></dt>
 * <dd><a href="http://ajaxui.nhndesign.com/svnview/SmartEditor2_Official/tags/SE2M_popupManager/0.1/test/spec/hp_popupManager_spec.html" target="_new">Spec</a></dd>
 * <dt><strong>wiki</strong></dt>
 * <dd><a href="http://wikin.nhncorp.com/pages/viewpage.action?pageId=63501152" target="_new">wiki</a></dd>
 * @author NHN AjaxUI Lab - sung jong min
 * @version 0.1
 * @since 2009.07.06
 */
nhn.husky.PopUpManager = {};

/** * @ignore */
nhn.husky.PopUpManager._instance = null;
/** * @ignore */
nhn.husky.PopUpManager._pluginKeyCnt = 0;

/**
 * @description ÆË¾÷ ¸Å´ÏÀú ÀÎ½ºÅÏ½º È£Ãâ ¸Þ¼Òµå, nhn.husky js framework ±â¹Ý ÄÚµå
 * @public
 * @param {Object} oApp Çã½ºÅ° ÄÚ¾î °´Ã¼¸¦ ³Ñ°ÜÁØ´Ù.(this.oApp)
 * @return {Object} nhn.husky.PopUpManager Instance
 * @example ÆË¾÷°ü·Ã ÇÃ·¯±×ÀÎ Á¦ÀÛ ¿¹Á¦
 * nhn.husky.NewPlugin = function(){
 * 	this.$ON_APP_READY = function(){
 * 		// ÆË¾÷ ¸Å´ÏÀú getInstance ¸Þ¼Òµå¸¦ È£ÃâÇÑ´Ù.
 * 		// Çã½ºÅ° ÄÚ¾îÀÇ ÂüÁ¶°ªÀ» ³Ñ°ÜÁØ´Ù(this.oApp)
 * 		this.oPopupMgr = nhn.husky.PopUpMaganer.getInstance(this.oApp);
 * 	};
 * 
 * 	// ÆË¾÷À» ¿äÃ»ÇÏ´Â ¸Þ½ÃÁö ¸Þ¼Òµå´Â ¾Æ·¡¿Í °°À½
 * 	this.$ON_NEWPLUGIN_OPEN_WINDOW = function(){
 * 		var oWinOp = {
 * 			oApp : this.oApp,	// oApp this.oApp Çã½ºÅ° ÂüÁ¶°ª
 * 			sUrl : "", // sUrl : ÆäÀÌÁö URL
 * 			sName : "", // sName : ÆäÀÌÁö name
 * 			nWidth : 400,
 * 			nHeight : 400,
 * 			bScroll : true
 * 		}
 * 		this.oPopUpMgr.openWindow(oWinOp);
 * 	};
 * 
 * 	// ÆË¾÷ÆäÀÌÁö ÀÀ´äµ¥ÀÌÅ¸ ¹ÝÈ¯ ¸Þ½ÃÁö ¸Þ¼Òµå¸¦ Á¤ÀÇÇÔ.
 * 	// °¢ ÇÃ·¯±×ÀÎ ÆË¾÷ÆäÀÌÁö¿¡¼­ ÇØ´ç ¸Þ½ÃÁö¿Í µ¥ÀÌÅ¸¸¦ ³Ñ±â°Ô µÊ.
 * 	this.@ON_NEWPLUGIN_WINDOW_CALLBACK = function(){
 * 		// ÆË¾÷ÆäÀÌÁöº°·Î Á¤ÀÇµÈ ÇüÅÂÀÇ ¾Æ±Ô¸ÕÆ® µ¥ÀÌÅ¸°¡ ³Ñ¾î¿À¸é Ã³¸®ÇÑ´Ù.
 * 	}
 * }
 * @example ÆË¾÷ ÆäÀÌÁö¿Í opener È£Ãâ ÀÎÅÍÆäÀÌ½º ¿¹Á¦
 * onclick½Ã
 * "nhn.husky.PopUpManager.setCallback(window, "NEWPLUGIN_WINDOW_CALLBACK", oData);"
 * ÇüÅÂ·Î È£ÃâÇÔ.
 * 
 * 
 */
nhn.husky.PopUpManager.getInstance = function(oApp) {
	if (this._instance==null) {
		
		this._instance = new (function(){
			
			this._whtPluginWin = new jindo.$H();
			this._whtPlugin = new jindo.$H();
			this.addPlugin = function(sKey, vValue){
				this._whtPlugin.add(sKey, vValue);
			};
			
			this.getPlugin = function() {
				return this._whtPlugin;
			};
			this.getPluginWin = function() {
				return this._whtPluginWin;
			};
			
			this.openWindow = function(oWinOpt) {
				var op= {
					oApp : null, 
					sUrl : "", 
					sName : "popup", 
					sLeft : null,
					sTop : null,
					nWidth : 400,
					nHeight : 400,
					sProperties : null,
					bScroll : true
				};
				for(var i in oWinOpt) op[i] = oWinOpt[i];

				if(op.oApp == null) {
					alert("ÆË¾÷ ¿äÃ»½Ã ¿É¼ÇÀ¸·Î oApp(Çã½ºÅ° reference) °ªÀ» ¼³Á¤ÇÏ¼Å¾ß ÇÕ´Ï´Ù.");
				}
				
				var left = op.sLeft || (screen.availWidth-op.nWidth)/2;
				var top  = op.sTop ||(screen.availHeight-op.nHeight)/2;

				var sProperties = op.sProperties != null ? op.sProperties : 
					"top="+ top +",left="+ left +",width="+op.nWidth+",height="+op.nHeight+",scrollbars="+(op.bScroll?"yes":"no")+",status=yes";
				var win = window.open(op.sUrl, op.sName,sProperties);
				if (!!win) {
					setTimeout( function(){ 
						try{win.focus();}catch(e){} 
					}, 100);
				}
				
				this.removePluginWin(win);
				this._whtPluginWin.add(this.getCorrectKey(this._whtPlugin, op.oApp), win);

				return win;
			};
			this.getCorrectKey = function(whtData, oCompare) {
				var key = null;
				whtData.forEach(function(v,k){
					if (v == oCompare) { 
						key = k; 
						return; 
					}
				});
				return key;
			};
			this.removePluginWin = function(vValue) {
				var list = this._whtPluginWin.search(vValue);
				if (list) {
					this._whtPluginWin.remove(list);
					this.removePluginWin(vValue);
				}
			}
		})();
	}
	
	this._instance.addPlugin("plugin_" + (this._pluginKeyCnt++), oApp);
	return nhn.husky.PopUpManager._instance;
};

/**
* @description opener ¿¬µ¿ interface
 * @public
 * @param {Object} oOpenWin ÆË¾÷ ÆäÀÌÁöÀÇ window °´Ã¼
 * @param {Object} sMsg	ÇÃ·¯±×ÀÎ ¸Þ½ÃÁö¸í
 * @param {Object} oData	ÀÀ´ä µ¥ÀÌÅ¸
 */
nhn.husky.PopUpManager.setCallback = function(oOpenWin, sMsg, oData) {
	if (this._instance.getPluginWin().hasValue(oOpenWin)) {
		var key = this._instance.getCorrectKey(this._instance.getPluginWin(), oOpenWin);
		if (key) {
			this._instance.getPlugin().$(key).exec(sMsg, oData);
		}
	}
};

/**
 * @description opener¿¡ Çã½ºÅ° ÇÔ¼ö¸¦ ½ÇÇà½ÃÅ°°í µ¥ÀÌÅÍ °ªÀ» ¸®ÅÏ ¹ÞÀ½.
 * @param 
 */
nhn.husky.PopUpManager.getFunc = function(oOpenWin, sFunc) {
	if (this._instance.getPluginWin().hasValue(oOpenWin)) {
		var key = this._instance.getCorrectKey(this._instance.getPluginWin(), oOpenWin);
		if (key) {
			return this._instance.getPlugin().$(key)[sFunc]();
		}
	}
};

nhn.husky.SE2M_ImgSizeRatioKeeper = jindo.$Class({
	name : "SE2M_ImgSizeRatioKeeper",
	
	$init : function(elAppContainer){
		this.elAppContainer = elAppContainer;
	},
	
	$LOCAL_BEFORE_FIRST : function(){
		this.wfnResizeEnd = jindo.$Fn(this._onResizeEnd, this);
		this.bIE = jindo.$Agent().navigator().ie;
		this.elCheckImgAutoAdjust = jindo.$$.getSingle(".se2_srate", this.elAppContainer);
		if(!this.bIE){
			this.$ON_EVENT_EDITING_AREA_KEYDOWN = undefined;
			this.$ON_EVENT_EDITING_AREA_MOUSEUP = undefined;
		}
	},

	$ON_EVENT_EDITING_AREA_KEYDOWN : function(){
		this._detachResizeEnd();
	},
	
	$ON_EVENT_EDITING_AREA_MOUSEUP : function(wev){
		this._detachResizeEnd();
		if(!wev.element || wev.element.tagName != "IMG"){return;}
		this.oApp.exec("SET_RESIZE_TARGET_IMG", [wev.element]);
	},
	
	$ON_SET_RESIZE_TARGET_IMG : function(elImg){
		if(elImg == this.elImg){return;}
		
		this._detachResizeEnd();
		this._attachResizeEnd(elImg);
	},
	
	_attachResizeEnd : function(elImg){
		this.elImg = elImg;
		this.wfnResizeEnd.attach(this.elImg, "resizeend");
		this.elBorderSize = (elImg.border || 0);
		
		this.nWidth = this.elImg.clientWidth ;
		this.nHeight = this.elImg.clientHeight ;
	},
	
	_detachResizeEnd : function(){
		if(!this.elImg){return;}
		this.wfnResizeEnd.detach(this.elImg, "resizeend");
		this.elImg = null;
	},
	
	_onResizeEnd : function(wev){
		if(wev.element != this.elImg){return;}
		var nRatio, nAfterWidth, nAfterheight, nWidthDiff, nHeightDiff, nborder;
		
		nborder = this.elImg.border || 0;
		nAfterWidth = this.elImg.clientWidth - (nborder*2);
		nAfterheight = this.elImg.clientHeight - (nborder*2);
		
		if(this.elCheckImgAutoAdjust.checked){
			nWidthDiff = nAfterWidth -  this.nWidth;
			
			//¹Ì¼¼ÇÑ Â÷ÀÌ¿¡ Å©±â º¯È­´Â ¹«½Ã. 
			if( -1 <= nWidthDiff && nWidthDiff <= 1){
				nRatio = this.nWidth/this.nHeight;
				nAfterWidth = nRatio * nAfterheight;
			}else{
				nRatio = this.nHeight/this.nWidth;
				nAfterheight = nRatio * nAfterWidth;
			}
		}
		
		this.elImg.style.width = nAfterWidth + "px";
		this.elImg.style.height = nAfterheight + "px";
		this.elImg.setAttribute("width", nAfterWidth );
		this.elImg.setAttribute("height", nAfterheight);
		
		// [SMARTEDITORSUS-299] ¸¶¿ì½º Drag·Î ÀÌ¹ÌÁö Å©±â ¸®»çÀÌÁî ½Ã, »ðÀÔÇÒ ¶§ÀÇ ÀúÀå »çÀÌÁî(rwidth/rheight)µµ º¯°æÇØ ÁÜ
		this.elImg.style.rwidth = this.elImg.style.width;
		this.elImg.style.rheight = this.elImg.style.height;
		this.elImg.setAttribute("rwidth", this.elImg.getAttribute("width"));
		this.elImg.setAttribute("rheight", this.elImg.getAttribute("height"));
		
		// ¾Æ·¡ÀÇ ºÎºÐÀº ÃßÈÄ hp_SE2M_ImgSizeAdjustUtil.js ¸¦ »ý¼ºÇÏ¿© ºÐ¸®ÇÑ´Ù.
		var bAdjustpossible = this._isAdjustPossible(this.elImg.offsetWidth);
		if(!bAdjustpossible){
			this.elImg.style.width = this.nWidth;
			this.elImg.style.height = this.nHeight;
			this.elImg.style.rwidth = this.elImg.style.width;
			this.elImg.style.rheight = this.elImg.style.height;
			
			this.elImg.setAttribute("width", this.nWidth);
			this.elImg.setAttribute("height", this.nHeight);
			this.elImg.setAttribute("rwidth", this.elImg.getAttribute("width"));
			this.elImg.setAttribute("rheight", this.elImg.getAttribute("height"));	
		}
		
		this.oApp.delayedExec("SET_RESIZE_TARGET_IMG", [this.elImg], 0);
	},
	
	
	_isAdjustPossible : function(width){
		var bPossible = true;
		
		// °¡·ÎÆø Àû¿ëÇÏ´Â °æ¿ì¿¡¸¸ ¿¡µðÅÍ º»¹® ¾È¿¡ º¸ÀÌ´Â ÀÌ¹ÌÁö »çÀÌÁî¸¦ Á¶ÀýÇÔ
		var bRulerUse = (this.oApp.htOptions['SE2M_EditingAreaRuler']) ? this.oApp.htOptions['SE2M_EditingAreaRuler'].bUse : false;
		if(bRulerUse){
			var welWysiwygBody = jindo.$Element(this.oApp.getWYSIWYGDocument().body);
			if(welWysiwygBody){
				var nEditorWidth = welWysiwygBody.width();
				if(width > nEditorWidth){
					bPossible = false;
					alert(this.oApp.$MSG("SE2M_ImgSizeRatioKeeper.exceedMaxWidth").replace("#EditorWidth#", nEditorWidth));
				}
			}
		}
		return bPossible;
	}
});
if(typeof window.nhn == 'undefined') { window.nhn = {}; }
if(!nhn.husky) { nhn.husky = {}; }

nhn.husky.SE2M_UtilPlugin = jindo.$Class({
	name : "SE2M_UtilPlugin",

	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["oAgent", jindo.$Agent()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["oNavigator", jindo.$Agent().navigator()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["oUtils", this]);
	},
	
	$ON_REGISTER_HOTKEY : function(sHotkey, sCMD, aArgs, elTarget) {
		this.oApp.exec("ADD_HOTKEY", [sHotkey, sCMD, aArgs, (elTarget || this.oApp.getWYSIWYGDocument())]);
	},

	$ON_SE2_ATTACH_HOVER_EVENTS : function(aElms){
		this.oApp.exec("ATTACH_HOVER_EVENTS", [aElms, {fnElmToSrc: this._elm2Src, fnElmToTarget: this._elm2Target}]);
	},
	
	_elm2Src : function(el){
		if(el.tagName == "LI" && el.firstChild && el.firstChild.tagName == "BUTTON"){
			return el.firstChild;
		}else{
			return el;
		}
	},
	
	_elm2Target : function(el){
		if(el.tagName == "BUTTON" && el.parentNode.tagName == "LI"){
			return el.parentNode;
		}else{
			return el;
		}
	},
	
	getScrollXY : function(){
		var scrollX,scrollY;
		var oAppWindow = this.oApp.getWYSIWYGWindow();
		if(typeof oAppWindow.scrollX == "undefined"){
			scrollX = oAppWindow.document.documentElement.scrollLeft;
			scrollY = oAppWindow.document.documentElement.scrollTop;
		}else{
			scrollX = oAppWindow.scrollX;
			scrollY = oAppWindow.scrollY;
		}
		
		return {x:scrollX, y:scrollY};
	}
});

nhn.husky.SE2M_Utils = {
	sURLPattern : '(http|https|ftp|mailto):(?:\\/\\/)?((:?\\w|-)+(:?\\.(:?\\w|-)+)+)([^ <>]+)?',
	
	/**
	 * »ç¿ëÀÚ Å¬·¡½º Á¤º¸¸¦ ÃßÃâÇÑ´Ù.
	 * @param {String} sStr	ÃßÃâ String
	 * @param {rx} rxValue	rx type Çü½ÄÀÇ °ª
	 * @param {String} sDivision	valueÀÇ split Çü½Ä
	 * @return {Array}
	 */
	getCustomCSS : function(sStr, rxValue, sDivision) {
		var ret = [];
		if('undefined' == typeof(sStr) || 'undefined' == typeof(rxValue) || !sStr || !rxValue) {
			return ret;
		}
		
		var aMatch = sStr.match(rxValue);		
		if(aMatch && aMatch[0]&&aMatch[1]) {
			if(sDivision) {
				ret = aMatch[1].split(sDivision);
			} else {
				ret[0] = aMatch[1];
			}	
		}
		
		return ret;
	},
	/**
	 * HashTable·Î ±¸¼ºµÈ ArrayÀÇ °°Àº ÇÁ·ÎÆÛÆ¼¸¦ sSeperator ·Î ±¸ºÐµÈ String °ªÀ¸·Î º¯È¯
	 * @param {Object} v
	 * @param {Object} sKey
	 * @author senxation
	 * @example 
a = [{ b : "1" }, { b : "2" }]

toStringSamePropertiesOfArray(a, "b", ", ");
==> "1, 2"
	 */
	toStringSamePropertiesOfArray : function(v, sKey, sSeperator) {
		if (v instanceof Array) {
			var a = [];
			for (var i = 0; i < v.length; i++) {
				a.push(v[i][sKey]);
			}
			return a.join(",").replace(/,/g, sSeperator);
		}
		else {
			if (typeof v[sKey] == "undefined") {
				return "";
			}
			if (typeof v[sKey] == "string") {
				return v[sKey];
			}
		}
	},
	
	/**
	 * ´ÜÀÏ °´Ã¼¸¦ ¹è¿­·Î ¸¸µé¾îÁÜ
	 * @param {Object} v
	 * @return {Array}
	 * @author senxation
	 * @example
makeArray("test"); ==> ["test"]
	 */	
	makeArray : function(v) {
		if (v === null || typeof v === "undefined"){
			return [];
		}
		if (v instanceof Array) {
			return v;
		}
		var a = [];
		a.push(v);
		return a;
	},
	
	/**
	 * ¸»ÁÙÀÓÀ» ÇÒ¶§ ÁÙÀÏ ³»¿ë°ú ÄÁÅ×ÀÌ³Ê°¡ ´Ù¸¦ °æ¿ì Ã³¸®
	 * ÄÁÅ×ÀÌ³ÊÀÇ css white-space°ªÀÌ "normal"ÀÌ¾î¾ßÇÑ´Ù. (ÄÁÅ×ÀÌ³Êº¸´Ù ÅØ½ºÆ®°¡ ±æ¸é ¿©·¯ÇàÀ¸·Î Ç¥ÇöµÇ´Â »óÅÂ)
	 * @param {HTMLElement} elText ¸»ÁÙÀÓÇÒ ¿¤¸®¸ÕÆ®
	 * @param {HTMLElement} elContainer ¸»ÁÙÀÓÇÒ ¿¤¸®¸ÕÆ®¸¦ °¨½Î´Â ÄÁÅ×ÀÌ³Ê
	 * @param {String} sStringTail ¸»ÁÙÀÓÀ» Ç¥ÇöÇÒ ¹®ÀÚ¿­ (¹ÌÁöÁ¤½Ã ...)
	 * @param {Number} nLine ÃÖ´ë ¶óÀÎ¼ö (¹ÌÁöÁ¤½Ã 1)
	 * @author senxation
	 * @example
//div°¡ 2ÁÙ ÀÌÇÏ°¡ µÇµµ·Ï strong ³»ºÎÀÇ ³»¿ëÀ» ÁÙÀÓ 
<div>
	<strong id="a">¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë</strong><span>»ó¼¼º¸±â</span>
<div>
ellipsis(jindo.$("a"), jindo.$("a").parentNode, "...", 2);
	 */
	ellipsis : function(elText, elContainer, sStringTail, nLine) {
		sStringTail = sStringTail || "...";
		if (typeof nLine == "undefined") {
			nLine = 1;
		}
		var welText = jindo.$Element(elText);
		var welContainer = jindo.$Element(elContainer);
		
		var sText = welText.html();
		var nLength = sText.length;
		var nCurrentHeight = welContainer.height();
		var nIndex = 0;
		welText.html('A');
		var nHeight = welContainer.height();

		if (nCurrentHeight < nHeight * (nLine + 0.5)) {
			return welText.html(sText);
		}
	
		/**
		 * ÁöÁ¤µÈ ¶óÀÎº¸´Ù Ä¿Áú¶§±îÁö ÀüÃ¼ ³²Àº ¹®ÀÚ¿­ÀÇ Àý¹ÝÀ» ´õÇØ³ª°¨
		 */
		nCurrentHeight = nHeight;
		while(nCurrentHeight < nHeight * (nLine + 0.5)) {
			nIndex += Math.max(Math.ceil((nLength - nIndex)/2), 1);
			welText.html(sText.substring(0, nIndex) + sStringTail);
			nCurrentHeight = welContainer.height();
		}
	
		/**
		 * ÁöÁ¤µÈ ¶óÀÎÀÌ µÉ¶§±îÁö ÇÑ±ÛÀÚ¾¿ Àß¶ó³¿
		 */
		while(nCurrentHeight > nHeight * (nLine + 0.5)) {
			nIndex--;
			welText.html(sText.substring(0, nIndex) + sStringTail);
			nCurrentHeight = welContainer.height();
		}
	},
	
	/**
	 * ÃÖ´ë °¡·Î»çÀÌÁî¸¦ ÁöÁ¤ÇÏ¿© ¸»ÁÙÀÓÇÑ´Ù.
	 * elTextÀÇ css white-space°ªÀÌ "nowrap"ÀÌ¾î¾ßÇÑ´Ù. (ÄÁÅ×ÀÌ³Êº¸´Ù ÅØ½ºÆ®°¡ ±æ¸é Çàº¯È¯µÇÁö¾Ê°í °¡·Î·Î ±æ°Ô Ç¥ÇöµÇ´Â »óÅÂ)
	 * @param {HTMLElement} elText ¸»ÁÙÀÓÇÒ ¿¤¸®¸ÕÆ®
	 * @param {String} sStringTail ¸»ÁÙÀÓÀ» Ç¥ÇöÇÒ ¹®ÀÚ¿­ (¹ÌÁöÁ¤½Ã ...)
	 * @param {Function} fCondition Á¶°Ç ÇÔ¼ö. ³»ºÎ¿¡¼­ true¸¦ ¸®ÅÏÇÏ´Â µ¿¾È¿¡¸¸ ¸»ÁÙÀÓÀ» ÁøÇàÇÑ´Ù.
	 * @author senxation
	 * @example
//150ÇÈ¼¿ ÀÌÇÏ°¡ µÇµµ·Ï strong ³»ºÎÀÇ ³»¿ëÀ» ÁÙÀÓ 
<strong id="a">¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë</strong>>
ellipsisByPixel(jindo.$("a"), "...", 150);
	 */
	ellipsisByPixel : function(elText, sStringTail, nPixel, fCondition) {
		sStringTail = sStringTail || "...";
		var welText = jindo.$Element(elText);
		var nCurrentWidth = welText.width();
		if (nCurrentWidth < nPixel) {
			return;
		}
		
		var sText = welText.html();
		var nLength = sText.length;

		var nIndex = 0;
		if (typeof fCondition == "undefined") {
			var nWidth = welText.html('A').width();
			nCurrentWidth = nWidth;
			
			while(nCurrentWidth < nPixel) {
				nIndex += Math.max(Math.ceil((nLength - nIndex)/2), 1);
				welText.html(sText.substring(0, nIndex) + sStringTail);
				nCurrentWidth = welText.width();
			}
			
			fCondition = function() {
				return true;
			};
		}
		
		nIndex = welText.html().length - sStringTail.length;
		
		while(nCurrentWidth > nPixel) {
			if (!fCondition()) {
				break;
			}
			nIndex--;
			welText.html(sText.substring(0, nIndex) + sStringTail);
			nCurrentWidth = welText.width();
		}
	},
	
	/**
	 * ¿©·¯°³ÀÇ ¿¤¸®¸ÕÆ®¸¦ °¢°¢ÀÇ ÁöÁ¤µÈ ÃÖ´ë³Êºñ·Î ¸»ÁÙÀÓÇÑ´Ù.
	 * ¸»ÁÙÀÓÇÒ ¿¤¸®¸ÕÆ®ÀÇ css white-space°ªÀÌ "nowrap"ÀÌ¾î¾ßÇÑ´Ù. (ÄÁÅ×ÀÌ³Êº¸´Ù ÅØ½ºÆ®°¡ ±æ¸é Çàº¯È¯µÇÁö¾Ê°í °¡·Î·Î ±æ°Ô Ç¥ÇöµÇ´Â »óÅÂ)
	 * @param {Array} aElement ¸»ÁÙÀÓÇÒ ¿¤¸®¸ÕÆ®ÀÇ ¹è¿­. ÁöÁ¤µÈ ¼ø¼­´ë·Î ¸»ÁÙÀÓÇÑ´Ù.
	 * @param {String} sStringTail ¸»ÁÙÀÓÀ» Ç¥ÇöÇÒ ¹®ÀÚ¿­ (¹ÌÁöÁ¤½Ã ...)
	 * @param {Array} aMinWidth ¸»ÁÙÀÓÇÒ ³ÊºñÀÇ ¹è¿­.
	 * @param {Function} fCondition Á¶°Ç ÇÔ¼ö. ³»ºÎ¿¡¼­ true¸¦ ¸®ÅÏÇÏ´Â µ¿¾È¿¡¸¸ ¸»ÁÙÀÓÀ» ÁøÇàÇÑ´Ù.
	 * @example
//#a #b #cÀÇ ³Êºñ¸¦ °¢°¢ 100, 50, 50ÇÈ¼¿·Î ÁÙÀÓ (div#parent °¡ 200ÇÈ¼¿ ÀÌÇÏÀÌ¸é Áß´Ü)
//#cÀÇ ³Êºñ¸¦ ÁÙÀÌ´Â µ¿¾È fCondition¿¡¼­ false¸¦ ¸®ÅÏÇÏ¸é b, a´Â ¸»ÁÙÀÓ µÇÁö ¾Ê´Â´Ù.  
<div id="parent">
	<strong id="a">¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë</strong>
	<strong id="b">¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë</strong>
	<strong id="c">¸»ÁÙÀÓÀ»Àû¿ëÇÒ³»¿ë</strong>
<div>
ellipsisElementsToDesinatedWidth([jindo.$("c"), jindo.$("b"), jindo.$("a")], "...", [100, 50, 50], function(){
	if (jindo.$Element("parent").width() > 200) {
		return true;
	} 
	return false;
});
	 */
	ellipsisElementsToDesinatedWidth : function(aElement, sStringTail, aMinWidth, fCondition) {
		jindo.$A(aElement).forEach(function(el, i){
			if (!el) {
				jindo.$A.Continue();
			}
			nhn.husky.SE2M_Utils.ellipsisByPixel(el, sStringTail, aMinWidth[i], fCondition);
		});
	},
	
	/**
	 * ¼ýÀÚ¸¦ ÀÔ·Â¹Þ¾Æ Á¤ÇØÁø ±æÀÌ¸¸Å­ ¾Õ¿¡ "0"ÀÌ Ãß°¡µÈ ¹®ÀÚ¿­À» ±¸ÇÑ´Ù.
	 * @param {Number} nNumber
	 * @param {Number} nLength
	 * @return {String}
	 * @example
paddingZero(10, 5); ==> "00010" (String)
	 */
	paddingZero : function(nNumber, nLength) {
		var sResult = nNumber.toString();
		while (sResult.length < nLength) {
			sResult = ("0" + sResult);
		}
		return sResult;
	},
	
	/**
	 * stringÀ» byte ´ÜÀ§·Î Â©¶ó¼­ tail¸¦ ºÙÈù´Ù.
	 * @param {String} sString
	 * @param {Number} nByte
	 * @param {String} sTail
	 * @example
	 cutStringToByte('ÀÏÀÌ»ï»ç¿ÀÀ°', 6, '...') ==> 'ÀÏÀÌ»ï...' (string)	 
	 */
	cutStringToByte : function(sString, nByte, sTail){
		if(sString === null || sString.length === 0) {
			return sString;
		}	
		
		sString = sString.replace(/  +/g, " ");
		if (!sTail && sTail != "") {
			sTail = "...";
		}
		
		var maxByte = nByte;
		var n=0;
		var nLen = sString.length;
		for(var i=0; i<nLen;i++){
			n += this.getCharByte(sString.charAt(i));			
			if(n == maxByte){ 
				if(i == nLen-1) {
					return sString;
				} else { 
					return sString.substring(0,i)+sTail;
				}	
			} else if( n > maxByte ) { 
				return sString.substring(0, i)+sTail; 
			} 		
		}		
		return sString;
	},
	
	/**
	 * ÀÔ·Â¹ÞÀº ¹®ÀÚÀÇ byte ±¸ÇÑ´Ù.
	 * @param {String} ch
	 * 
	 */
	getCharByte : function(ch){
		if (ch === null || ch.length < 1) {
			return 0;
		}	
             
        var byteSize = 0;
        var str = escape(ch);
        
        if ( str.length == 1 ) {   // when English then 1byte
             byteSize ++;
        } else if ( str.indexOf("%u") != -1 ) {  // when Korean then 2byte
             byteSize += 2;
        } else if ( str.indexOf("%") != -1 ) {  // else 3byte
             byteSize += str.length/3;
        }           
        return byteSize;
	},
	
	/**
	 * Hash Table¿¡¼­ ¿øÇÏ´Â Å°°ª¸¸À» °¡Áö´Â ÇÊÅÍµÈ »õ·Î¿î Hash TableÀ» ±¸ÇÑ´Ù. 
	 * @param {HashTable} htUnfiltered
	 * @param {Array} aKey
	 * @return {HashTable}
	 * @author senxation
	 * @example
getFilteredHashTable({
	a : 1,
	b : 2,
	c : 3,
	d : 4
}, ["a", "c"]);
==> { a : 1, c : 3 }
	 */
	getFilteredHashTable : function(htUnfiltered, vKey) {
		if (!(vKey instanceof Array)) {
			return arguments.callee.call(this, htUnfiltered, [ vKey ]);
		}
		
		var waKey = jindo.$A(vKey);
		return jindo.$H(htUnfiltered).filter(function(vValue, sKey){
			if (waKey.has(sKey) && vValue) {
				return true;
			} else {
				return false;
			}
		}).$value();
	},
	
	isBlankNode : function(elNode){
		var isBlankTextNode = this.isBlankTextNode;
		
		var bEmptyContent = function(elNode){
			if(!elNode) {
				return true;
			}
			
			if(isBlankTextNode(elNode)){
				return true;
			}

			if(elNode.tagName == "BR") {
				return true;
			}
			
			if(elNode.innerHTML == "&nbsp;" || elNode.innerHTML == "") {
				return true;
			}
			
			return false;
		};
		var bEmptyP = function(elNode){
			if(elNode.tagName == "IMG" || elNode.tagName == "IFRAME"){
				return false;
			}
			
			if(bEmptyContent(elNode)){
				return true;
			}
			
			if(elNode.tagName == "P"){
				for(var i=elNode.childNodes.length-1; i>=0; i--){
					var elTmp = elNode.childNodes[i];
					if(isBlankTextNode(elTmp)){
						elTmp.parentNode.removeChild(elTmp);
					}
				}
				
				if(elNode.childNodes.length == 1){
					if(elNode.firstChild.tagName == "IMG" || elNode.firstChild.tagName == "IFRAME"){
						return false;
					}
					if(bEmptyContent(elNode.firstChild)){
						return true;
					}
				}
			}
			
			return false;
		};

		if(bEmptyP(elNode)){
			return true;
		}

		for(var i=0, nLen=elNode.childNodes.length; i<nLen; i++){
			var elTmp = elNode.childNodes[i];
			if(!bEmptyP(elTmp)){
				return false;
			}
		}

		return true;
	},
	
	isBlankTextNode : function(oNode){
		var sText;
		
		if(oNode.nodeType == 3){
			sText = oNode.nodeValue;
			sText = sText.replace(unescape("%uFEFF"), '');
		
			if(sText == "") {
				return true;
			}
		}
		
		return false;
	},
	
	isFirstChildOfNode : function(sTagName, sParentTagName, elNode){
		if(!elNode){
			return false;
		}
		
		if(elNode.tagName == sParentTagName && elNode.firstChild.tagName == sTagName){
			return true;
		}
		
		return false;
	},
	
	/**
	 * elNodeÀÇ »óÀ§ ³ëµå Áß ÅÂ±×¸íÀÌ sTagName°ú ÀÏÄ¡ÇÏ´Â °ÍÀÌ ÀÖ´Ù¸é ¹ÝÈ¯.
	 * @param {String} sTagName °Ë»ö ÇÒ ÅÂ±×¸í
	 * @param {HTMLElement} elNode °Ë»ö ½ÃÀÛÁ¡À¸·Î »ç¿ë ÇÒ ³ëµå
	 * @return {HTMLElement} ºÎ¸ð ³ëµå Áß ÅÂ±×¸íÀÌ sTagName°ú ÀÏÄ¡ÇÏ´Â ³ëµå. ¾øÀ» °æ¿ì null ¹ÝÈ¯ 
	 */
	findAncestorByTagName : function(sTagName, elNode){
		while(elNode && elNode.tagName != sTagName) {
			elNode = elNode.parentNode;
		}
		
		return elNode;
	},

	loadCSS : function(url, fnCallback){
		var oDoc = document;
		var elHead = oDoc.getElementsByTagName("HEAD")[0]; 
		var elStyle = oDoc.createElement ("LINK"); 
		elStyle.setAttribute("type", "text/css");
		elStyle.setAttribute("rel", "stylesheet");
		elStyle.setAttribute("href", url);
		if(fnCallback){
			if ('onload' in elStyle) {
				elStyle.onload = function(){
					fnCallback();
				};
			} else {
				elStyle.onreadystatechange = function(){
					if(elStyle.readyState != "complete"){
						return;
					}
					
					// [SMARTEDITORSUS-308] [IE9] ÀÀ´äÀÌ 304ÀÎ °æ¿ì
					//	onreadystatechage ÇÚµé·¯¿¡¼­ readyState °¡ complete ÀÎ °æ¿ì°¡ µÎ ¹ø ¹ß»ý
					//	LINK ¿¤¸®¸ÕÆ®ÀÇ ¼Ó¼ºÀ¸·Î ÄÝ¹é ½ÇÇà ¿©ºÎ¸¦ ÇÃ·¡±×·Î ³²°Ü³õ¾Æ Ã³¸®ÇÔ
					if(elStyle.getAttribute("_complete")){
						return;
					}
					
					elStyle.setAttribute("_complete", true);
					
					fnCallback();
				};
			}
		}
		elHead.appendChild (elStyle); 
	},

	getUniqueId : function(sPrefix) {
		return (sPrefix || '') + jindo.$Date().time() + (Math.random() * 100000).toFixed();
	},
	
	/**
	 * @param {Object} oSrc value copyÇÒ object
	 * @return {Object}
	 * @example
	 *  var oSource = [1, 3, 4, { a:1, b:2, c: { a:1 }}];
		var oTarget = oSource; // call by reference	
		oTarget = nhn.husky.SE2M_Utils.clone(oSource);
		
		oTarget[1] = 2;
		oTarget[3].a = 100;
		console.log(oSource); // check for deep copy 
		console.log(oTarget, oTarget instanceof Object); // check instance type!
	 */
	clone : function(oSrc, oChange) {
		if ('undefined' != typeof(oSrc) && !!oSrc && (oSrc.constructor == Array || oSrc.constructor == Object)) {
			var oCopy = (oSrc.constructor == Array ? [] : {} );
			for (var property in oSrc) {
				if ('undefined' != typeof(oChange) && !!oChange[property]) {		
					oCopy[property] = arguments.callee(oChange[property]);
				} else {
					oCopy[property] = arguments.callee(oSrc[property]);
				}
			}
			
			return oCopy;
		}
		
		return oSrc;
	},
		
	getHtmlTagAttr : function(sHtmlTag, sAttr) {
		var rx = new RegExp('\\s' + sAttr + "=('([^']*)'|\"([^\"]*)\"|([^\"' >]*))", 'i');
		var aResult = rx.exec(sHtmlTag);
		
		if (!aResult) {
			return '';
		}
		
		var sAttrTmp = (aResult[1] || aResult[2] || aResult[3]); // for chrome 5.x bug!
		if (!!sAttrTmp) {
			sAttrTmp = sAttrTmp.replace(/[\"]/g, '');
		}
		
		return sAttrTmp;
	},
	
	
	/**
	 * iframe ¿µ¿ªÀÇ aling Á¤º¸¸¦ ´Ù½Ã ¼¼ÆÃÇÏ´Â ºÎºÐ.
	 * iframe ÇüÅÂÀÇ »êÃâ¹°À» ¿¡µðÅÍ¿¡ »ðÀÔ ÀÌÈÄ¿¡ ¿¡µðÅÍ Á¤·Ä±â´ÉÀ» Ãß°¡ ÇÏ¿´À»¶§ ir_to_db ÀÌÀü ½ÃÁ¡¿¡¼­ divÅÂ±×¿¡ Á¤·ÄÀ» ³Ö¾îÁÖ´Â ·ÎÁ÷ÀÓ.
	 * ºê¶ó¿ìÀú ÇüÅÂ¿¡ µû¶ó Á¤·Ä ÅÂ±×°¡ iframeÀ» °¨½Î´Â div È¤Àº p ÅÂ±×¿¡ Á¤·ÄÀÌ Ãß°¡µÈ´Ù.
	 * @param {HTMLElement} el iframeÀÇ parentNode
	 * @param {Document} oDoc  document
	 */
	// [COM-1151] SE2M_PreStringConverter ¿¡¼­ ¼öÁ¤ÇÏµµ·Ï º¯°æ
	iframeAlignConverter : function(el, oDoc){
		var sTagName = el.tagName.toUpperCase();
		
		if(sTagName == "DIV" || sTagName == 'P'){
			//irToDbDOM ¿¡¼­ ÃÖ»óÀ§ ³ëµå°¡ div ¿¤¸®¸ÕÆ® ÀÌ¹Ç·Î parentNode°¡ ¾øÀ¸¸é ÃÖ»óÀÇ div ³ëµå ÀÌ¹Ç·Î ¸®ÅÏÇÑ´Ù.
			if(el.parentNode === null ){ 
				return;
			}
			var elWYSIWYGDoc = oDoc;
			var wel = jindo.$Element(el);
			var sHtml = wel.html();
			//ÇöÀç alignÀ» ¾ò¾î¿À±â.
			var sAlign = jindo.$Element(el).attr('align') || jindo.$Element(el).css('text-align');
			//if(!sAlign){ //  P > DIVÀÇ °æ¿ì ¹®Á¦ ¹ß»ý, ¼öÁ¤ È­¸é¿¡ µé¾î ¿ÔÀ» ¶§ ÅÂ±× ±úÁü
			//	return;
			//}
			//»õ·Î¿î div ³ëµå »ý¼ºÇÑ´Ù.
			var welAfter = jindo.$Element(jindo.$('<div></div>', elWYSIWYGDoc));
			welAfter.html(sHtml).attr('align', sAlign);			
			wel.replace(welAfter);		
		}		
	},	
	
	/**
	 * jindo.$JSON.fromXMLÀ» º¯È¯ÇÑ ¸Þ¼­µå.
	 * ¼Ò¼ýÁ¡ÀÌ ÀÖ´Â °æ¿ìÀÇ Ã³¸® ½Ã¿¡ ¼ýÀÚ·Î º¯È¯ÇÏÁö ¾Êµµ·Ï ÇÔ(parseFloat »ç¿ë ¾ÈÇÏµµ·Ï ¼öÁ¤)
	 * °ü·Ã BTS : [COM-1093]
	 * @param {String} sXML  XML ÇüÅÂÀÇ ¹®ÀÚ¿­
	 * @return {jindo.$JSON}
	 */
	getJsonDatafromXML : function(sXML) {
		var o  = {};
		var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
		var re2= /^[0-9]+(?:\.[0-9]+)?$/;
		var re3= /^\s+$/g;
		var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
		var fg = {tags:["/"],stack:[o]};
		var es = function(s){ 
			if (typeof s == "undefined") {
				return "";
			}	
			return s.replace(/&[a-z]+;/g, function(m){ return (typeof ec[m] == "string")?ec[m]:m; });
		};
		var at = function(s,c) {
			s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0,$1,$2,$3) {
				c[$1] = es(($2?$2.replace(/\\"/g,'"'):undefined)||($3?$3.replace(/\\'/g,"'"):undefined));
			}); 
		};
		
		var em = function(o) {
			for(var x in o){
				if (o.hasOwnProperty(x)) {
					if(Object.prototype[x]) {
						continue;
					}	
					return false;
				}
			}
			return true;
		};
		
		// $0 : ÀüÃ¼ 
		// $1 : ÅÂ±×¸í
		// $2 : ¼Ó¼º¹®ÀÚ¿­
		// $3 : ´Ý´ÂÅÂ±×
		// $4 : CDATA¹Ùµð°ª
		// $5 : ±×³É ¹Ùµð°ª 
		var cb = function($0,$1,$2,$3,$4,$5) {
			var cur, cdata = "";
			var idx = fg.stack.length - 1;
			
			if (typeof $1 == "string" && $1) {
				if ($1.substr(0,1) != "/") {
					var has_attr = (typeof $2 == "string" && $2);
					var closed   = (typeof $3 == "string" && $3);
					var newobj   = (!has_attr && closed)?"":{};

					cur = fg.stack[idx];
					
					if (typeof cur[$1] == "undefined") {
						cur[$1] = newobj; 
						cur = fg.stack[idx+1] = cur[$1];
					} else if (cur[$1] instanceof Array) {
						var len = cur[$1].length;
						cur[$1][len] = newobj;
						cur = fg.stack[idx+1] = cur[$1][len];  
					} else {
						cur[$1] = [cur[$1], newobj];
						cur = fg.stack[idx+1] = cur[$1][1];
					}
					
					if (has_attr) {
						at($2,cur);
					}	

					fg.tags[idx+1] = $1;

					if (closed) {
						fg.tags.length--;
						fg.stack.length--;
					}
				} else {
					fg.tags.length--;
					fg.stack.length--;
				}
			} else if (typeof $4 == "string" && $4) {
				cdata = $4;
			} else if (typeof $5 == "string" && $5.replace(re3, "")) { // [SMARTEDITORSUS-1525] ´Ý´Â ÅÂ±×ÀÎµ¥ °ø¹é¹®ÀÚ°¡ µé¾îÀÖ¾î cdata °ªÀ» µ¤¾î¾²´Â °æ¿ì ¹æÁö 
				cdata = es($5);
			}
			
			if (cdata.length > 0) {
				var par = fg.stack[idx-1];
				var tag = fg.tags[idx];

				if (re2.test(cdata)) {
					//cdata = parseFloat(cdata);
				}else if (cdata == "true" || cdata == "false"){
					cdata = new Boolean(cdata);
				}

				if(typeof par =='undefined') {
					return;
				}	
				
				if (par[tag] instanceof Array) {
					var o = par[tag];
					if (typeof o[o.length-1] == "object" && !em(o[o.length-1])) {
						o[o.length-1].$cdata = cdata;
						o[o.length-1].toString = function(){ return cdata; };
					} else {
						o[o.length-1] = cdata;
					}
				} else {
					if (typeof par[tag] == "object" && !em(par[tag])) {
						par[tag].$cdata = cdata;
						par[tag].toString = function() { return cdata; };
					} else {
						par[tag] = cdata;
					}
				}
			}
		};
		
		sXML = sXML.replace(/<(\?|\!-)[^>]*>/g, "");
		sXML.replace(re, cb);
		
		return jindo.$Json(o);
	}
};

/**
 * nhn.husky.AutoResizer
 * 	HTML¸ðµå¿Í TEXT ¸ðµåÀÇ ÆíÁý ¿µ¿ªÀÎ TEXTAREA¿¡ ´ëÇÑ ÀÚµ¿È®Àå Ã³¸®
 */
nhn.husky.AutoResizer = jindo.$Class({
	welHiddenDiv : null,
	welCloneDiv : null,
	elContainer : null,
	$init : function(el, htOption){
		var aCopyStyle = [
				'lineHeight', 'textDecoration', 'letterSpacing',
				'fontSize', 'fontFamily', 'fontStyle', 'fontWeight',
				'textTransform', 'textAlign', 'direction', 'wordSpacing', 'fontSizeAdjust',
				'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'width'
			],
			i = aCopyStyle.length,
			oCss = {
				"position" : "absolute",
				"top" : -9999,
				"left" : -9999,
				"opacity": 0,
				"overflow": "hidden",
				"wordWrap" : "break-word"
			};
		
		this.nMinHeight = htOption.nMinHeight;
		this.wfnCallback = htOption.wfnCallback;
		
		this.elContainer = el.parentNode;
		this.welTextArea = jindo.$Element(el);	// autoresize¸¦ Àû¿ëÇÒ TextArea
		this.welHiddenDiv = jindo.$Element('<div>');

		this.wfnResize = jindo.$Fn(this._resize, this);

		this.sOverflow = this.welTextArea.css("overflow");
		this.welTextArea.css("overflow", "hidden");

		while(i--){
			oCss[aCopyStyle[i]] = this.welTextArea.css(aCopyStyle[i]);
		}
		
		this.welHiddenDiv.css(oCss);
		
		this.nLastHeight = this.welTextArea.height();
	},
	bind : function(){
		this.welCloneDiv = jindo.$Element(this.welHiddenDiv.$value().cloneNode(false));
		
		this.wfnResize.attach(this.welTextArea, "keyup");
		this.welCloneDiv.appendTo(this.elContainer);
		
		this._resize();
	},
	unbind : function(){
		this.wfnResize.detach(this.welTextArea, "keyup");
		this.welTextArea.css("overflow", this.sOverflow);
		
		if(this.welCloneDiv){
			this.welCloneDiv.leave();
		}
	},
	_resize : function(){
		var sContents = this.welTextArea.$value().value,
			bExpand = false,
			nHeight;

		if(sContents === this.sContents){
			return;
		}
		
		this.sContents = sContents.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
		this.sContents += "<br>";	// ¸¶Áö¸· °³Çà µÚ¿¡ <br>À» ´õ ºÙ¿©ÁÖ¾î¾ß ´Ã¾î³ª´Â ³ôÀÌ°¡ µ¿ÀÏÇÔ
		
		this.welCloneDiv.html(this.sContents);
		nHeight = this.welCloneDiv.height();
		
		if(nHeight < this.nMinHeight){
			nHeight = this.nMinHeight;
		}

		this.welTextArea.css("height", nHeight + "px");
		this.elContainer.style.height = nHeight + "px";
		
		if(this.nLastHeight < nHeight){
			bExpand = true;
		}

		this.wfnCallback(bExpand);
	}
});

/**
 * ¹®ÀÚ¸¦ ¿¬°áÇÏ´Â '+' ´ë½Å¿¡ java¿Í À¯»çÇÏ°Ô Ã³¸®ÇÏµµ·Ï ¹®ÀÚ¿­ Ã³¸®ÇÏµµ·Ï ¸¸µå´Â object
 * @author nox
 * @example
 var sTmp1 = new StringBuffer();
 sTmp1.append('1').append('2').append('3');
 
 var sTmp2 = new StringBuffer('1');
 sTmp2.append('2').append('3');
 
 var sTmp3 = new StringBuffer('1').append('2').append('3');
 */
if ('undefined' != typeof(StringBuffer)) {
	StringBuffer = {};
}

StringBuffer = function(str) {
	this._aString = [];
	if ('undefined' != typeof(str)) {
		this.append(str);
	}
};

StringBuffer.prototype.append = function(str) {
    this._aString.push(str);
    return this;
};

StringBuffer.prototype.toString = function() {
    return this._aString.join('');
};

StringBuffer.prototype.setLength = function(nLen) {
    if('undefined' == typeof(nLen) || 0 >= nLen) {
    	this._aString.length = 0;
    } else {
    	this._aString.length = nLen;
    }
};

/**
 * Installed Font Detector
 * @author hooriza
 *
 * @see http://remysharp.com/2008/07/08/how-to-detect-if-a-font-is-installed-only-using-javascript/
 */

(function() {

	var oDummy = null, rx = /,/gi;

	IsInstalledFont = function(sFont) {

		var sDefFont = sFont == 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
		if (!oDummy) {
			oDummy = document.createElement('div');
		}	
		
		var sStyle = 'position:absolute !important; font-size:200px !important; left:-9999px !important; top:-9999px !important;';
		oDummy.innerHTML = 'mmmmiiiii'+unescape('%uD55C%uAE00');
		oDummy.style.cssText = sStyle + 'font-family:"' + sDefFont + '" !important';
		
		var elBody = document.body || document.documentElement;
		if(elBody.firstChild){
			elBody.insertBefore(oDummy, elBody.firstChild);
		}else{
			document.body.appendChild(oDummy);
		}
		
		var sOrg = oDummy.offsetWidth + '-' + oDummy.offsetHeight;

		oDummy.style.cssText = sStyle + 'font-family:"' + sFont.replace(rx, '","') + '", "' + sDefFont + '" !important';

		var bInstalled = sOrg != (oDummy.offsetWidth + '-' + oDummy.offsetHeight);
		
		document.body.removeChild(oDummy);
		
		return bInstalled;
					
	};	
})();
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of the operations related to string conversion. Ususally used to convert the IR value.
 * @name hp_StringConverterManager.js
 */
nhn.husky.StringConverterManager = jindo.$Class({
	name : "StringConverterManager",

	oConverters : null,

	$init : function(){
		this.oConverters = {};
		this.oConverters_DOM = {};
		this.oAgent = jindo.$Agent().navigator(); 
	},
	
	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["applyConverter", jindo.$Fn(this.applyConverter, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["addConverter", jindo.$Fn(this.addConverter, this).bind()]);
		this.oApp.exec("ADD_APP_PROPERTY", ["addConverter_DOM", jindo.$Fn(this.addConverter_DOM, this).bind()]);
	},
	
	applyConverter : function(sRuleName, sContents, oDocument){
		//stringÀ» ³Ö´Â ÀÌÀ¯:IEÀÇ °æ¿ì,º»¹® ¾Õ¿¡ ÀÖ´Â html ÁÖ¼®ÀÌ »èÁ¦µÇ´Â °æ¿ì°¡ ÀÖ±â¶§¹®¿¡ ÀÓ½Ã stringÀ» Ãß°¡ÇØÁØ°ÍÀÓ.
		var sTmpStr =  "@"+(new Date()).getTime()+"@";
		var rxTmpStr = new RegExp(sTmpStr, "g");
		
		var oRes = {sContents:sTmpStr+sContents};
		
		oDocument = oDocument || document;
		
		this.oApp.exec("MSG_STRING_CONVERTER_STARTED", [sRuleName, oRes]);
//		this.oApp.exec("MSG_STRING_CONVERTER_STARTED_"+sRuleName, [oRes]);

		var aConverters;
		sContents = oRes.sContents;
		aConverters = this.oConverters_DOM[sRuleName];
		if(aConverters){
			var elContentsHolder = oDocument.createElement("DIV");
			elContentsHolder.innerHTML = sContents;
			
			for(var i=0; i<aConverters.length; i++){
				aConverters[i](elContentsHolder);
			}
			sContents = elContentsHolder.innerHTML; 
			// ³»¿ë¹°¿¡ EMBEDµîÀÌ ÀÖÀ» °æ¿ì IE¿¡¼­ ÆäÀÌÁö ³ª°¥ ¶§ ±ÇÇÑ ¿À·ù ¹ß»ý ÇÒ ¼ö ÀÖ¾î ¸í½ÃÀûÀ¸·Î ³ëµå »èÁ¦.
			
			if(!!elContentsHolder.parentNode){
				elContentsHolder.parentNode.removeChild(elContentsHolder);
			}
			elContentsHolder = null;
			
			
			//IEÀÇ °æ¿ì, sContents¸¦ innerHTML·Î ³Ö´Â °æ¿ì string°ú <p>tag »çÀÌ¿¡ '\n\'°³Çà¹®ÀÚ¸¦ ³Ö¾îÁØ´Ù. 
			if( jindo.$Agent().navigator().ie ){
				sTmpStr = sTmpStr +'(\r\n)?'; //ie+win¿¡¼­´Â °³ÇàÀÌ \r\n·Î µé¾î°¨.
				rxTmpStr = new RegExp(sTmpStr , "g");
			}
		}
		
		aConverters = this.oConverters[sRuleName];
		if(aConverters){
			for(var i=0; i<aConverters.length; i++){
				var sTmpContents = aConverters[i](sContents);
				if(typeof sTmpContents != "undefined"){
					sContents = sTmpContents;
				}
			}
		}

		oRes = {sContents:sContents};
		this.oApp.exec("MSG_STRING_CONVERTER_ENDED", [sRuleName, oRes]);
		
		oRes.sContents = oRes.sContents.replace(rxTmpStr, "");
		return oRes.sContents;
	},

	$ON_ADD_CONVERTER : function(sRuleName, funcConverter){
		var aCallerStack = this.oApp.aCallerStack;
		funcConverter.sPluginName = aCallerStack[aCallerStack.length-2].name;
		this.addConverter(sRuleName, funcConverter);
	},

	$ON_ADD_CONVERTER_DOM : function(sRuleName, funcConverter){
		var aCallerStack = this.oApp.aCallerStack;
		funcConverter.sPluginName = aCallerStack[aCallerStack.length-2].name;
		this.addConverter_DOM(sRuleName, funcConverter);
	},

	addConverter : function(sRuleName, funcConverter){
		var aConverters = this.oConverters[sRuleName];
		if(!aConverters){
			this.oConverters[sRuleName] = [];
		}

		this.oConverters[sRuleName][this.oConverters[sRuleName].length] = funcConverter;
	},

	addConverter_DOM : function(sRuleName, funcConverter){
		var aConverters = this.oConverters_DOM[sRuleName];
		if(!aConverters){
			this.oConverters_DOM[sRuleName] = [];
		}

		this.oConverters_DOM[sRuleName][this.oConverters_DOM[sRuleName].length] = funcConverter;
	}
});
//}
/*[
 * ATTACH_HOVER_EVENTS
 *
 * ÁÖ¾îÁø HTML¿¤¸®¸ÕÆ®¿¡ Hover ÀÌº¥Æ® ¹ß»ý½Ã Æ¯Á¤ Å¬·¡½º°¡ ÇÒ´ç µÇµµ·Ï ¼³Á¤
 *
 * aElms array Hover ÀÌº¥Æ®¸¦ °É HTML Element ¸ñ·Ï
 * sHoverClass string Hover ½Ã¿¡ ÇÒ´ç ÇÒ Å¬·¡½º
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc Husky Framework¿¡¼­ ÀÚÁÖ »ç¿ëµÇ´Â À¯Æ¿¼º ¸Þ½ÃÁö¸¦ Ã³¸®ÇÏ´Â ÇÃ·¯±×ÀÎ
 */
 nhn.husky.Utils = jindo.$Class({
	name : "Utils",

	$init : function(){
		var oAgentInfo = jindo.$Agent();
		var oNavigatorInfo = oAgentInfo.navigator();

		if(oNavigatorInfo.ie && oNavigatorInfo.version == 6){
			try{
				document.execCommand('BackgroundImageCache', false, true);
			}catch(e){}
		}
	},
	
	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["htBrowser", jindo.$Agent().navigator()]);
	},
	
	$ON_ATTACH_HOVER_EVENTS : function(aElms, htOptions){
		htOptions = htOptions || [];
		var sHoverClass = htOptions.sHoverClass || "hover";
		var fnElmToSrc = htOptions.fnElmToSrc || function(el){return el};
		var fnElmToTarget = htOptions.fnElmToTarget || function(el){return el};
		
		if(!aElms) return;
		
		var wfAddClass = jindo.$Fn(function(wev){
			jindo.$Element(fnElmToTarget(wev.currentElement)).addClass(sHoverClass);
		}, this);
		
		var wfRemoveClass = jindo.$Fn(function(wev){
			jindo.$Element(fnElmToTarget(wev.currentElement)).removeClass(sHoverClass);
		}, this);
		
		for(var i=0, len = aElms.length; i<len; i++){
			var elSource = fnElmToSrc(aElms[i]);
			
			wfAddClass.attach(elSource, "mouseover");
			wfRemoveClass.attach(elSource, "mouseout");
			
			wfAddClass.attach(elSource, "focus");
			wfRemoveClass.attach(elSource, "blur");
		}
	}
});
/*[
 * SE_FIT_IFRAME
 *
 * ½º¸¶Æ®¿¡µðÅÍ »çÀÌÁî¿¡ ¸Â°Ô iframe»çÀÌÁî¸¦ Á¶ÀýÇÑ´Ù.
 *
 * none
 *
---------------------------------------------------------------------------]*/
/**
 * @pluginDesc ¿¡µðÅÍ¸¦ ½Î°í ÀÖ´Â iframe »çÀÌÁî Á¶ÀýÀ» ´ã´çÇÏ´Â ÇÃ·¯±×ÀÎ
 */
nhn.husky.SE_OuterIFrameControl = $Class({
	name : "SE_OuterIFrameControl",
	oResizeGrip : null,

	$init : function(oAppContainer){
		// page up, page down, home, end, left, up, right, down
		this.aHeightChangeKeyMap = [-100, 100, 500, -500, -1, -10, 1, 10];
	
		this._assignHTMLObjects(oAppContainer);

		//Å°º¸µå ÀÌº¥Æ®
		this.$FnKeyDown = $Fn(this._keydown, this);
		if(this.oResizeGrip){
			this.$FnKeyDown.attach(this.oResizeGrip, "keydown");
		}
		
		//¸¶¿ì½º ÀÌº¥Æ® 
		if(!!jindo.$Agent().navigator().ie){
			this.$FnMouseDown = $Fn(this._mousedown, this);
			this.$FnMouseMove = $Fn(this._mousemove, this);
			this.$FnMouseMove_Parent = $Fn(this._mousemove_parent, this);
			this.$FnMouseUp = $Fn(this._mouseup, this);
			
			if(this.oResizeGrip){
				this.$FnMouseDown.attach(this.oResizeGrip, "mousedown");
			}
		}	
	},

	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = $(oAppContainer) || document;

		this.oResizeGrip = cssquery.getSingle(".husky_seditor_editingArea_verticalResizer", oAppContainer);
		
		this.elIFrame = window.frameElement;
		this.welIFrame = $Element(this.elIFrame);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("SE_FIT_IFRAME", []);
	},

	$ON_MSG_EDITING_AREA_SIZE_CHANGED : function(){
		this.oApp.exec("SE_FIT_IFRAME", []);
	},

	$ON_SE_FIT_IFRAME : function(){
		this.elIFrame.style.height = document.body.offsetHeight+"px";
	},
	
	$AFTER_RESIZE_EDITING_AREA_BY : function(ipWidthChange, ipHeightChange){
		this.oApp.exec("SE_FIT_IFRAME", []);
	},
	
	_keydown : function(oEvent){
		var oKeyInfo = oEvent.key();

		// 33, 34: page up/down, 35,36: end/home, 37,38,39,40: left, up, right, down
		if(oKeyInfo.keyCode >= 33 && oKeyInfo.keyCode <= 40){
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", []);
			this.oApp.exec("RESIZE_EDITING_AREA_BY", [0, this.aHeightChangeKeyMap[oKeyInfo.keyCode-33]]);
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", []);

			oEvent.stop();
		}
	},
		
	_mousedown : function(oEvent){
		this.iStartHeight = oEvent.pos().clientY;
		this.iStartHeightOffset = oEvent.pos().layerY;

		this.$FnMouseMove.attach(document, "mousemove");
		this.$FnMouseMove_Parent.attach(parent.document, "mousemove");
		
		this.$FnMouseUp.attach(document, "mouseup");		
		this.$FnMouseUp.attach(parent.document, "mouseup");

		this.iStartHeight = oEvent.pos().clientY;
		this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", [this.$FnMouseDown, this.$FnMouseMove, this.$FnMouseUp]);
	},

	_mousemove : function(oEvent){
		var iHeightChange = oEvent.pos().clientY - this.iStartHeight;
		this.oApp.exec("RESIZE_EDITING_AREA_BY", [0, iHeightChange]);
	},

	_mousemove_parent : function(oEvent){
		var iHeightChange = oEvent.pos().pageY - (this.welIFrame.offset().top + this.iStartHeight);
		this.oApp.exec("RESIZE_EDITING_AREA_BY", [0, iHeightChange]);
	},

	_mouseup : function(oEvent){
		this.$FnMouseMove.detach(document, "mousemove");
		this.$FnMouseMove_Parent.detach(parent.document, "mousemove");
		this.$FnMouseUp.detach(document, "mouseup");
		this.$FnMouseUp.detach(parent.document, "mouseup");

		this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", [this.$FnMouseDown, this.$FnMouseMove, this.$FnMouseUp]);
	}
});
// Sample plugin. Use CTRL+T to toggle the toolbar
nhn.husky.SE_ToolbarToggler = $Class({
	name : "SE_ToolbarToggler",
	bUseToolbar : true,
	
	$init : function(oAppContainer, bUseToolbar){
		this._assignHTMLObjects(oAppContainer, bUseToolbar);
	},

	_assignHTMLObjects : function(oAppContainer, bUseToolbar){
		oAppContainer = $(oAppContainer) || document;
	
		this.toolbarArea = cssquery.getSingle(".se2_tool", oAppContainer);
		
		//¼³Á¤ÀÌ ¾ø°Å³ª, »ç¿ëÇÏ°Ú´Ù°í Ç¥½ÃÇÑ °æ¿ì block Ã³¸®
		if( typeof(bUseToolbar) == 'undefined' || bUseToolbar === true){
			this.toolbarArea.style.display = "block";
		}else{
			this.toolbarArea.style.display = "none";		
		}
	},
	
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+t", "SE_TOGGLE_TOOLBAR", []]);
	},
	
	$ON_SE_TOGGLE_TOOLBAR : function(){
		this.toolbarArea.style.display = (this.toolbarArea.style.display == "none")?"block":"none";
		this.oApp.exec("MSG_EDITING_AREA_SIZE_CHANGED", []);
	}
});
//{
/**
 * @fileOverview This file contains Husky plugin that takes care of loading css files dynamically
 * @name hp_SE2B_CSSLoader.js
 */
nhn.husky.SE2B_CSSLoader = jindo.$Class({
	name : "SE2B_CSSLoader",
	bCssLoaded : false,
	
	// load & continue with the message right away.
	aInstantLoadTrigger : ["OPEN_QE_LAYER", "SHOW_ACTIVE_LAYER", "SHOW_DIALOG_LAYER"],
	// if a rendering bug occurs in IE, give some delay before continue processing the message.
	aDelayedLoadTrigger : ["MSG_SE_OBJECT_EDIT_REQUESTED", "OBJECT_MODIFY", "MSG_SE_DUMMY_OBJECT_EDIT_REQUESTED", "TOGGLE_TOOLBAR_ACTIVE_LAYER", "SHOW_TOOLBAR_ACTIVE_LAYER"],

	$init : function(){
		this.htOptions = nhn.husky.SE2M_Configuration.SE2B_CSSLoader;
			
		// only IE's slow
		if(!jindo.$Agent().navigator().ie){
			this.loadSE2CSS();
		}else{
			for(var i=0, nLen = this.aInstantLoadTrigger.length; i<nLen; i++){
				this["$BEFORE_"+this.aInstantLoadTrigger[i]] = jindo.$Fn(function(){
					this.loadSE2CSS();
				}, this).bind();
			}
			
			for(var i=0, nLen = this.aDelayedLoadTrigger.length; i<nLen; i++){
				var sMsg = this.aDelayedLoadTrigger[i];

				this["$BEFORE_"+this.aDelayedLoadTrigger[i]] = jindo.$Fn(function(sMsg){
					var aArgs = jindo.$A(arguments).$value();
					aArgs = aArgs.splice(1, aArgs.length-1);
					return this.loadSE2CSS(sMsg, aArgs);
				}, this).bind(sMsg);
			}
		}
	},
	
	/*
	$BEFORE_REEDIT_ITEM_ACTION : function(){
		return this.loadSE2CSS("REEDIT_ITEM_ACTION", arguments);
	},
	$BEFORE_OBJECT_MODIFY : function(){
		return this.loadSE2CSS("OBJECT_MODIFY", arguments);
	},
	$BEFORE_MSG_SE_DUMMY_OBJECT_EDIT_REQUESTED : function(){
		return this.loadSE2CSS("MSG_SE_DUMMY_OBJECT_EDIT_REQUESTED", arguments);
	},	
	$BEFORE_TOGGLE_DBATTACHMENT_LAYER : function(){
		return this.loadSE2CSS("TOGGLE_DBATTACHMENT_LAYER", arguments);
	},
	$BEFORE_SHOW_WRITE_REVIEW_DESIGN_SELECT_LAYER : function(){
		this.loadSE2CSS();
	},
	$BEFORE_OPEN_QE_LAYER : function(){
		this.loadSE2CSS();
	},
	$BEFORE_TOGGLE_TOOLBAR_ACTIVE_LAYER : function(){
		return this.loadSE2CSS("TOGGLE_TOOLBAR_ACTIVE_LAYER", arguments);
	},
	$BEFORE_SHOW_TOOLBAR_ACTIVE_LAYER : function(){
		return this.loadSE2CSS("SHOW_TOOLBAR_ACTIVE_LAYER", arguments);
	},
	$BEFORE_SHOW_ACTIVE_LAYER : function(){
		this.loadSE2CSS();
	},
	$BEFORE_SHOW_DIALOG_LAYER : function(){
		this.loadSE2CSS();
	},
	$BEFORE_TOGGLE_ITEM_LAYER : function(){
		return this.loadSE2CSS("TOGGLE_ITEM_LAYER", arguments);
	},
	*/

	// if a rendering bug occurs in IE, pass sMsg and oArgs to give some delay before the message is processed.
	loadSE2CSS : function(sMsg, oArgs){
		if(this.bCssLoaded){return true;}
		this.bCssLoaded = true;

		var fnCallback = null;
		if(sMsg){
			fnCallback = jindo.$Fn(this.oApp.exec, this.oApp).bind(sMsg, oArgs);
		}
		
		//nhn.husky.SE2M_Utils.loadCSS("css/smart_editor2.css");
		nhn.husky.SE2M_Utils.loadCSS(this.htOptions.sCSSBaseURI+"/smart_editor2_items.css", fnCallback);

		return false;
	}
});
//}
/**
 * @name nhn.husky.SE2B_Customize_ToolBar
 * @description ¸ÞÀÏ Àü¿ë Ä¿½ºÅÍ¸¶ÀÌÁî Åø¹Ù·Î ´õº¸±â ·¹ÀÌ¾î °ü¸®¸¸À» ´ã´çÇÏ°í ÀÖÀ½.
 * @class
 * @author HyeKyoung,NHN AjaxUI Lab, CMD Division
 * @version 0.1.0
 * @since
 */

nhn.husky.SE2B_Customize_ToolBar = jindo.$Class(/** @lends nhn.husky.SE2B_Customize_ToolBar */{
	name : "SE2B_Customize_ToolBar",
	/**
	 * @constructs
	 * @param {Object} oAppContainer ¿¡µðÅÍ¸¦ ±¸¼ºÇÏ´Â ÄÁÅ×ÀÌ³Ê
	 */
	$init : function(oAppContainer) {
		this._assignHTMLElements(oAppContainer);
	},
	$BEFORE_MSG_APP_READY : function(){
		this._addEventMoreButton();
	},
	
	/**
	 * @private
	 * @description DOM¿¤¸®¸ÕÆ®¸¦ ¼öÁýÇÏ´Â ¸Þ¼Òµå
	 * @param {Object} oAppContainer Åø¹Ù Æ÷ÇÔ ¿¡µðÅÍ¸¦ °¨½Î°í ÀÖ´Â div ¿¤¸®¸ÕÆ®
	 */
	_assignHTMLElements : function(oAppContainer) {
		this.oAppContainer = oAppContainer;
		this.elTextToolBarArea =  jindo.$$.getSingle("div.se2_tool");
		this.elTextMoreButton =  jindo.$$.getSingle("button.se2_text_tool_more", this.elTextToolBarArea);
		this.elTextMoreButtonParent = this.elTextMoreButton.parentNode;
		this.welTextMoreButtonParent = jindo.$Element(this.elTextMoreButtonParent);
		this.elMoreLayer =  jindo.$$.getSingle("div.se2_sub_text_tool");
	},

	_addEventMoreButton : function (){
		this.oApp.registerBrowserEvent(this.elTextMoreButton, "click", "EVENT_CLICK_EXPAND_VIEW");
		this.oApp.registerBrowserEvent(this.elMoreLayer, "click", "EVENT_CLICK_EXPAND_VIEW");			
	},
	
	$ON_EVENT_CLICK_EXPAND_VIEW : function(weEvent){
		this.oApp.exec("TOGGLE_EXPAND_VIEW", [this.elTextMoreButton]);
		weEvent.stop();
	},
	
	$ON_TOGGLE_EXPAND_VIEW : function(){
		if(!this.welTextMoreButtonParent.hasClass("active")){
			this.oApp.exec("SHOW_EXPAND_VIEW");
		} else {
			this.oApp.exec("HIDE_EXPAND_VIEW");
		}
	},
	
	$ON_CHANGE_EDITING_MODE : function(sMode){
		if(sMode != "WYSIWYG"){
			this.elTextMoreButton.disabled =true;
			this.welTextMoreButtonParent.removeClass("active");
			this.oApp.exec("HIDE_EXPAND_VIEW");
		}else{
			this.elTextMoreButton.disabled =false;
		}
	},
	
	$AFTER_SHOW_ACTIVE_LAYER : function(){
		this.oApp.exec("HIDE_EXPAND_VIEW");
	},
	
	$AFTER_SHOW_DIALOG_LAYER : function(){
		this.oApp.exec("HIDE_EXPAND_VIEW");
	},
	
	$ON_SHOW_EXPAND_VIEW : function(){
		this.welTextMoreButtonParent.addClass("active");
		this.elMoreLayer.style.display = "block";
	},
	
	$ON_HIDE_EXPAND_VIEW : function(){
		this.welTextMoreButtonParent.removeClass("active");
		this.elMoreLayer.style.display = "none";
	},
	
	/**
	 * CHANGE_EDITING_MODE¸ðµå ÀÌÈÄ¿¡ È£ÃâµÇ¾î¾ß ÇÔ. 
	 * WYSIWYG ¸ðµå°¡ È°¼ºÈ­µÇ±â Àü¿¡ È£ÃâÀÌ µÇ¸é APPLY_FONTCOLOR¿¡¼­ ¿¡·¯ ¹ß»ý.
	 */
	$ON_RESET_TOOLBAR : function(){
		if(this.oApp.getEditingMode() !== "WYSIWYG"){			
			return;
		}
		//½ºÆçÃ¼Å© ´Ý±â 
		this.oApp.exec("END_SPELLCHECK");		
		//¿­¸° ÆË¾÷À» ´Ý±â À§ÇØ¼­
		this.oApp.exec("DISABLE_ALL_UI");
		this.oApp.exec("ENABLE_ALL_UI");
		//±ÛÀÚ»ö°ú ±ÛÀÚ ¹è°æ»öÀ» Á¦¿ÜÇÑ ¼¼ÆÃ
		this.oApp.exec("RESET_STYLE_STATUS");
		this.oApp.exec("CHECK_STYLE_CHANGE");
		//ÃÖ±Ù »ç¿ëÇÑ ±ÛÀÚ»ö ¼ÂÆÃ.
		this.oApp.exec("APPLY_FONTCOLOR", ["#000000"]);
		//´õº¸±â ¿µ¿ª ´Ý±â.
		this.oApp.exec("HIDE_EXPAND_VIEW");
	}
});
if(typeof window.nhn=='undefined'){window.nhn = {};}
/**
 * @fileOverview This file contains a message mapping(Korean), which is used to map the message code to the actual message
 * @name husky_SE2B_Lang_ko_KR.js
 * @ unescape
 */
var oMessageMap = {
	'SE_EditingAreaManager.onExit' : '³»¿ëÀÌ º¯°æµÇ¾ú½À´Ï´Ù.',
	'SE_Color.invalidColorCode' : '»ö»ó ÄÚµå¸¦ ¿Ã¹Ù¸£°Ô ÀÔ·ÂÇØ ÁÖ¼¼¿ä. \n\n ¿¹) #000000, #FF0000, #FFFFFF, #ffffff, ffffff',
	'SE_Hyperlink.invalidURL' : 'ÀÔ·ÂÇÏ½Å URLÀÌ ¿Ã¹Ù¸£Áö ¾Ê½À´Ï´Ù.',
	'SE_FindReplace.keywordMissing' : 'Ã£À¸½Ç ´Ü¾î¸¦ ÀÔ·ÂÇØ ÁÖ¼¼¿ä.',
	'SE_FindReplace.keywordNotFound' : 'Ã£À¸½Ç ´Ü¾î°¡ ¾ø½À´Ï´Ù.',
	'SE_FindReplace.replaceAllResultP1' : 'ÀÏÄ¡ÇÏ´Â ³»¿ëÀÌ ÃÑ ',
	'SE_FindReplace.replaceAllResultP2' : '°Ç ¹Ù²î¾ú½À´Ï´Ù.',
	'SE_FindReplace.notSupportedBrowser' : 'ÇöÀç »ç¿ëÇÏ°í °è½Å ºê¶ó¿ìÀú¿¡¼­´Â »ç¿ëÇÏ½Ç¼ö ¾ø´Â ±â´ÉÀÔ´Ï´Ù.\n\nÀÌ¿ë¿¡ ºÒÆíÀ» µå·Á ÁË¼ÛÇÕ´Ï´Ù.',
	'SE_FindReplace.replaceKeywordNotFound' : '¹Ù²ð ´Ü¾î°¡ ¾ø½À´Ï´Ù',
	'SE_LineHeight.invalidLineHeight' : 'Àß¸øµÈ °ªÀÔ´Ï´Ù.',
	'SE_Footnote.defaultText' : '°¢ÁÖ³»¿ëÀ» ÀÔ·ÂÇØ ÁÖ¼¼¿ä',
	'SE.failedToLoadFlash' : 'ÇÃ·¡½Ã°¡ Â÷´ÜµÇ¾î ÀÖ¾î ÇØ´ç ±â´ÉÀ» »ç¿ëÇÒ ¼ö ¾ø½À´Ï´Ù.',
	'SE2M_EditingModeChanger.confirmTextMode' : 'ÅØ½ºÆ® ¸ðµå·Î ÀüÈ¯ÇÏ¸é ÀÛ¼ºµÈ ³»¿ëÀº À¯ÁöµÇ³ª, \n\n±Û²Ã µîÀÇ ÆíÁýÈ¿°ú¿Í ÀÌ¹ÌÁö µîÀÇ Ã·ºÎ³»¿ëÀÌ ¸ðµÎ »ç¶óÁö°Ô µË´Ï´Ù.\n\nÀüÈ¯ÇÏ½Ã°Ú½À´Ï±î?',
	'SE2M_FontNameWithLayerUI.sSampleText' : '°¡³ª´Ù¶ó'
};
