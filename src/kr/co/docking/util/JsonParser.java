package kr.co.docking.util;

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
	 * 파라미터로 넘겨받은 스트링 배열을 JsonArray 형태의 스트링으로<br/>
	 * 만들어 그 값을 리턴한다.<br/>
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
	 * 파라미터로 넘겨받은 두개의 스트링 배열 키값과 벨류값을 JsonObject 형태의 스트링으로<br/>
	 * 만들어 결과값을 리턴한다. 키값과 value 값은 1:1 대응이 되어야 하며 다른 사이즈의<br/>
	 * 배열일 경우 에러 메시지를 반환한다. 변환 성공시 각 배열의 같은 인덱스는 key:value 구조를 가지게 된다.<br/>
	 * ex) key[0]="1", key[1]="2", key[2]="3"<br/>
	 *       val[0]="ㄱ", val[1]="ㄴ", val[2]="ㄷ"<br/>
	 * -> {"1":"ㄱ","2":"ㄱ","3":"ㄱ"}
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
