package org.docking.erbse.util;

public class JsonParseData {
	/*
	 * Json Obj name
	 */
	public static String[] DOC_VO_FIELD = new String[]{"documentId","writer","title","creationDate"};
	public static String[] CON_VO_FIELD = new String[]{"documentId","contentId","body","editorId"};
	public static String[] MEM_VO_FIELD = new String[]{"memberId","pw","memberName","type"};
	public static String[] MEMCON_VO_FIELD = new String[]{"documentId","memberId","memberPosition"};
	public static String[] EDITCODE_VO_FIELD = new String[]{"editorId","code","path"};
	public static String[] EDITREVIEW_VO_FIELD = new String[]{"reviewId","editorId","memberId","body","score","writtenDate"};
	public static String[] EDIT_VO_FIELD = new String[]{"editorId","director","description","editorType"};
	public static String[] TEMP_VO_FIELD = new String[]{"tempId","contentId","memberId","contentsBody","date"};
}
