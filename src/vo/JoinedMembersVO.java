package vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JoinedMembersVO
{
	private	Map<Integer,List<MemberVO>>	joinedMembers;
	
	public JoinedMembersVO()
	{
		joinedMembers = new HashMap<Integer,List<MemberVO>>();
	}
	
	public Map<Integer,List<MemberVO>> getJoinedMembers() 
	{
		return joinedMembers;
	}

	public void setJoinedMembers(Map<Integer,List<MemberVO>> joinedMembers) {
		this.joinedMembers = joinedMembers;
	}
	
	public void add(Integer shareStatus , MemberVO memberVO)	throws Exception
	{
		List<MemberVO>	list = joinedMembers.get(shareStatus);
		
		list.add(memberVO);
		
		joinedMembers.put(shareStatus, list);
	}
	
	public void modify(Integer shareStatus , MemberVO memberVO)	throws Exception
	{
		List<MemberVO>	list = joinedMembers.get(shareStatus);
		
		for(MemberVO temp : list)
		{
			if(temp.equals(memberVO))
			{
				return;
			}
		}
		
		if(shareStatus == 1)
		{
			joinedMembers.get(0).remove(memberVO);
		}
		
		else
		{
			joinedMembers.get(1).remove(memberVO);
		}
		
		list.add(memberVO);
		joinedMembers.put(shareStatus, list);
	}
	
	public void delete(MemberVO memberVO)	throws Exception
	{
		for(List<MemberVO> list : joinedMembers.values())
		{
			for(MemberVO temp : list)
			{
				if(temp.equals(memberVO))
				{
					list.remove(memberVO);
				}
			}
		}
	}
	
	public List<MemberVO> search()	throws Exception
	{
		List<MemberVO>	list = new ArrayList<MemberVO>();
		
		for(List<MemberVO> tempList : joinedMembers.values())
		{
			list.addAll(tempList);
		}
		
		return list;
	}
	
	public MemberVO searchById(String id)	throws Exception
	{
		MemberVO	memberVO = null;
		
		for(List<MemberVO> tempList : joinedMembers.values())
		{
			for(MemberVO temp : tempList)
			{
				if(temp.equals(id))
				{
					memberVO = temp;
					
					break;
				}
			}
		}
		
		return memberVO;
	}
	
	public List<MemberVO> searchByNickName(String nickName)	throws Exception
	{
		List<MemberVO>	list = new ArrayList<MemberVO>();
		
		for(List<MemberVO> tempList : joinedMembers.values())
		{
			for(MemberVO temp : tempList)
			{
				if(temp.equals(nickName))
				{
					list.add(temp);
				}
			}
		}
		
		return list;
	}
	
	public List<MemberVO> searchByShareStatus(Integer shareStatus)	throws Exception
	{
		return joinedMembers.get(shareStatus);
	}
}
