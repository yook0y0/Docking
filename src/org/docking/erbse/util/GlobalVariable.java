package org.docking.erbse.util;

public class GlobalVariable {
	
	/*
	 * VO Field name
	 */
	public static String[] DOC_VO_FIELD = new String[]{"documentId","writer","title","creationDate"};
	public static String[] CON_VO_FIELD = new String[]{"documentId","contentId","body","editorId"};
	public static String[] MEM_VO_FIELD = new String[]{"memberId","pw","memberName","type"};
	public static String[] MEMCON_VO_FIELD = new String[]{"documentId","memberId","memberPosition"};
	public static String[] EDITCODE_VO_FIELD = new String[]{"editorId","code","path"};
	public static String[] EDITREVIEW_VO_FIELD = new String[]{"reviewId","editorId","memberId","body","score","writtenDate","logInMember"};
	public static String[] EDIT_VO_FIELD = new String[]{"editorId","director","description","editorType","totalScore","reviewCount"};
	public static String[] TEMP_VO_FIELD = new String[]{"tempId","contentId","memberId","contentsBody","date"};
	public static String[] DEVELOPER_VIEW = new String[]{"editorId","editorType","totalScore","reviewCount"};

	/*
	 * return message
	 */
	public static String MEMBER_SUCCESS = "SUCCESS!";
	public static String MEMBER_FAIL = "FAIL!";
	
	/*
	 * 
	 */
	public static String EDITOR_START_PAGE = "start.jsp";
	public static String SERVER_ADDRESS = "http://localhost:8089/Docking";
}