import React from 'react';
import { ActionCardContainer, ArrowAction, ContentDescription, DescriptionActionCard, ImageIcon, TitleActionCard } from './styled';
import IconArrow from '../../assets/icon-arrow.svg';
import IconCheck from '../../assets/icon-check-list.svg';
import Spinner from '../Spinner';

const ActionCard = (props: Props) => {
  const { title, description, icon, loading, success, onPress, plain } = props;

  return (
    <ActionCardContainer plain={plain} success={success} onClick={() => {
      if (onPress && !success && !loading) {
        onPress();
      }
    }}>
      <ImageIcon src={icon} />
      <ContentDescription>
        <TitleActionCard>{title}</TitleActionCard>
        <DescriptionActionCard>
          {description}
        </DescriptionActionCard>
      </ContentDescription>
      {loading ? <Spinner /> : !plain ? <ArrowAction src={!!success ? IconCheck : IconArrow} /> : <></>}
      
    </ActionCardContainer>
  )
};

type Props = {
  title: string;
  description: string;
  icon: string;
  loading?: boolean;
  success?: boolean;
  onPress?: () => void;
  plain?: boolean;
};

export default ActionCard;