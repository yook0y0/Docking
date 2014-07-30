package org.docking.erbse.util;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class JsonParser {

	private static JsonParser instance;
	static
	{
		instance = new JsonParser();
	}

	private JsonParser(){

	}

	public static JsonParser getInstance()
	{
		return instance;
	}

	/** 
	 * ?Œë¼ë¯¸í„°ë¡??˜ê²¨ë°›ì? ?¤íŠ¸ë§?ë°°ì—´??JsonArray ?•íƒœ???¤íŠ¸ë§ìœ¼ë¡?br/>
	 * ë§Œë“¤??ê·?ê°’ì„ ë¦¬í„´?œë‹¤.<br/>
	 * ex) str[0]=0 , str[1]=0 , str[2]=0 -> [0,0,0]
	 */
	@SuppressWarnings("unchecked")
	public String jParseArr(String[] str) {

		JSONArray jArr = new JSONArray();

		for (int i = 0; i < str.length; i++) 
		{
			jArr.add(str[i]);
		}

		return jArr.toString();
	}

	/** 
	 * ?Œë¼ë¯¸í„°ë¡??˜ê²¨ë°›ì? ?ê°œ???¤íŠ¸ë§?ë°°ì—´ ?¤ê°’ê³?ë²¨ë¥˜ê°’ì„ JsonObject ?•íƒœ???¤íŠ¸ë§ìœ¼ë¡?br/>
	 * ë§Œë“¤??ê²°ê³¼ê°’ì„ ë¦¬í„´?œë‹¤. ?¤ê°’ê³?value ê°’ì? 1:1 ??‘???˜ì–´???˜ë©° ?¤ë¥¸ ?¬ì´ì¦ˆì˜<br/>
	 * ë°°ì—´??ê²½ìš° ?ëŸ¬ ë©”ì‹œì§?? ë°˜í™˜?œë‹¤. ë³?™˜ ?±ê³µ??ê°?ë°°ì—´??ê°™ì? ?¸ë±?¤ëŠ” key:value êµ¬ì¡°ë¥?ê°??ê²??œë‹¤.<br/>
	 * ex) key[0]="1", key[1]="2", key[2]="3"<br/>
	 *       val[0]="??, val[1]="??, val[2]="??<br/>
	 * -> {"1":"??,"2":"??,"3":"??}
	 */
	@SuppressWarnings("unchecked")
	public String jParseObj(String[] key, String[] val) {
		JSONObject jObj = new JSONObject();

		for (int i = 0; i < val.length; i++) 
		{
			jObj.put(key[i], val[i]);
		}

		return jObj.toString();
	}
}
